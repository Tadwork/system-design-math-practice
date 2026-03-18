const QUESTIONS_PER_GAME = 10;
const ACTIVE_ROUND_KEY = "sdep_active_round_v1";

const Game = (() => {
  let questions = [];
  let currentIndex = 0;
  let results = [];
  let mode = "idle";

  function persistState() {
    try {
      if (mode === "idle" || questions.length === 0) {
        localStorage.removeItem(ACTIVE_ROUND_KEY);
        return;
      }

      localStorage.setItem(ACTIVE_ROUND_KEY, JSON.stringify({
        version: 1,
        questions,
        currentIndex,
        results,
        mode,
        updatedAt: new Date().toISOString()
      }));
    } catch {}
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(ACTIVE_ROUND_KEY);
      if (!raw) return false;

      const saved = JSON.parse(raw);
      if (!saved || !Array.isArray(saved.questions) || !Array.isArray(saved.results)) return false;
      if (typeof saved.currentIndex !== "number" || saved.currentIndex < 0) return false;
      if (saved.questions.length === 0) return false;

      questions = saved.questions;
      currentIndex = Math.min(saved.currentIndex, questions.length);
      results = saved.results;
      mode = saved.mode === "feedback" ? "feedback" : "question";
      return true;
    } catch {
      return false;
    }
  }

  function clearActiveRound() {
    mode = "idle";
    questions = [];
    currentIndex = 0;
    results = [];
    persistState();
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startGame() {
    questions = shuffle(QUESTIONS).slice(0, QUESTIONS_PER_GAME);
    currentIndex = 0;
    results = [];
    mode = "question";
    persistState();
  }

  function hasSavedRound() {
    return mode !== "idle" && questions.length > 0 && currentIndex < questions.length;
  }

  function getMode() {
    return mode;
  }

  function getResumeSummary() {
    if (!hasSavedRound()) return null;
    return {
      current: currentIndex + 1,
      total: questions.length,
      mode
    };
  }

  function getLastEntry() {
    return results[results.length - 1] || null;
  }

  function getCurrentQuestion() {
    return questions[currentIndex] || null;
  }

  function getProgress() {
    return { current: currentIndex + 1, total: questions.length };
  }

  function submitAnswer(userInput) {
    const question = questions[currentIndex];
    const validation = validateAnswer(userInput, question);

    if (!validation.valid) {
      return { error: validation.error };
    }

    const entry = {
      question,
      userAnswer: validation.evaluated,
      rawInput: userInput.trim(),
      result: validation.correct ? "correct" : "incorrect",
      hint: validation.hint || null
    };
    results.push(entry);
    mode = "feedback";
    persistState();
    return entry;
  }

  function skipQuestion() {
    results.push({
      question: questions[currentIndex],
      userAnswer: null,
      rawInput: null,
      result: "skipped",
      hint: null
    });
    mode = "feedback";
    persistState();
  }

  function advance() {
    currentIndex++;
    mode = currentIndex < questions.length ? "question" : "idle";
    persistState();
    return currentIndex < questions.length;
  }

  function skipToResults() {
    while (currentIndex < questions.length) {
      results.push({
        question: questions[currentIndex],
        userAnswer: null,
        rawInput: null,
        result: "skipped",
        hint: null
      });
      currentIndex++;
    }
    mode = "idle";
    persistState();
  }

  function getResults() {
    const answered = results.filter(r => r.result !== "skipped");
    const correct = results.filter(r => r.result === "correct");
    const skipped = results.filter(r => r.result === "skipped");

    const topicMap = {};
    for (const r of results) {
      const t = r.question.topic;
      if (!topicMap[t]) topicMap[t] = { correct: 0, total: 0, skipped: 0 };
      if (r.result === "skipped") {
        topicMap[t].skipped++;
      } else {
        topicMap[t].total++;
        if (r.result === "correct") topicMap[t].correct++;
      }
    }

    return {
      total: results.length,
      answered: answered.length,
      correct: correct.length,
      skipped: skipped.length,
      accuracy: answered.length > 0 ? Math.round((correct.length / answered.length) * 100) : 0,
      topics: topicMap
    };
  }

  function saveResults() {
    const r = getResults();
    const entry = {
      date: new Date().toISOString(),
      correct: r.correct,
      answered: r.answered,
      skipped: r.skipped,
      accuracy: r.accuracy,
      topics: r.topics
    };

    try {
      const history = JSON.parse(localStorage.getItem("sdep_history") || "[]");
      history.push(entry);
      localStorage.setItem("sdep_history", JSON.stringify(history));
    } catch {}

    clearActiveRound();
  }

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem("sdep_history") || "[]");
    } catch {
      return [];
    }
  }

  loadState();

  return {
    startGame,
    hasSavedRound,
    getMode,
    getResumeSummary,
    getLastEntry,
    getCurrentQuestion,
    getProgress,
    submitAnswer,
    skipQuestion,
    advance,
    skipToResults,
    getResults,
    saveResults,
    getHistory
  };
})();
