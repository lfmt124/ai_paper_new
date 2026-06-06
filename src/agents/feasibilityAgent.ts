import {
  assessDatasetCoverage,
} from "../services/datasetCoverageService";
import { assessFalsifiability } from "../services/falsifiabilityService";
import {
  assessVariableSupport,
  scoreVariableSupport,
} from "../services/variableSupportService";
import type {
  DatasetProfile,
  FeasibilityCheckResult,
  GapScanIdea,
  NoveltyCheckResult,
} from "../types";
import { buildFeasibilityPrompt } from "./prompts/feasibilityPrompt";

// 根据数据形态给方法建议：有过程文本就偏文本分析，有中介变量就偏机制模型。
// 这里先用规则输出，后续可让 LLM 根据 dataset.variables 生成更细的方法方案。
function createMethodSuggestions(dataset: DatasetProfile): string[] {
  const hasText = dataset.variables.some((variable) => variable.role === "text");
  const hasMediator = dataset.variables.some((variable) => variable.role === "mediator");

  return [
    hasText ? "可使用文本分析比较论文草稿修改前后的论证变化。" : "当前数据缺少文本轨迹，更适合先做问卷关联分析。",
    hasMediator ? "可建立中介模型，检验中间变量是否解释反馈采纳或写作表现变化。" : "建议补充机制变量，否则只能做较浅层的相关分析。",
    "保留导师反馈或学科背景作为控制变量，避免把所有变化都归因于 AI 反馈。",
  ];
}

// 数据缺口由两部分组成：数据集自身限制 + 规则分析过程中发现的额外缺口。
// 这样 mock 数据和真实上传数据都可以先自带 limitations，再由 Agent 补充判断。
function createDataGaps(dataset: DatasetProfile, variableScore: number): string[] {
  const gaps = [...dataset.limitations];

  if (variableScore < 70) {
    gaps.push("核心变量支撑不足，建议补充自变量或结果变量测量。");
  }

  if (dataset.sampleSize < 100) {
    gaps.push("样本量偏小，复杂模型需要谨慎使用。");
  }

  return gaps;
}

// 当原始 idea 与数据不完全匹配时，用现有变量反推更稳的研究问题。
// 这对应第五步“也可以反过来，从数据范围反推研究问题”的产品能力。
function createDataDrivenIdeas(dataset: DatasetProfile): FeasibilityCheckResult["dataDrivenIdeas"] {
  const hasText = dataset.variables.some((variable) => variable.role === "text");
  const hasMediator = dataset.variables.some((variable) => variable.role === "mediator");

  return [
    {
      title: hasText ? "AI 反馈采纳深度如何影响论文草稿的论证结构变化？" : "AI 使用频率如何影响写作成绩变化？",
      rationale: hasText
        ? "数据里有多版本文本和反馈记录，可以从过程数据反推更可观察的问题。"
        : "问卷数据更适合从使用行为与成绩变化之间的关系切入。",
    },
    {
      title: hasMediator ? "写作信心是否中介 AI 反馈与修改质量之间的关系？" : "感知有用性是否影响学生持续使用 AI 写作反馈？",
      rationale: "现有变量中包含可解释机制的中间变量，适合把问题从工具效果推进到机制解释。",
    },
  ];
}

// 第五步主 Agent：把 idea、新颖性结果和数据集放在一起，判断这个选题能不能被现有数据支撑。
export function runFeasibilityAgent(
  idea: GapScanIdea,
  dataset: DatasetProfile,
  noveltyResult: NoveltyCheckResult | null,
): FeasibilityCheckResult {
  const coverage = assessDatasetCoverage(idea.title, dataset);
  const variableSupport = assessVariableSupport(idea.title, dataset);
  const variableScore = scoreVariableSupport(variableSupport);
  const falsifiability = assessFalsifiability(dataset, variableSupport);
  // 新颖性风险高时，即使数据可用，也需要稍微降低总体推进建议。
  const noveltyPenalty = noveltyResult?.riskLevel === "high" ? 6 : noveltyResult?.riskLevel === "medium" ? 2 : 0;
  const overallScore = Math.round((coverage.score + variableScore + falsifiability.score) / 3 - noveltyPenalty);

  const result: FeasibilityCheckResult = {
    ideaTitle: idea.title,
    datasetId: dataset.id,
    datasetName: dataset.name,
    coverageScore: coverage.score,
    variableScore,
    falsifiabilityScore: falsifiability.score,
    overallScore: Math.max(40, Math.min(95, overallScore)),
    coverageSummary: coverage.summary,
    variableSupport,
    falsifiabilitySummary: falsifiability.summary,
    methodSuggestions: createMethodSuggestions(dataset),
    dataGaps: createDataGaps(dataset, variableScore),
    dataDrivenIdeas: createDataDrivenIdeas(dataset),
  };

  // 先保持 Prompt builder 可用，后续接真实 LLM 时可以把 result 交给模型再做二次解释。
  void buildFeasibilityPrompt(dataset, result, noveltyResult);

  return result;
}
