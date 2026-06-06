import type { MethodLimitation, MethodUsageItem, Paper, ResearchMethodType } from "../types";
import { classifyPaperMethods, methodLabels } from "./methodClassifierService";

const limitationTemplates: Record<ResearchMethodType, string> = {
  survey: "问卷能快速覆盖较多样本，但容易停留在自陈态度，难以观察真实写作修改过程。",
  experiment: "实验能比较干预效果，但常见周期较短，未必能反映论文写作的长期成长。",
  interview: "访谈能解释学生理解与感受，但样本量有限，难以直接证明变量关系。",
  contentAnalysis: "内容分析能描述文本特征，但如果缺少过程日志，很难解释反馈如何被采纳。",
  systematicReview: "综述能总结成熟结论，但不能直接验证当前具体人群和数据场景。",
  textMining: "机器学习文本分析依赖高质量文本和标注，解释性需要额外设计。",
  causalInference: "因果推断对样本规模、处理变量和混杂控制要求较高。",
  learningAnalytics: "学习分析依赖完整日志数据，缺日志时容易只剩静态结果比较。",
};

export function buildMethodUsage(papers: Paper[]): MethodUsageItem[] {
  const methodToPaperIds = new Map<ResearchMethodType, Set<string>>();

  for (const paper of papers) {
    for (const method of classifyPaperMethods(paper)) {
      const paperIds = methodToPaperIds.get(method) ?? new Set<string>();
      paperIds.add(paper.id);
      methodToPaperIds.set(method, paperIds);
    }
  }

  const total = Math.max(papers.length, 1);

  return Array.from(methodToPaperIds.entries())
    .map(([method, paperIds]) => ({
      method,
      label: methodLabels[method],
      count: paperIds.size,
      share: Math.round((paperIds.size / total) * 100),
      evidencePaperIds: Array.from(paperIds),
    }))
    .sort((left, right) => right.count - left.count);
}

export function buildMethodLimitations(methodUsage: MethodUsageItem[]): MethodLimitation[] {
  return methodUsage.slice(0, 4).map((item) => ({
    method: item.method,
    label: item.label,
    limitation: limitationTemplates[item.method],
  }));
}

export function findDominantMethod(methodUsage: MethodUsageItem[]): MethodUsageItem | null {
  return methodUsage[0] ?? null;
}
