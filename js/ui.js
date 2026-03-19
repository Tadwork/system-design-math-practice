const UI = (() => {
  const screens = {
    start: document.getElementById("screen-start"),
    question: document.getElementById("screen-question"),
    feedback: document.getElementById("screen-feedback"),
    results: document.getElementById("screen-results")
  };

  const elTopic = document.getElementById("q-topic");
  const elQuestion = document.getElementById("q-text");
  const elUnit = document.getElementById("q-unit");
  const elInput = document.getElementById("q-input");
  const elError = document.getElementById("q-error");
  const elProgress = document.getElementById("q-progress");
  const elProgressBar = document.getElementById("q-progress-bar");

  const elFeedbackIcon = document.getElementById("fb-icon");
  const elFeedbackTitle = document.getElementById("fb-title");
  const elFeedbackHint = document.getElementById("fb-hint");
  const elFeedbackYours = document.getElementById("fb-yours");
  const elFeedbackRef = document.getElementById("fb-reference");
  const elFeedbackExplanation = document.getElementById("fb-explanation");
  const elFeedbackTip = document.getElementById("fb-tip");

  const elScore = document.getElementById("r-score");
  const elAccuracy = document.getElementById("r-accuracy");
  const elBreakdown = document.getElementById("r-breakdown");
  const elHistory = document.getElementById("r-history");

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function renderStartScreen() {
    renderHistoryOnStart();
    renderResumePanel();
    showScreen("start");
  }

  function renderResumePanel() {
    const panel = document.getElementById("resume-panel");
    const copy = document.getElementById("resume-copy");
    const summary = Game.getResumeSummary();

    if (!summary) {
      panel.style.display = "none";
      return;
    }

    panel.style.display = "flex";
    copy.textContent = summary.mode === "feedback"
      ? `Saved at question ${summary.current} of ${summary.total}, waiting on feedback.`
      : `Saved at question ${summary.current} of ${summary.total}.`;
  }

  function renderHistoryOnStart() {
    const container = document.getElementById("start-history");
    const history = Game.getHistory();
    if (history.length === 0) {
      container.style.display = "none";
      return;
    }

    container.style.display = "block";
    const recent = history.slice(-5).reverse();
    let html = "<h3 class='history-title'>Recent Practice Rounds</h3><div class='history-list'>";
    for (const h of recent) {
      const d = new Date(h.date);
      const dateStr = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      const timeStr = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      html += `<div class="history-row">
        <span class="history-date">${dateStr}, ${timeStr}</span>
        <span class="history-score">${h.correct}/${h.answered} (${h.accuracy}%)</span>
      </div>`;
    }
    html += "</div>";

    const allAccuracies = history.map(h => h.accuracy);
    const avg = Math.round(allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length);
    html += `<div class="history-avg">Average accuracy across ${history.length} practice round${history.length > 1 ? "s" : ""}: ${avg}%</div>`;

    container.innerHTML = html;
  }

  function renderQuestion() {
    const q = Game.getCurrentQuestion();
    const prog = Game.getProgress();

    elTopic.textContent = q.topic;
    elQuestion.textContent = q.question;
    elUnit.textContent = q.unit;
    elInput.value = "";
    elError.textContent = "";
    elProgress.textContent = `Question ${prog.current} of ${prog.total}`;
    elProgressBar.style.width = `${((prog.current - 1) / prog.total) * 100}%`;

    showScreen("question");
    elInput.focus();
  }

  function renderFeedback(entry) {
    const q = entry.question;
    const isCorrect = entry.result === "correct";
    const isSkipped = entry.result === "skipped";

    elFeedbackIcon.textContent = isSkipped ? "--" : isCorrect ? "\u2713" : "\u2717";
    elFeedbackIcon.className = "fb-icon " + (isSkipped ? "skipped" : isCorrect ? "correct" : "incorrect");

    if (isSkipped) {
      elFeedbackTitle.textContent = "Skipped";
      elFeedbackHint.textContent = "";
      elFeedbackYours.textContent = "";
    } else if (isCorrect) {
      elFeedbackTitle.textContent = "Correct!";
      elFeedbackHint.textContent = "";
      const display = entry.rawInput !== String(entry.userAnswer)
        ? `Your answer: ${entry.rawInput} = ${entry.userAnswer} ${q.unit}`
        : `Your answer: ${entry.userAnswer} ${q.unit}`;
      elFeedbackYours.textContent = display;
    } else {
      elFeedbackTitle.textContent = "Incorrect";
      elFeedbackHint.textContent = entry.hint === "too_low" ? "\u2193 Your estimate was too low" : "\u2191 Your estimate was too high";
      const display = entry.rawInput !== String(entry.userAnswer)
        ? `Your answer: ${entry.rawInput} = ${entry.userAnswer} ${q.unit}`
        : `Your answer: ${entry.userAnswer} ${q.unit}`;
      elFeedbackYours.textContent = display;
    }

    elFeedbackRef.textContent = `Reference: ${q.referenceAnswer} ${q.unit} (accepted: ${q.acceptableRange[0]}\u2013${q.acceptableRange[1]})`;
    elFeedbackExplanation.textContent = q.explanation;

    if (!isCorrect) {
      elFeedbackTip.textContent = q.tip;
      elFeedbackTip.style.display = "block";
    } else {
      elFeedbackTip.style.display = "none";
    }

    showScreen("feedback");
    document.getElementById("fb-next").focus();
  }

  function renderResults() {
    Game.saveResults();
    const r = Game.getResults();

    elScore.textContent = `${r.correct} / ${r.answered} correct`;
    elAccuracy.textContent = r.answered > 0 ? `${r.accuracy}% accuracy` : "No questions answered";
    if (r.skipped > 0) {
      elAccuracy.textContent += ` (${r.skipped} skipped)`;
    }

    elBreakdown.innerHTML = "";
    const topics = Object.entries(r.topics).sort((a, b) => a[0].localeCompare(b[0]));
    for (const [topic, data] of topics) {
      const row = document.createElement("div");
      row.className = "breakdown-row";

      const label = document.createElement("span");
      label.className = "breakdown-topic";
      label.textContent = topic;

      const score = document.createElement("span");
      score.className = "breakdown-score";
      let scoreText = `${data.correct}/${data.total}`;
      if (data.skipped > 0) scoreText += ` (${data.skipped} skipped)`;
      score.textContent = scoreText;

      const bar = document.createElement("div");
      bar.className = "breakdown-bar";
      const fill = document.createElement("div");
      fill.className = "breakdown-fill";
      fill.style.width = data.total > 0 ? `${(data.correct / data.total) * 100}%` : "0%";
      bar.appendChild(fill);

      row.appendChild(label);
      row.appendChild(score);
      row.appendChild(bar);
      elBreakdown.appendChild(row);
    }

    // Show history summary on results screen
    const history = Game.getHistory();
    if (history.length > 1) {
      const allAccuracies = history.map(h => h.accuracy);
      const avg = Math.round(allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length);
      elHistory.textContent = `Lifetime: ${history.length} practice round${history.length > 1 ? "s" : ""} played, ${avg}% average accuracy`;
      elHistory.style.display = "block";
    } else {
      elHistory.style.display = "none";
    }

    showScreen("results");
  }

  // Event listeners
  document.getElementById("btn-start").addEventListener("click", () => {
    Game.startGame();
    renderQuestion();
  });

  document.getElementById("btn-resume").addEventListener("click", () => {
    if (Game.getMode() === "feedback" && Game.getLastEntry()) {
      renderFeedback(Game.getLastEntry());
      return;
    }
    renderQuestion();
  });

  document.getElementById("btn-submit").addEventListener("click", () => {
    const result = Game.submitAnswer(elInput.value.trim());
    if (result.error) {
      elError.textContent = result.error;
      return;
    }
    renderFeedback(result);
  });

  document.getElementById("btn-skip").addEventListener("click", () => {
    Game.skipQuestion();
    const q = Game.getCurrentQuestion();
    renderFeedback({ question: q, result: "skipped", userAnswer: null, rawInput: null, hint: null });
  });

  document.getElementById("btn-finish").addEventListener("click", () => {
    Game.skipToResults();
    renderResults();
  });

  elInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("btn-submit").click();
    }
  });

  document.getElementById("fb-next").addEventListener("click", () => {
    const hasMore = Game.advance();
    if (hasMore) {
      renderQuestion();
    } else {
      renderResults();
    }
  });

  document.getElementById("btn-restart").addEventListener("click", () => {
    Game.startGame();
    renderQuestion();
  });

  // Initialize
  renderStartScreen();
})();
