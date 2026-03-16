---
name: audit-questions
description: Audit the system design estimation question bank for math errors, bad ranges, unclear wording, or inaccurate tips. Use when you want to verify question quality.
allowed-tools: Read, Edit, Grep, Glob
---

# Audit System Design Estimation Questions

Read `js/questions.js` and audit every question in the `QUESTIONS` array.

## For each question, verify:

1. **Math correctness**: Compute the answer step by step from the question's givens. Show your work. Does your result match `referenceAnswer`?
2. **Range validity**: Is `acceptableRange` roughly 0.5x–1.5x of the reference answer? Flag ranges that are too tight (would reject reasonable estimates) or too loose (would accept clearly wrong answers).
3. **Unit consistency**: Does the `unit` field match what the question actually asks for? Would a user know what unit to answer in?
4. **Explanation accuracy**: Does the `explanation` string match the correct math? Are there arithmetic errors in the explanation text itself?
5. **Tip quality**: Is the `tip` actionable and correct? Does it teach a generalizable estimation technique?
6. **Question clarity**: Is the question unambiguous? Are all necessary values provided? Could a reasonable person misinterpret it?

## Output format

For each question, output:

```
## Q<id>: <topic> — <short description>
- Math: ✓ or ✗ <show computation if wrong>
- Range: ✓ or ✗ <explain if off>
- Unit: ✓ or ✗
- Explanation: ✓ or ✗
- Tip: ✓ or ✗
- Clarity: ✓ or ✗
- Issues: <description or "None">
```

## After the audit

Provide a summary:
- Total questions audited
- Number with issues
- Prioritized list of fixes needed

If `$ARGUMENTS` contains "fix" or "--fix", apply corrections directly to `js/questions.js` using the Edit tool. After fixing, bump the cache-busting version query strings in `index.html` (e.g. `?v=2` → `?v=3`).

If no arguments or just auditing, report only — do not edit files.
