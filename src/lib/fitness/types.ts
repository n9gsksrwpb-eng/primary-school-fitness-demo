export type Gender = "male" | "female";

export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export type FitnessItem =
  | "bmi"
  | "vitalCapacity"
  | "run50m"
  | "sitAndReach"
  | "ropeSkipping"
  | "sitUps"
  | "shuttleRun50x8";

export type ScoreDirection = "higher_better" | "lower_better";

export type FinalLevel = "优秀" | "良好" | "及格" | "不及格";

export type BmiCategory = "低体重" | "正常" | "超重" | "肥胖" | "无法判定";

export type StandardStatus = "official" | "mock" | "todo";

export interface FitnessInput {
  grade: Grade;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  vitalCapacityMl: number;
  run50mSeconds: number;
  sitAndReachCm: number;
  ropeSkippingCount: number;
  sitUpsCount?: number;
  shuttleRun50x8Seconds?: number;
}

export interface BmiRange {
  category: BmiCategory;
  minInclusive?: number;
  maxInclusive?: number;
  score: number;
}

export interface BmiStandard {
  grade: Grade;
  gender: Gender;
  ranges: BmiRange[];
  sourceNote: string;
  status: StandardStatus;
}

export interface ScoreThreshold {
  score: number;
  threshold: number;
}

export interface ItemStandard {
  grade: Grade;
  gender: Gender;
  item: Exclude<FitnessItem, "bmi">;
  direction: ScoreDirection;
  unit: string;
  thresholds: ScoreThreshold[];
  sourceNote: string;
  status: StandardStatus;
}

export interface ItemWeight {
  item: FitnessItem;
  weight: number;
}

export interface ValidationIssue {
  field: keyof FitnessInput | string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  issues: ValidationIssue[];
}

export interface BmiResult {
  value: number;
  category: BmiCategory;
  score: number;
}

export interface ItemScoreResult {
  item: FitnessItem;
  itemName: string;
  rawValue: number;
  unit: string;
  score: number;
  weight: number;
  weightedScore: number;
  interpretation: string;
}

export interface FitnessReport {
  input: FitnessInput;
  standardVersion: string;
  bmi: BmiResult;
  itemScores: ItemScoreResult[];
  standardScore: number;
  bonusScore: number;
  totalScore: number;
  level: FinalLevel;
  weakItems: ItemScoreResult[];
  advice: ExerciseAdviceBlock[];
  privacyNotice: string;
  safetyNotice: string;
}

export interface ExerciseAdviceBlock {
  title: string;
  targetItems: FitnessItem[];
  weeklyPlan: WeeklyExercisePlan[];
  cautions: string[];
}

export interface WeeklyExercisePlan {
  week: 1 | 2 | 3 | 4;
  goal: string;
  actions: string[];
  duration: string;
  frequency: string;
  notes: string[];
}

export interface StandardsCompletenessIssue {
  grade: Grade;
  gender: Gender;
  item: FitnessItem;
  message: string;
}

export interface StandardsCompletenessResult {
  ok: boolean;
  issues: StandardsCompletenessIssue[];
}
