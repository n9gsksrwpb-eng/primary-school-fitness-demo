# AGENTS.md

## Project name

Primary School Fitness Demo

## Project goal

Build a Chinese anonymous fitness test calculator demo for Chinese primary school grades 1–6.

The app calculates BMI, individual item scores, weighted standard score, rope skipping bonus score, total score, final level, weakness analysis, and basic exercise advice.

The scoring logic must follow the National Student Physical Health Standard, 2014 revision.

## Product positioning

This is an anonymous instant-query demo.

It is not a student health record system.
It is not a school data platform.
It is not a medical diagnosis tool.
It is not a weight-loss or treatment recommendation tool.

## Privacy boundary

The app must not collect personal identity information.

Do not collect:
- Student name
- Student ID
- School
- Class
- Phone number
- ID card number
- Address
- Precise birthday
- Photo
- Video
- Parent name
- Account identifier

The app may collect only anonymous test inputs for the current calculation:
- Grade
- Gender
- Height
- Weight
- Vital capacity
- 50m run
- Sit and reach
- One-minute rope skipping
- One-minute sit-ups, for grades 3–6
- 50m × 8 shuttle run, for grades 5–6

## Storage rules

Do not create a database.
Do not save individual records.
Do not use localStorage for fitness inputs or results.
Do not use sessionStorage for fitness inputs or results.
Do not use cookies for fitness inputs or results.
Do not persist individual test history.

The demo may keep temporary state in React component state only.

## Core technical rule

The LLM must never calculate scores.

All score calculations must be deterministic TypeScript functions.

If an LLM is added later, it may only generate explanations from the deterministic JSON result. It must not modify:
- BMI
- BMI category
- Individual item scores
- Standard score
- Bonus score
- Total score
- Final level
- Weakness ranking

## Technical stack

Use:
- Next.js
- TypeScript
- Tailwind CSS
- Vitest for unit tests

Use strict TypeScript.

Prefer pure functions.

Keep scoring logic separate from UI.

Do not hardcode scoring logic inside React components.

## Required project structure

Use this structure unless there is a strong reason to change it:

```text
src/
  app/
    page.tsx
    layout.tsx
    api/
      report/
        route.ts
  components/
    FitnessForm.tsx
    ResultReport.tsx
    ScoreChart.tsx
  lib/
    fitness/
      types.ts
      standards.ts
      engine.ts
      advice.ts
      validation.ts
  tests/
    fitness-engine.test.ts
docs/
  product-spec.md
  standards-checklist.md
  raw-standards.md
```