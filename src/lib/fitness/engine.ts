import type {
  BmiResult,
  FinalLevel,
  FitnessInput,
  FitnessItem,
  FitnessReport,
  Gender,
  Grade,
  ItemScoreResult,
} from "./types";
import {
  findBmiStandard,
  findItemStandard,
  FITNESS_ITEM_NAMES,
  FITNESS_ITEM_UNITS,
  getRequiredItemsByGrade,
  getWeightsByGrade,
  ROPE_SKIPPING_BONUS_RULES,
  STANDARD_VERSION,
} from "./standards";
import { validateFitnessInput } from "./validation";

const PRIVACY_NOTICE =
  "本工具为匿名即时体测查询 Demo。请不要输入姓名、学号、手机号、学校、班级、身份证号、家庭住址、照片等可识别个人身份的信息。本工具不保存个人档案，结果仅用于体育教学和健康教育参考，不构成医学诊断。";

const SAFETY_NOTICE =
  "本报告仅用于体育教学和健康教育参考，不构成医学诊断、治疗或处方。如运动中出现胸痛、头晕、呼吸困难、异常疲劳等情况，应停止运动并咨询医生、校医或专业体育教师。";

const INPUT_VALUE_BY_ITEM: Record<Exclude<FitnessItem, "bmi">, keyof FitnessInput> = {
  vitalCapacity: "vitalCapacityMl",
  run50m: "run50mSeconds",
  sitAndReach: "sitAndReachCm",
  ropeSkipping: "ropeSkippingCount",
  sitUps: "sitUpsCount",
  shuttleRun50x8: "shuttleRun50x8Seconds",
};

export function calculateBmi(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) {
    return 0;
  }

  const heightM = heightCm / 100;
  return round(weightKg / (heightM * heightM), 1);
}

export function scoreBmi(params: {
  grade: Grade;
  gender: Gender;
  bmi: number;
}): BmiResult {
  const standard = findBmiStandard(params.grade, params.gender);
  if (!standard) {
    throw new Error(`Missing BMI standard table for grade ${params.grade}, ${params.gender}.`);
  }

  const range = standard.ranges.find((candidate) => {
    const aboveMin =
      candidate.minInclusive === undefined || params.bmi >= candidate.minInclusive;
    const belowMax =
      candidate.maxInclusive === undefined || params.bmi <= candidate.maxInclusive;
    return aboveMin && belowMax;
  });

  return {
    value: params.bmi,
    category: range?.category ?? "无法判定",
    score: range?.score ?? 0,
  };
}

export function scoreItem(params: {
  grade: Grade;
  gender: Gender;
  item: Exclude<FitnessItem, "bmi">;
  value: number;
}): number {
  const standard = findItemStandard(params.grade, params.gender, params.item);
  if (!standard) {
    throw new Error(
      `Missing item standard table for grade ${params.grade}, ${params.gender}, ${params.item}.`
    );
  }

  const threshold = standard.thresholds.find((candidate) => {
    if (standard.direction === "higher_better") {
      return params.value >= candidate.threshold;
    }
    return params.value <= candidate.threshold;
  });

  if (!threshold) {
    throw new Error(
      `Value ${params.value} is outside the available ${params.item} threshold table.`
    );
  }

  return threshold.score;
}

export function calculateRopeBonus(params: {
  grade: Grade;
  gender: Gender;
  ropeSkippingCount: number;
  ropeSkippingBaseScore: number;
}): number {
  if (params.ropeSkippingBaseScore < 100) {
    return 0;
  }

  const rule = ROPE_SKIPPING_BONUS_RULES.find((candidate) => {
    return candidate.grade === params.grade && candidate.gender === params.gender;
  });
  if (!rule?.eachExtraCountPerBonusPoint) {
    throw new Error(
      `Missing rope skipping bonus rule for grade ${params.grade}, ${params.gender}.`
    );
  }

  const baseStandard = findItemStandard(params.grade, params.gender, "ropeSkipping");
  const fullScoreThreshold = baseStandard?.thresholds.find((candidate) => {
    return candidate.score === 100;
  })?.threshold;
  if (fullScoreThreshold === undefined) {
    throw new Error(
      `Missing rope skipping 100-point threshold for grade ${params.grade}, ${params.gender}.`
    );
  }

  if (params.ropeSkippingCount <= fullScoreThreshold) {
    return 0;
  }

  const extraCount = params.ropeSkippingCount - fullScoreThreshold;
  return Math.min(rule.maxBonus, Math.floor(extraCount / rule.eachExtraCountPerBonusPoint));
}

export function getFinalLevel(totalScore: number): FinalLevel {
  if (totalScore >= 90) {
    return "优秀";
  }
  if (totalScore >= 80) {
    return "良好";
  }
  if (totalScore >= 60) {
    return "及格";
  }
  return "不及格";
}

