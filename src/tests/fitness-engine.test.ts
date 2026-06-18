import { describe, expect, it } from "vitest";
import type { FitnessInput } from "../lib/fitness/types";
import {
  calculateBmi,
  calculateRopeBonus,
  generateFitnessReport,
  getFinalLevel,
  scoreBmi,
  scoreItem,
} from "../lib/fitness/engine";
import { validateFitnessInput } from "../lib/fitness/validation";

const gradeOneMaleInput: FitnessInput = {
  grade: 1,
  gender: "male",
  heightCm: 140,
  weightKg: 35,
  vitalCapacityMl: 1700,
  run50mSeconds: 10.2,
  sitAndReachCm: 16.1,
  ropeSkippingCount: 109,
};

describe("fitness engine", () => {
  it("calculates BMI with one decimal place", () => {
    expect(calculateBmi(140, 35)).toBe(17.9);
  });

  it("scores BMI from the mock BMI table", () => {
    expect(scoreBmi({ grade: 1, gender: "male", bmi: 17.9 })).toEqual({
      value: 17.9,
      category: "正常",
      score: 100,
    });
  });

  it("validates required items by grade", () => {
    expect(validateFitnessInput(gradeOneMaleInput).ok).toBe(true);

    const invalidGradeThreeInput: FitnessInput = {
      ...gradeOneMaleInput,
      grade: 3,
    };
    const result = validateFitnessInput(invalidGradeThreeInput);
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.field === "sitUpsCount")).toBe(true);
  });

  it("rejects personal data fields in input objects", () => {
    const result = validateFitnessInput({
      ...gradeOneMaleInput,
      name: "测试学生",
    } as FitnessInput);

    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.field === "name")).toBe(true);
  });

  it("supports higher_better item scoring", () => {
    expect(
      scoreItem({
        grade: 1,
        gender: "male",
        item: "vitalCapacity",
        value: 1700,
      })
    ).toBe(100);
  });

  it("supports lower_better item scoring", () => {
    expect(
      scoreItem({
        grade: 1,
        gender: "male",
        item: "run50m",
        value: 10.2,
      })
    ).toBe(100);
  });

  it("throws a clear error when an item standard table is missing", () => {
    expect(() =>
      scoreItem({
        grade: 2,
        gender: "female",
        item: "run50m",
        value: 10,
      })
    ).toThrow("Missing item standard table");
  });

  it("calculates weighted standard score from item score times grade weight", () => {
    const report = generateFitnessReport(gradeOneMaleInput);
    expect(report.standardScore).toBe(100);
  });

  it("caps rope skipping bonus at 20", () => {
    expect(
      calculateRopeBonus({
        grade: 1,
        gender: "male",
        ropeSkippingCount: 999,
        ropeSkippingBaseScore: 100,
      })
    ).toBe(20);
  });

  it("caps total score at 120", () => {
    const report = generateFitnessReport({
      ...gradeOneMaleInput,
      ropeSkippingCount: 999,
    });
    expect(report.totalScore).toBe(120);
  });

  it.each([
    [90, "优秀"],
    [80, "良好"],
    [60, "及格"],
    [59.9, "不及格"],
  ] as const)("returns final level for %s", (score, level) => {
    expect(getFinalLevel(score)).toBe(level);
  });
});
