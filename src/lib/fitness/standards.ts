import type {
  BmiStandard,
  FitnessItem,
  Gender,
  Grade,
  ItemStandard,
  ItemWeight,
  ScoreThreshold,
} from "./types";

export const STANDARD_VERSION = "国家学生体质健康标准（2014年修订）";

export const SCORE_LEVELS = [
  100,
  95,
  90,
  85,
  80,
  78,
  76,
  74,
  72,
  70,
  68,
  66,
  64,
  62,
  60,
  50,
  40,
  30,
  20,
  10,
] as const;

export const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];

export const GENDERS: Gender[] = ["male", "female"];

export const FITNESS_ITEM_NAMES: Record<FitnessItem, string> = {
  bmi: "BMI",
  vitalCapacity: "肺活量",
  run50m: "50米跑",
  sitAndReach: "坐位体前屈",
  ropeSkipping: "一分钟跳绳",
  sitUps: "一分钟仰卧起坐",
  shuttleRun50x8: "50米×8往返跑",
};

export const FITNESS_ITEM_UNITS: Record<FitnessItem, string> = {
  bmi: "",
  vitalCapacity: "ml",
  run50m: "秒",
  sitAndReach: "cm",
  ropeSkipping: "次",
  sitUps: "次",
  shuttleRun50x8: "秒",
};

export const REQUIRED_ITEMS_BY_GRADE: Record<Grade, FitnessItem[]> = {
  1: ["bmi", "vitalCapacity", "run50m", "sitAndReach", "ropeSkipping"],
  2: ["bmi", "vitalCapacity", "run50m", "sitAndReach", "ropeSkipping"],
  3: ["bmi", "vitalCapacity", "run50m", "sitAndReach", "ropeSkipping", "sitUps"],
  4: ["bmi", "vitalCapacity", "run50m", "sitAndReach", "ropeSkipping", "sitUps"],
  5: [
    "bmi",
    "vitalCapacity",
    "run50m",
    "sitAndReach",
    "ropeSkipping",
    "sitUps",
    "shuttleRun50x8",
  ],
  6: [
    "bmi",
    "vitalCapacity",
    "run50m",
    "sitAndReach",
    "ropeSkipping",
    "sitUps",
    "shuttleRun50x8",
  ],
};

export const WEIGHTS_BY_GRADE: Record<Grade, ItemWeight[]> = {
  1: [
    { item: "bmi", weight: 0.15 },
    { item: "vitalCapacity", weight: 0.15 },
    { item: "run50m", weight: 0.2 },
    { item: "sitAndReach", weight: 0.3 },
    { item: "ropeSkipping", weight: 0.2 },
  ],
  2: [
    { item: "bmi", weight: 0.15 },
    { item: "vitalCapacity", weight: 0.15 },
    { item: "run50m", weight: 0.2 },
    { item: "sitAndReach", weight: 0.3 },
    { item: "ropeSkipping", weight: 0.2 },
  ],
  3: [
    { item: "bmi", weight: 0.15 },
    { item: "vitalCapacity", weight: 0.15 },
    { item: "run50m", weight: 0.2 },
    { item: "sitAndReach", weight: 0.2 },
    { item: "ropeSkipping", weight: 0.2 },
    { item: "sitUps", weight: 0.1 },
  ],
  4: [
    { item: "bmi", weight: 0.15 },
    { item: "vitalCapacity", weight: 0.15 },
    { item: "run50m", weight: 0.2 },
    { item: "sitAndReach", weight: 0.2 },
    { item: "ropeSkipping", weight: 0.2 },
    { item: "sitUps", weight: 0.1 },
  ],
  5: [
    { item: "bmi", weight: 0.15 },
    { item: "vitalCapacity", weight: 0.15 },
    { item: "run50m", weight: 0.2 },
    { item: "sitAndReach", weight: 0.1 },
    { item: "ropeSkipping", weight: 0.1 },
    { item: "sitUps", weight: 0.2 },
    { item: "shuttleRun50x8", weight: 0.1 },
  ],
  6: [
    { item: "bmi", weight: 0.15 },
    { item: "vitalCapacity", weight: 0.15 },
    { item: "run50m", weight: 0.2 },
    { item: "sitAndReach", weight: 0.1 },
    { item: "ropeSkipping", weight: 0.1 },
    { item: "sitUps", weight: 0.2 },
    { item: "shuttleRun50x8", weight: 0.1 },
  ],
};

export const HIGHER_BETTER_ITEMS: FitnessItem[] = [
  "vitalCapacity",
  "sitAndReach",
  "ropeSkipping",
  "sitUps",
];

export const LOWER_BETTER_ITEMS: FitnessItem[] = ["run50m", "shuttleRun50x8"];

