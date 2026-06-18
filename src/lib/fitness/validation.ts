import type { FitnessInput, FitnessItem, ValidationIssue, ValidationResult } from "./types";
import { getRequiredItemsByGrade } from "./standards";

const FIELD_BY_ITEM: Record<FitnessItem, keyof FitnessInput> = {
  bmi: "heightCm",
  vitalCapacity: "vitalCapacityMl",
  run50m: "run50mSeconds",
  sitAndReach: "sitAndReachCm",
  ropeSkipping: "ropeSkippingCount",
  sitUps: "sitUpsCount",
  shuttleRun50x8: "shuttleRun50x8Seconds",
};

const FORBIDDEN_PERSONAL_FIELDS = [
  "name",
  "studentId",
  "school",
  "className",
  "phone",
  "idCard",
  "address",
  "birthday",
  "photo",
  "video",
];

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function validateFitnessInput(input: FitnessInput): ValidationResult {
  const issues: ValidationIssue[] = [];

  const gradeIsValid = Number.isInteger(input.grade) && input.grade >= 1 && input.grade <= 6;
  if (!gradeIsValid) {
    issues.push({ field: "grade", message: "年级必须为 1–6。" });
  }

  if (input.gender !== "male" && input.gender !== "female") {
    issues.push({ field: "gender", message: "性别必须为 male 或 female。" });
  }

  for (const field of FORBIDDEN_PERSONAL_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      issues.push({ field, message: "不得收集可识别个人身份的信息。" });
    }
  }

  const requiredItems = gradeIsValid ? getRequiredItemsByGrade(input.grade) : [];
  for (const item of requiredItems) {
    if (item === "bmi") {
      if (!isPositiveNumber(input.heightCm)) {
        issues.push({ field: "heightCm", message: "身高必须为大于 0 的数字。" });
      }
      if (!isPositiveNumber(input.weightKg)) {
        issues.push({ field: "weightKg", message: "体重必须为大于 0 的数字。" });
      }
      continue;
    }

    const field = FIELD_BY_ITEM[item];
    if (!isPositiveNumber(input[field])) {
      issues.push({ field, message: "该年级需要填写此项目，且数值必须大于 0。" });
    }
  }

  return {
    ok: issues.length === 0,
    issues,
  };
}
