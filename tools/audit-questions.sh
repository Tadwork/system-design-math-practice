#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
QUESTIONS_FILE="$PROJECT_DIR/js/questions.js"

FIX_MODE=false
if [[ "${1:-}" == "--fix" ]]; then
  FIX_MODE=true
fi

if ! command -v claude &>/dev/null; then
  echo "Error: claude CLI not found. Install Claude Code first."
  exit 1
fi

if [[ "$FIX_MODE" == true ]]; then
  echo "Auditing questions and applying fixes..."
  claude -p \
    --allowedTools "Read,Edit,Write" \
    "You are auditing the system design estimation question bank in $QUESTIONS_FILE.

For EACH question, verify:
1. The math in the explanation is correct (actually compute it step by step)
2. The referenceAnswer matches the math
3. The acceptableRange is reasonable (~0.5x to ~1.5x of the reference, unless the question warrants tighter bounds)
4. The tip is helpful and accurate
5. The unit label matches what the question asks for
6. The question is clearly worded and unambiguous

If you find ANY errors, fix them directly in the file using the Edit tool. After auditing all 30 questions, provide a summary of what you found and what you changed (if anything). If everything checks out, say so."
else
  echo "Auditing questions (read-only)..."
  claude -p \
    --allowedTools "Read" \
    "You are auditing the system design estimation question bank in $QUESTIONS_FILE.

Read the file, then for EACH of the 30 questions, verify:
1. The math in the explanation is correct (actually compute it step by step)
2. The referenceAnswer matches the math
3. The acceptableRange is reasonable (~0.5x to ~1.5x of the reference, unless the question warrants tighter bounds)
4. The tip is helpful and accurate
5. The unit label matches what the question asks for
6. The question is clearly worded and unambiguous

Output a report in this format:

## Question <id>: <topic>
- Math: ✓ or ✗ (show your computation if wrong)
- Range: ✓ or ✗ (explain if off)
- Tip: ✓ or ✗
- Issues: <description or 'None'>

At the end, provide a summary: how many questions have issues, and a prioritized list of fixes."
fi