/**
 * TODO:
 * Replace all mock BMI tables with official thresholds from:
 * 国家学生体质健康标准（2014年修订）
 *
 * Rule:
 * - status must be "official" only after manual verification.
 * - sourceNote must point to the exact section/table in docs/raw-standards.md.
 * - Do not invent missing thresholds.
 */
export const BMI_STANDARDS: BmiStandard[] = [
  {
    grade: 1,
    gender: "male",
    status: "mock",
    sourceNote: "MOCK only. Replace with official grade 1 male BMI table.",
    ranges: [
      { category: "低体重", maxInclusive: 13.4, score: 80 },
      { category: "正常", minInclusive: 13.5, maxInclusive: 18.1, score: 100 },
      { category: "超重", minInclusive: 18.2, maxInclusive: 20.3, score: 80 },
      { category: "肥胖", minInclusive: 20.4, score: 60 },
    ],
  },
];

/**
 * Helper for creating threshold arrays.
 *
 * The order must match SCORE_LEVELS:
 * 100, 95, 90, 85, 80, 78, 76, 74, 72, 70,
 * 68, 66, 64, 62, 60, 50, 40, 30, 20, 10
 */
export function thresholds(values: number[]): ScoreThreshold[] {
  if (values.length !== SCORE_LEVELS.length) {
    throw new Error(
      `Invalid threshold table length. Expected ${SCORE_LEVELS.length}, got ${values.length}.`
    );
  }

  return values.map((threshold, index) => ({
    score: SCORE_LEVELS[index],
    threshold,
  }));
}

/**
 * TODO:
 * Replace mock item standards with complete official standards.
 *
 * Completion target:
 * - grade 1–6
 * - male/female
 * - vitalCapacity
 * - run50m
 * - sitAndReach
 * - ropeSkipping
 * - sitUps for grades 3–6
 * - shuttleRun50x8 for grades 5–6
 *
 * Do not mark a table as official until manually checked.
 */
export const ITEM_STANDARDS: ItemStandard[] = [
  {
    grade: 1,
    gender: "male",
    item: "vitalCapacity",
    direction: "higher_better",
    unit: "ml",
    status: "mock",
    sourceNote: "MOCK only. Replace with official grade 1 male vital capacity table.",
    thresholds: thresholds([
      1700,
      1600,
      1500,
      1400,
      1300,
      1240,
      1180,
      1120,
      1060,
      1000,
      940,
      880,
      820,
      760,
      700,
      660,
      620,
      580,
      540,
      500,
    ]),
  },
  {
    grade: 1,
    gender: "male",
    item: "run50m",
    direction: "lower_better",
    unit: "秒",
    status: "mock",
    sourceNote: "MOCK only. Replace with official grade 1 male 50m table.",
    thresholds: thresholds([
      10.2,
      10.3,
      10.4,
      10.5,
      10.6,
      10.8,
      11.0,
      11.2,
      11.4,
      11.6,
      11.8,
      12.0,
      12.2,
      12.4,
      12.6,
      12.8,
      13.0,
      13.2,
      13.4,
      13.6,
    ]),
  },
];

/**
 * TODO:
 * Replace with the official one-minute rope skipping bonus table/rule.
 *
 * Requirements:
 * - Bonus score must be capped at 20.
 * - Total score must be capped at 120.
 * - Do not invent official bonus thresholds.
 */
export interface RopeSkippingBonusRule {
  grade: Grade;
  gender: Gender;
  status: "mock" | "official" | "todo";
  sourceNote: string;
  maxBonus: number;
  /**
   * Current placeholder:
   * eachExtraCountPerBonusPoint is only a mock implementation field.
   * Replace with official data if the official table uses a grade/gender-specific mapping.
   */
  eachExtraCountPerBonusPoint?: number;
}

export const ROPE_SKIPPING_BONUS_RULES: RopeSkippingBonusRule[] = [
  {
    grade: 1,
    gender: "male",
    status: "mock",
    sourceNote: "MOCK only. Replace with official rope skipping bonus rule/table.",
    maxBonus: 20,
    eachExtraCountPerBonusPoint: 2,
  },
];

export function getRequiredItemsByGrade(grade: Grade): FitnessItem[] {
  return REQUIRED_ITEMS_BY_GRADE[grade];
}

export function getWeightsByGrade(grade: Grade): ItemWeight[] {
  return WEIGHTS_BY_GRADE[grade];
}

export function findBmiStandard(grade: Grade, gender: Gender): BmiStandard | undefined {
  return BMI_STANDARDS.find((standard) => {
    return standard.grade === grade && standard.gender === gender;
  });
}

export function findItemStandard(
  grade: Grade,
  gender: Gender,
  item: Exclude<FitnessItem, "bmi">
): ItemStandard | undefined {
  return ITEM_STANDARDS.find((standard) => {
    return (
      standard.grade === grade &&
      standard.gender === gender &&
      standard.item === item
    );
  });
}
