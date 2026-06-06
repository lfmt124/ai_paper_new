import { suggestEmergingMethods } from "../services/emergingMethodService";
import {
  buildMethodLimitations,
  buildMethodUsage,
  findDominantMethod,
} from "../services/methodGapService";
import type {
  DatasetProfile,
  FeasibilityCheckResult,
  GapScanIdea,
  MethodGapResult,
  Paper,
} from "../types";
import { buildMethodGapPrompt } from "./prompts/methodGapPrompt";

function createOpportunitySummary(result: Omit<MethodGapResult, "opportunitySummary">): string {
  const dominantLabel = result.dominantMethod?.label ?? "传统经验研究";
  const topEmerging = result.emergingMethods[0];

  if (!topEmerging) {
    return `当前证据显示既有研究主要依赖${dominantLabel}，建议先扩大论文证据后再判断方法创新空间。`;
  }

  return `当前议题既有研究较多使用${dominantLabel}，主要局限在过程证据和机制解释不足。可优先考虑${topEmerging.label}，用来回答“${topEmerging.canAnswer}”`;
}

// 第六步主 Agent：识别已有研究的方法结构，并结合第五步数据可行性寻找方法创新点。
export function runMethodGapAgent(
  idea: GapScanIdea | undefined,
  papers: Paper[],
  dataset: DatasetProfile | undefined,
  feasibilityResult: FeasibilityCheckResult | null,
): MethodGapResult {
  const methodUsage = buildMethodUsage(papers);
  const dominantMethod = findDominantMethod(methodUsage);
  const limitations = buildMethodLimitations(methodUsage);
  const emergingMethods = suggestEmergingMethods(dataset, feasibilityResult, methodUsage);

  const partialResult = {
    ideaTitle: idea?.title ?? "未选择候选 idea",
    dominantMethod,
    methodUsage,
    limitations,
    emergingMethods,
  };

  const result: MethodGapResult = {
    ...partialResult,
    opportunitySummary: createOpportunitySummary(partialResult),
  };

  void buildMethodGapPrompt(result, dataset, feasibilityResult);

  return result;
}
