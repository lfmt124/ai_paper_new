import type { DatasetProfile, FeasibilityCheckResult, MethodGapResult } from "../../types";

// 真实 LLM Agent 接入时可复用这个 Prompt。
// 当前规则版已经给出方法分布和建议，LLM 可以进一步生成导师讨论版文字。
export function buildMethodGapPrompt(
  result: MethodGapResult,
  dataset: DatasetProfile | undefined,
  feasibilityResult: FeasibilityCheckResult | null,
): string {
  return `你是学术方法创新分析助手。请基于论文证据、可用数据和规则版结果，判断当前议题的方法缺口。

候选 idea：${result.ideaTitle}
数据集：${dataset?.name ?? "未选择"}
数据可行性：${feasibilityResult?.overallScore ?? "未评估"}
最常用方法：${result.dominantMethod?.label ?? "暂无"}

请回答：
1. 过去研究主要用了哪些方法
2. 哪种方法最多，局限在哪里
3. 哪些新兴方法还没有被广泛引入
4. 如果引入这些方法，能回答哪些过去答不了的问题`;
}
