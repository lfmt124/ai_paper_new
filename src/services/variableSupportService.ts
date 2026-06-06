import type { DatasetProfile, VariableSupportItem, VariableSupportLevel } from "../types";

// 判断变量文本里是否出现 idea 需要的关键词。
// 后续如果接语义模型，可以把这里换成变量描述与研究问题的相似度判断。
function variableMatches(variableText: string, keywords: string[]): boolean {
  return keywords.some((keyword) => variableText.includes(keyword));
}

// 根据 idea 关键词粗略判断变量是否能支撑研究问题。
// 这里保留“missing”项，是为了提醒用户哪些关键变量需要补采或换题。
export function assessVariableSupport(ideaTitle: string, dataset: DatasetProfile): VariableSupportItem[] {
  const ideaText = ideaTitle.toLowerCase();
  // 目前针对主要 mock idea 写了两组关键词；新增领域时优先扩展这里或改成 LLM 生成关键词。
  const expectedKeywords = ideaText.includes("提示词")
    ? ["提示词", "prompt", "反馈", "采纳", "修改", "信心"]
    : ["反馈", "导师", "ai", "修改", "写作"];

  const supportedVariables = dataset.variables.map((variable) => {
    const variableText = `${variable.name} ${variable.label} ${variable.description}`.toLowerCase();
    const matched = variableMatches(variableText, expectedKeywords);
    const supportLevel: VariableSupportLevel = matched
      ? "strong"
      : variable.role === "control" || variable.role === "metadata"
        ? "partial"
        : "missing";

    return {
      variableName: variable.name,
      label: variable.label,
      supportLevel,
      reason: matched
        ? "该变量直接对应 idea 中的核心概念或结果变量。"
        : supportLevel === "partial"
          ? "该变量不能直接回答问题，但可作为控制变量或样本分层依据。"
          : "该变量与当前 idea 的核心机制关联较弱，需要补充测量或调整题目。",
    };
  });

  const hasIndependent = supportedVariables.some((item) => item.supportLevel === "strong")
    && dataset.variables.some((variable) => variable.role === "independent");
  const hasDependent = dataset.variables.some((variable) => variable.role === "dependent");

  // 如果关键变量角色缺失，主动追加“缺口项”，让 UI 明确告诉用户需要补采什么。
  if (!hasIndependent) {
    supportedVariables.push({
      variableName: "missing_independent_variable",
      label: "缺少清晰自变量",
      supportLevel: "missing",
      reason: "当前数据里还没有足够清晰的解释变量，难以验证因果或关联机制。",
    });
  }

  if (!hasDependent) {
    supportedVariables.push({
      variableName: "missing_dependent_variable",
      label: "缺少结果变量",
      supportLevel: "missing",
      reason: "需要一个可观察的结果变量，例如采纳深度、写作表现或修改质量。",
    });
  }

  return supportedVariables;
}

// 将强支撑、部分支撑和缺口折算为百分制，供第五步评分卡展示。
export function scoreVariableSupport(items: VariableSupportItem[]): number {
  const strong = items.filter((item) => item.supportLevel === "strong").length;
  const partial = items.filter((item) => item.supportLevel === "partial").length;
  const missing = items.filter((item) => item.supportLevel === "missing").length;

  return Math.max(42, Math.min(94, 52 + strong * 10 + partial * 4 - missing * 8));
}
