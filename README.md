# System Design Estimation Practice

A gamified, Anki-style web app for practicing back-of-napkin math for system design interviews. 10 random questions per round from a bank of 30+, covering multiple system design topics.

![Start screen](screenshots/start-screen.png)

## Features

- **30+ questions across multiple topics**: APIs, Databases, Scaling, CAP Theorem, Auth & Security, Load Balancers, Caching, Message Queues, Indexing, Failovers, Replication, Consistent Hashing, Networking, etc.
- **Expression input**: Type calculations like `1000 * 10 / 4` directly in the answer box
- **Instant feedback**: Correct/incorrect with directional hints (too high/too low), reference answers, explanations, and tips
- **Score tracking**: Per-topic breakdown after each game, historical scores persisted in localStorage
- **10 random questions per game**: Different mix each time from the full question bank

## Usage

Open `index.html` in a browser, or visit [system-design-math-practice.tzvi.dev](https://system-design-math-practice.tzvi.dev).

## Agent Skills

Two [Agent skills](https://agentskills.io/home) are included for managing the question bank:

```
/audit-questions          # Read-only audit of all questions (math, ranges, clarity)
/audit-questions --fix    # Audit and auto-apply corrections
/add-questions            # Research and add new questions (picks gaps automatically)
/add-questions DNS        # Add questions for a specific topic
```

## Tech Stack

Vanilla HTML/CSS/JS — no framework, no build step. Deployed to GitHub Pages.
