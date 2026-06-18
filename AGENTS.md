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

## Required scoring modules

Implement these modules:

- BMI calculation
- BMI category scoring
- Grade-specific required item validation
- Item score lookup
- Direction handling:
  - higher_better
  - lower_better
- Grade-specific item weights
- Standard score calculation
- Rope skipping bonus calculation
- Total score calculation
- Final level calculation
- Weakness detection
- Basic exercise advice generation

## Grade-specific required items

Grades 1–2:

- BMI
- Vital capacity
- 50m run
- Sit and reach
- One-minute rope skipping

Grades 3–4:

- BMI
- Vital capacity
- 50m run
- Sit and reach
- One-minute rope skipping
- One-minute sit-ups

Grades 5–6:

- BMI
- Vital capacity
- 50m run
- Sit and reach
- One-minute rope skipping
- One-minute sit-ups
- 50m × 8 shuttle run

## Grade-specific weights

Grades 1–2:

- BMI: 15%
- Vital capacity: 15%
- 50m run: 20%
- Sit and reach: 30%
- One-minute rope skipping: 20%

Grades 3–4:

- BMI: 15%
- Vital capacity: 15%
- 50m run: 20%
- Sit and reach: 20%
- One-minute rope skipping: 20%
- One-minute sit-ups: 10%

Grades 5–6:

- BMI: 15%
- Vital capacity: 15%
- 50m run: 20%
- Sit and reach: 10%
- One-minute rope skipping: 10%
- One-minute sit-ups: 20%
- 50m × 8 shuttle run: 10%

## Final level rules

- 90.0 and above: 优秀
- 80.0 to 89.9: 良好
- 60.0 to 79.9: 及格
- 59.9 and below: 不及格

## Rope skipping bonus rule

For primary school students, one-minute rope skipping may produce bonus points after exceeding the 100-point threshold.

The bonus score must be capped at 20.

Do not let total score exceed 120.

If the exact bonus increment table is not complete, implement it as a dedicated TODO and make tests clearly show the missing data.

Do not invent missing official thresholds.

## Standards data rule

Use structured data in src/lib/fitness/standards.ts.

Do not invent scoring thresholds.

If a threshold table is incomplete, mark it with status: "todo" and make the completeness test fail until it is filled.

Every official threshold table must include a sourceNote field.

## UI requirements

The page language must be Simplified Chinese.

The page must include this notice:

“本工具为匿名即时体测查询 Demo。请不要输入姓名、学号、手机号、学校、班级、身份证号、家庭住址、照片等可识别个人身份的信息。本工具不保存个人档案，结果仅用于体育教学和健康教育参考，不构成医学诊断。”

The page must not contain input fields for:

- 姓名
- 学号
- 学校
- 班级
- 手机号
- 身份证号
- 地址
- 照片
- 视频

## Report output requirements

The report must include:

- 匿名体测总览
- BMI 与 BMI 状态
- 单项得分表
- 标准分
- 附加分
- 总分
- 等级
- 主要短板
- 4周基础运动建议
- 家长/教师提示
- 安全提示

## Safety requirements

Exercise advice must be:

- Age-appropriate
- Moderate
- Practical
- Non-shaming
- Non-diagnostic
- Non-medical

Do not recommend:

- Dieting
- Medication
- Weight-loss products
- Supplements
- Extreme exercise
- Punitive training
- High-intensity plans for untrained children

Always include:

“本报告仅用于体育教学和健康教育参考，不构成医学诊断、治疗或处方。如运动中出现胸痛、头晕、呼吸困难、异常疲劳等情况，应停止运动并咨询医生、校医或专业体育教师。”

## Testing requirements

Add unit tests for:

- BMI calculation
- BMI category scoring
- Required item validation by grade
- Direction handling: higher is better
- Direction handling: lower is better
- Grade 1–2 weight calculation
- Grade 3–4 weight calculation
- Grade 5–6 weight calculation
- Rope skipping bonus cap at 20
- Total score cap at 120
- Final level boundaries:
  - 90
  - 89.9
  - 80
  - 79.9
  - 60
  - 59.9
- Weak item detection
- No personal data fields in form schema
- No use of localStorage/sessionStorage/cookies for test data

## Build and test commands

Use these commands:

```bash
npm install
npm run dev
npm test
npm run build
npm run lint
```

If the project uses a different package manager, document the exact commands in README.md.

## Pull request expectations

Before submitting work:

- Run tests.
- Run build.
- Run lint.
- Confirm the UI does not collect personal identity information.
- Confirm scoring logic is not inside React components.
- Confirm no official standard threshold was invented.
- Document incomplete standard tables in docs/standards-checklist.md.

## Definition of done

A task is done only when:

- The app runs locally.
- The calculation engine is deterministic.
- Tests pass.
- Build passes.
- The UI is Chinese.
- The demo does not collect personal identity information.
- The standards data is either complete or clearly marked as incomplete.
- Known limitations are documented.