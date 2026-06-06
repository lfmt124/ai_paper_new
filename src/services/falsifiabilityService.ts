import type { DatasetProfile, VariableSupportItem } from "../types";

// 可证伪性的核心是：是否有自变量、结果变量，以及可以被数据推翻的预期关系。
export function assessFalsifiability(dataset: DatasetProfile, variableSupport: VariableSupportItem[]) {
  const hasStrongVariable = variableSupport.some((item) => item.supportLevel === "strong");
  const hasDependentVariable = dataset.variables.some((variable) => variable.role === "dependent");
  const hasProcessData = dataset.variables.some((variable) => variable.role === "text" || variable.name.includes("revision"));
  // 有强支撑变量、结果变量和过程数据时，更容易把 idea 写成可验证假设。
  const score = 48 + (hasStrongVariable ? 18 : 0) + (hasDependentVariable ? 18 : 0) + (hasProcessData ? 10 : 0);

  return {
    score: Math.min(score, 92),
    summary: hasStrongVariable && hasDependentVariable
      ? "当前 idea 可以转化为可验证假设，例如核心变量升高是否会带来反馈采纳深度或写作表现变化。"
      : "当前 idea 还偏概念化，需要补充可观测变量，才能形成能被数据支持或推翻的假设。",
  };
}
