function evaluateExpression(input) {
  const expr = input.trim();
  if (!expr) return NaN;

  // Only allow digits, decimal points, spaces, and +-*/ operators
  if (!/^[\d\s+\-*/.()]+$/.test(expr)) return NaN;

  try {
    // Use Function constructor to evaluate (safe since we validated the charset)
    const result = new Function("return (" + expr + ")")();
    return typeof result === "number" && isFinite(result) ? result : NaN;
  } catch {
    return NaN;
  }
}

function validateAnswer(userInput, question) {
  const parsed = evaluateExpression(userInput);

  if (isNaN(parsed) || parsed <= 0) {
    return { valid: false, error: "Please enter a positive number or expression (e.g. 1000 * 10 / 4)." };
  }

  const [low, high] = question.acceptableRange;

  if (parsed >= low && parsed <= high) {
    return { valid: true, correct: true, evaluated: parsed };
  }

  return {
    valid: true,
    correct: false,
    evaluated: parsed,
    hint: parsed < low ? "too_low" : "too_high"
  };
}
