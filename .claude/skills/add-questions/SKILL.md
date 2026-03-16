---
name: add-questions
description: Research and add new system design estimation questions to the question bank. Use when you want to expand the question set with new topics or more questions for existing topics.
allowed-tools: Read, Edit, WebSearch, WebFetch, Grep, Glob
---

# Add New System Design Estimation Questions

## Step 1: Understand the current question bank

Read `js/questions.js` to understand:
- The question format (id, topic, question, unit, acceptableRange, referenceAnswer, explanation, tip)
- Which topics exist and how many questions each topic has
- The style and difficulty level of existing questions

## Step 2: Determine what to add

If `$ARGUMENTS` specifies a topic or focus area, add questions for that. Otherwise, identify gaps — topics with fewer questions or important system design concepts not yet covered.

Good candidate topics for new questions:
- DNS and CDN performance
- Disk I/O and SSD vs HDD throughput
- Network bandwidth and latency
- Microservices communication overhead
- Rate limiting and throttling
- Data serialization (JSON vs Protobuf sizes)
- Connection pooling
- Bloom filters and probabilistic data structures
- Sharding strategies
- Write-ahead logs and durability

## Step 3: Research real-world numbers

Use WebSearch to find current, realistic numbers for your questions. System design estimates should be grounded in real infrastructure specs:
- Actual Redis/Memcached throughput benchmarks
- Real database IOPS numbers
- Typical network latencies between regions
- Current cloud instance specs and pricing
- Industry-standard SLA numbers

Cite your sources in the explanation or tip when the numbers come from specific benchmarks.

## Step 4: Write new questions

Each question must follow this format exactly:

```js
{
  id: <next sequential id>,
  topic: "<topic name>",
  question: "<clear, specific question with all necessary numbers>",
  unit: "<what the answer should be expressed in>",
  acceptableRange: [<low>, <high>],  // ~0.5x to ~1.5x of reference
  referenceAnswer: <number>,
  explanation: "<step-by-step math showing how to get the answer>",
  tip: "<generalizable estimation technique>"
}
```

### Quality checklist for each new question:
- [ ] Math is verifiable step-by-step from the question's givens
- [ ] The question tests estimation/mental-math skill, not trivia
- [ ] All numbers needed to solve are in the question text
- [ ] The unit is clear and matches the expected answer
- [ ] The range allows for reasonable rounding but catches wrong orders of magnitude
- [ ] The tip teaches a reusable technique, not just the answer to this question
- [ ] The difficulty is appropriate for a system design interview

## Step 5: Add to the question bank

Edit `js/questions.js` to append the new questions to the `QUESTIONS` array. Place them near other questions of the same topic for readability.

After adding, bump the cache-busting version query strings in `index.html` (e.g. `?v=2` → `?v=3`).

## Step 6: Report

Summarize what was added:
- How many new questions
- Which topics they cover
- The new total question count
- Note if `QUESTIONS_PER_GAME` in `js/game.js` should be adjusted
