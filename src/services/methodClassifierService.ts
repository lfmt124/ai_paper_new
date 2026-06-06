import type { Paper, ResearchMethodType } from "../types";

export const methodLabels: Record<ResearchMethodType, string> = {
  survey: "问卷调查",
  experiment: "实验研究",
  interview: "访谈研究",
  contentAnalysis: "内容分析",
  systematicReview: "系统综述",
  textMining: "机器学习文本分析",
  causalInference: "因果推断",
  learningAnalytics: "学习分析",
};

const methodKeywords: Record<ResearchMethodType, string[]> = {
  survey: ["survey", "questionnaire", "self-report", "问卷"],
  experiment: ["experiment", "randomized", "control group", "实验"],
  interview: ["interview", "qualitative", "访谈"],
  contentAnalysis: ["content analysis", "coding", "annotation", "内容分析", "编码"],
  systematicReview: ["review", "systematic review", "meta-analysis", "综述"],
  textMining: ["text mining", "machine learning", "nlp", "semantic", "文本分析"],
  causalInference: ["causal", "difference-in-differences", "propensity", "instrumental variable", "因果"],
  learningAnalytics: ["learning analytics", "log data", "trace", "revision", "日志", "轨迹"],
};

function buildPaperMethodText(paper: Paper): string {
  return `${paper.title} ${paper.type} ${paper.contribution} ${paper.evidence} ${paper.abstract ?? ""}`.toLowerCase();
}

// 基于论文标题、摘要、贡献和 type 做规则版方法识别。
// 真实 Agent 版本可以让 LLM 阅读摘要后返回更准确的多标签方法分类。
export function classifyPaperMethods(paper: Paper): ResearchMethodType[] {
  const text = buildPaperMethodText(paper);
  const matchedMethods = Object.entries(methodKeywords)
    .filter(([, keywords]) => keywords.some((keyword) => text.includes(keyword.toLowerCase())))
    .map(([method]) => method as ResearchMethodType);

  if (matchedMethods.length > 0) {
    return Array.from(new Set(matchedMethods));
  }

  if (paper.type === "review") {
    return ["systematicReview"];
  }

  if (paper.type === "empirical") {
    return ["survey"];
  }

  return ["contentAnalysis"];
}