export function generateFitnessReport(input: FitnessInput): FitnessReport {
  const validation = validateFitnessInput(input);
  if (!validation.ok) {
    throw new Error(validation.issues.map((issue) => issue.message).join("; "));
  }

  const bmi = scoreBmi({
    grade: input.grade,
    gender: input.gender,
    bmi: calculateBmi(input.heightCm, input.weightKg),
  });
  const weights = getWeightsByGrade(input.grade);

  const itemScores: ItemScoreResult[] = weights.map((weight) => {
    if (weight.item === "bmi") {
      return toItemScoreResult({
        item: "bmi",
        rawValue: bmi.value,
        unit: "",
        score: bmi.score,
        weight: weight.weight,
        interpretation: `BMI 状态：${bmi.category}`,
      });
    }

    const item = weight.item as Exclude<FitnessItem, "bmi">;
    const field = INPUT_VALUE_BY_ITEM[item];
    const rawValue = Number(input[field] ?? 0);
    const score = scoreItem({
      grade: input.grade,
      gender: input.gender,
      item,
      value: rawValue,
    });

    return toItemScoreResult({
      item,
      rawValue,
      unit: FITNESS_ITEM_UNITS[item],
      score,
      weight: weight.weight,
      interpretation: "已按当前标准表计算。",
    });
  });

  const standardScore = round(
    itemScores.reduce((sum, item) => sum + item.weightedScore, 0),
    1
  );
  const ropeScore = itemScores.find((item) => item.item === "ropeSkipping")?.score ?? 0;
  const bonusScore = calculateRopeBonus({
    grade: input.grade,
    gender: input.gender,
    ropeSkippingCount: input.ropeSkippingCount,
    ropeSkippingBaseScore: ropeScore,
  });
  const totalScore = Math.min(120, round(standardScore + bonusScore, 1));
  const weakItems = detectWeakItems(itemScores, bmi);

  return {
    input,
    standardVersion: STANDARD_VERSION,
    bmi,
    itemScores,
    standardScore,
    bonusScore,
    totalScore,
    level: getFinalLevel(totalScore),
    weakItems,
    advice: generateBasicAdvice(weakItems),
    privacyNotice: PRIVACY_NOTICE,
    safetyNotice: SAFETY_NOTICE,
  };
}

function toItemScoreResult(params: {
  item: FitnessItem;
  rawValue: number;
  unit: string;
  score: number;
  weight: number;
  interpretation: string;
}): ItemScoreResult {
  return {
    item: params.item,
    itemName: FITNESS_ITEM_NAMES[params.item],
    rawValue: params.rawValue,
    unit: params.unit,
    score: params.score,
    weight: params.weight,
    weightedScore: round(params.score * params.weight, 1),
    interpretation: params.interpretation,
  };
}

function detectWeakItems(itemScores: ItemScoreResult[], bmi: BmiResult): ItemScoreResult[] {
  const weakItems = itemScores.filter((item) => {
    if (item.item === "bmi") {
      return bmi.category !== "正常";
    }
    return item.score < 80;
  });

  return weakItems.sort((left, right) => left.score - right.score).slice(0, 3);
}

function generateBasicAdvice(weakItems: ItemScoreResult[]): FitnessReport["advice"] {
  const targetItems = weakItems.map((item) => item.item);
  if (targetItems.length === 0) {
    return [
      {
        title: "保持当前运动习惯",
        targetItems: getRequiredItemsByGrade(1).slice(0, 0),
        weeklyPlan: [1, 2, 3, 4].map((week) => ({
          week: week as 1 | 2 | 3 | 4,
          goal: "保持规律活动，巩固体测表现。",
          actions: ["每天进行轻松跑跳、拉伸或球类活动。"],
          duration: "每次 20–30 分钟",
          frequency: "每周 3–5 次",
          notes: ["以舒适、不疲劳为原则。"],
        })),
        cautions: [SAFETY_NOTICE],
      },
    ];
  }

  return [
    {
      title: "4周基础运动建议",
      targetItems,
      weeklyPlan: [1, 2, 3, 4].map((week) => ({
        week: week as 1 | 2 | 3 | 4,
        goal: week <= 2 ? "建立规律、温和的练习节奏。" : "在安全范围内小幅增加练习量。",
        actions: buildAdviceActions(targetItems),
        duration: week <= 2 ? "每次 15–20 分钟" : "每次 20–30 分钟",
        frequency: "每周 3 次",
        notes: ["先热身，后放松。", "动作质量优先，不做惩罚性训练。"],
      })),
      cautions: [SAFETY_NOTICE],
    },
  ];
}

function buildAdviceActions(items: FitnessItem[]): string[] {
  const actions = new Set<string>();
  for (const item of items) {
    if (item === "vitalCapacity") {
      actions.add("进行轻松慢跑、跳短绳或呼吸节奏练习。");
    } else if (item === "run50m") {
      actions.add("练习短距离加速跑和协调摆臂。");
    } else if (item === "sitAndReach") {
      actions.add("进行腿后侧和髋部温和拉伸。");
    } else if (item === "ropeSkipping") {
      actions.add("分组练习一分钟跳绳，注意落地轻柔。");
    } else if (item === "sitUps") {
      actions.add("进行低强度核心稳定练习。");
    } else if (item === "shuttleRun50x8") {
      actions.add("进行轻松折返跑和耐力游戏。");
    } else if (item === "bmi") {
      actions.add("保持规律作息和日常身体活动，不进行节食或极端训练。");
    }
  }
  return Array.from(actions);
}

function round(value: number, digits: number): number {
  const base = 10 ** digits;
  return Math.round(value * base) / base;
}
