import type { ExerciseAdviceBlock, FitnessItem, ItemScoreResult } from "./types";

export const FITNESS_SAFETY_NOTICE =
  "本报告仅用于体育教学和健康教育参考，不构成医学诊断、治疗或处方。如运动中出现胸痛、头晕、呼吸困难、异常疲劳等情况，应停止运动并咨询医生、校医或专业体育教师。";

type AdviceTemplate = {
  title: string;
  targetItems: FitnessItem[];
  actions: string[];
  notes: string[];
};

const WEEK_BASE = [
  {
    week: 1,
    goal: "熟悉动作，建立轻松、规律的活动节奏。",
    duration: "每次 15–20 分钟",
    frequency: "每周 3 次",
  },
  {
    week: 2,
    goal: "保持动作质量，逐步提升连续完成能力。",
    duration: "每次 15–25 分钟",
    frequency: "每周 3 次",
  },
  {
    week: 3,
    goal: "在安全范围内小幅增加练习量。",
    duration: "每次 20–30 分钟",
    frequency: "每周 3–4 次",
  },
  {
    week: 4,
    goal: "巩固练习习惯，观察体感和动作稳定性。",
    duration: "每次 20–30 分钟",
    frequency: "每周 3–4 次",
  },
] as const;

export function generateExerciseAdvice(weakItems: ItemScoreResult[]): ExerciseAdviceBlock[] {
  const templates = collectAdviceTemplates(weakItems);

  if (templates.length === 0) {
    return [toAdviceBlock({
      title: "保持当前运动习惯",
      targetItems: [],
      actions: ["选择跑跳、球类、拉伸或亲子活动，保持每天有轻松身体活动。"],
      notes: ["以舒适、开心、能坚持为原则，运动后注意补水和放松。"],
    })];
  }

  return templates.map(toAdviceBlock);
}

function collectAdviceTemplates(weakItems: ItemScoreResult[]): AdviceTemplate[] {
  const templates: AdviceTemplate[] = [];
  const seen = new Set<string>();

  for (const weakItem of weakItems) {
    const template = templateForWeakItem(weakItem);
    if (!template || seen.has(template.title)) {
      continue;
    }
    seen.add(template.title);
    templates.push(template);
  }

  return templates;
}

function templateForWeakItem(weakItem: ItemScoreResult): AdviceTemplate | undefined {
  if (weakItem.item === "bmi") {
    if (weakItem.interpretation.includes("低体重")) {
      return {
        title: "BMI 低体重：规律活动与体能基础",
        targetItems: ["bmi"],
        actions: [
          "进行轻松跑跳、球类游戏和基础力量动作，如靠墙静蹲、跪姿俯撑。",
          "安排规律作息和日常活动，运动后关注精神状态和恢复感受。",
        ],
        notes: ["不做体重评价，不用同伴比较；如家长担心生长发育，应咨询医生或校医。"],
      };
    }

    if (weakItem.interpretation.includes("超重") || weakItem.interpretation.includes("肥胖")) {
      return {
        title: "BMI 超重/肥胖：温和提升日常活动量",
        targetItems: ["bmi"],
        actions: [
          "选择快走、跳短绳、低冲击游戏或球类活动，保持能正常说话的强度。",
          "减少久坐时间，每学习 40–60 分钟起身活动 3–5 分钟。",
        ],
        notes: ["不进行体型羞辱，不追求快速变化；重点是规律、安全和可持续。"],
      };
    }

    return undefined;
  }

  if (weakItem.item === "vitalCapacity") {
    return {
      title: "肺活量不足：呼吸节奏与有氧基础",
      targetItems: ["vitalCapacity"],
      actions: [
        "进行轻松慢跑、快走、跳短绳或拍球接力。",
        "练习鼻吸口呼、匀速呼吸和运动后放松呼吸。",
      ],
      notes: ["保持中等以下强度，出现胸闷、头晕或明显不适应立即停止。"],
    };
  }

  if (weakItem.item === "run50m") {
    return {
      title: "50米跑不足：速度协调与起跑基础",
      targetItems: ["run50m"],
      actions: [
        "练习摆臂、抬腿、小步跑和 10–20 米轻快加速跑。",
        "用接力、追逐游戏提升反应和协调。",
      ],
      notes: ["充分热身，跑量少而精，不安排连续大负荷冲刺。"],
    };
  }

  if (weakItem.item === "sitAndReach") {
    return {
      title: "坐位体前屈不足：柔韧性与活动度",
      targetItems: ["sitAndReach"],
      actions: [
        "进行腿后侧、髋部和小腿的温和拉伸。",
        "配合猫牛式、坐姿前伸等轻柔活动度练习。",
      ],
      notes: ["拉伸到轻微牵拉即可，不弹振、不硬压。"],
    };
  }

  if (weakItem.item === "ropeSkipping") {
    return {
      title: "跳绳不足：节奏与连续跳能力",
      targetItems: ["ropeSkipping"],
      actions: [
        "先练无绳节奏跳，再练 20–30 秒分组跳绳。",
        "关注手腕摇绳、前脚掌轻落地和稳定节奏。",
      ],
      notes: ["选择平整地面和合适鞋子，脚踝或膝盖不适时减少跳跃。"],
    };
  }

  if (weakItem.item === "sitUps") {
    return {
      title: "仰卧起坐不足：腰腹力量与核心稳定",
      targetItems: ["sitUps"],
      actions: [
        "练习仰卧卷腹、死虫式、平板支撑简化版等基础核心动作。",
        "每组次数少一些，保持动作平稳和呼吸自然。",
      ],
      notes: ["不拉拽颈部，不追求一次做很多，腰背不适时停止。"],
    };
  }

  if (weakItem.item === "shuttleRun50x8") {
    return {
      title: "50米×8往返跑不足：耐力与折返节奏",
      targetItems: ["shuttleRun50x8"],
      actions: [
        "进行轻松折返跑、变向跑游戏和中等节奏连续跑走。",
        "练习接近折返点时减速、转身和再启动。",
      ],
      notes: ["以稳定完成为目标，不做过量往返；注意场地防滑。"],
    };
  }

  return undefined;
}

function toAdviceBlock(template: AdviceTemplate): ExerciseAdviceBlock {
  return {
    title: template.title,
    targetItems: template.targetItems,
    weeklyPlan: WEEK_BASE.map((week) => ({
      week: week.week,
      goal: week.goal,
      actions: template.actions,
      duration: week.duration,
      frequency: week.frequency,
      notes: template.notes,
    })),
    cautions: [FITNESS_SAFETY_NOTICE],
  };
}
