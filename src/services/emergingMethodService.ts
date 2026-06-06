import type {
  DatasetProfile,
  EmergingMethodSuggestion,
  FeasibilityCheckResult,
  MethodUsageItem,
  ResearchMethodType,
} from "../types";
import { methodLabels } from "./methodClassifierService";

function hasDatasetVariable(dataset: DatasetProfile | undefined, predicate: (roleOrName: string) => boolean): boolean {
  return Boolean(dataset?.variables.some((variable) => predicate(`${variable.role} ${variable.name} ${variable.label}`)));
}

function existingMethodSet(methodUsage: MethodUsageItem[]): Set<ResearchMethodType> {
  return new Set(methodUsage.map((item) => item.method));
}

// 根据第五步的数据形态和已有方法分布推荐“还没被充分引入”的新方法。
// 这里优先推荐能利用现有数据的方案，而不是只追求听起来高级。
export function suggestEmergingMethods(
  dataset: DatasetProfile | undefined,
  feasibilityResult: FeasibilityCheckResult | null,
  methodUsage: MethodUsageItem[],
): EmergingMethodSuggestion[] {
  const existingMethods = existingMethodSet(methodUsage);
  const hasTextData = hasDatasetVariable(dataset, (value) => value.includes("text") || value.includes("文本"));
  const hasTraceData = hasDatasetVariable(dataset, (value) => value.includes("revision") || value.includes("日志") || value.includes("轨迹"));
  const hasOutcome = hasDatasetVariable(dataset, (value) => value.includes("dependent"));
  const hasStrongFeasibility = (feasibilityResult?.overallScore ?? 0) >= 75;

  const suggestions: EmergingMethodSuggestion[] = [];

  if (hasTextData && !existingMethods.has("textMining")) {
    suggestions.push({
      method: "textMining",
      label: methodLabels.textMining,
      priority: "high",
      whyUseful: "当前数据包含论文草稿或修改文本，可以把创新点放在真实文本变化而不是主观感受上。",
      canAnswer: "AI 反馈被采纳后，论证结构、概念准确性或语义连贯性发生了什么变化？",
      dataRequirement: "需要多版本文本、反馈来源标记，以及基础的文本清洗或人工校验。",
    });
  }

  if (hasTraceData && !existingMethods.has("learningAnalytics")) {
    suggestions.push({
      method: "learningAnalytics",
      label: methodLabels.learningAnalytics,
      priority: "high",
      whyUseful: "日志和修改轨迹能呈现反馈采纳过程，补上传统问卷看不到的行为证据。",
      canAnswer: "学生是在什么节点采纳 AI 反馈，又在哪些反馈类型上出现放弃或反复修改？",
      dataRequirement: "需要时间戳、修改版本、反馈记录和学生操作路径。",
    });
  }

  if (hasOutcome && hasStrongFeasibility && !existingMethods.has("causalInference")) {
    suggestions.push({
      method: "causalInference",
      label: methodLabels.causalInference,
      priority: "medium",
      whyUseful: "如果变量和样本支撑足够，可以从相关分析推进到更接近因果解释的设计。",
      canAnswer: "提示词素养或 AI 反馈使用是否真的改变了反馈采纳深度，而不是被先验写作能力混淆？",
      dataRequirement: "需要处理变量、结果变量、控制变量，以及尽量清晰的时间顺序。",
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      method: "contentAnalysis",
      label: methodLabels.contentAnalysis,
      priority: "medium",
      whyUseful: "当数据暂时不足以支持复杂模型时，结构化编码可以先建立可靠的现象描述。",
      canAnswer: "AI 反馈主要集中在哪些写作问题上，学生最常采纳哪类反馈？",
      dataRequirement: "需要反馈文本、修改样本和清晰的编码框架。",
    });
  }

  return suggestions;
}
