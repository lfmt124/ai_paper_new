import type { LucideIcon } from "lucide-react";

// 全项目共享类型集中放在这里，避免组件之间各自定义一套数据结构。
// 接口返回数据应先在 services 层映射成这些类型，再传给组件渲染。

export type WorkflowStatus = "done" | "active" | "next";

export type WorkflowStep = {
  id: string;
  label: string;
  summary: string;
  status: WorkflowStatus;
};

export type Paper = {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  type: string;
  contribution: string;
  evidence: string;
  abstract?: string;
  citedByCount?: number;
  doi?: string;
  url?: string;
  source?: string;
};

// 论文检索参数：右侧 EvidencePanel 的检索表单和服务层共用这套结构。
// 新增数据源或模式时，应先扩展这里，再去 service 和表单里补对应逻辑。
export type PaperSearchMode = "trends" | "latest" | "review";
export type PaperSearchSource = "combined" | "openalex" | "semanticScholar";

export type PaperSearchParams = {
  query: string;
  fromYear: number;
  toYear: number;
  mode: PaperSearchMode;
  source: PaperSearchSource;
  perPage: number;
};

export type Idea = {
  title: string;
  value: string;
  risk: string;
  feasibility: number;
};

// Agent 对话区的最小消息模型。后续接真实会话时可扩展 message id、时间、引用等字段。
export type AgentMessage = {
  role: "user" | "assistant";
  text: string;
};

// 侧边栏导航项。icon 使用 lucide-react 的组件类型。
export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};

// 第三步：研究空白扫描的结构化输出。
// 这些类型是 gapScanAgent 给前端的“稳定合同”，后续换成真实 LLM Agent 时尽量保持字段不变。
export type KeyPaperInsight = {
  paperId: string;
  title: string;
  year: number;
  venue: string;
  contribution: string;
};

export type ResearchChallenge = {
  title: string;
  description: string;
  // 用论文 id 记录证据来源，方便 UI 后续把挑战和右侧论文证据面板联动起来。
  evidencePaperIds: string[];
};

export type GapScanIdea = {
  title: string;
  rationale: string;
  noveltyRisk: string;
  // idea 的证据链同样只存 paperId，避免在多个数据结构里重复保存整篇论文信息。
  evidencePaperIds: string[];
};

export type GapScanResult = {
  topic: string;
  keyPapers: KeyPaperInsight[];
  challenges: ResearchChallenge[];
  ideas: GapScanIdea[];
  generatedAt: string;
};

// 第四步：Idea 新颖性验证的结构化输出。
export type NoveltyRiskLevel = "low" | "medium" | "high";

export type NoveltyQuerySet = {
  ideaTitle: string;
  relatedQueries: string[];
  reviewQueries: string[];
  latestQueries: string[];
};

export type NoveltyCheckResult = {
  ideaTitle: string;
  queries: NoveltyQuerySet;
  similarPapers: Paper[];
  reviewPapers: Paper[];
  latestPapers: Paper[];
  riskLevel: NoveltyRiskLevel;
  feasibilityScore: number;
  noveltySummary: string;
  adjustmentSuggestions: string[];
};

// 第五步：数据可行性分析的结构化输入与输出。
// 后续接 CSV 上传、数据库或真实数据平台时，先把外部数据映射成这些类型。
export type DatasetVariableRole = "independent" | "dependent" | "mediator" | "control" | "text" | "metadata";

export type DatasetVariable = {
  name: string;
  label: string;
  role: DatasetVariableRole;
  description: string;
};

export type DatasetProfile = {
  id: string;
  name: string;
  population: string;
  sampleSize: number;
  timeRange: string;
  dataSources: string[];
  variables: DatasetVariable[];
  limitations: string[];
};

export type VariableSupportLevel = "strong" | "partial" | "missing";

export type VariableSupportItem = {
  variableName: string;
  label: string;
  supportLevel: VariableSupportLevel;
  reason: string;
};

export type DataDrivenIdea = {
  title: string;
  rationale: string;
};

export type FeasibilityCheckResult = {
  ideaTitle: string;
  datasetId: string;
  datasetName: string;
  coverageScore: number;
  variableScore: number;
  falsifiabilityScore: number;
  overallScore: number;
  coverageSummary: string;
  variableSupport: VariableSupportItem[];
  falsifiabilitySummary: string;
  methodSuggestions: string[];
  dataGaps: string[];
  dataDrivenIdeas: DataDrivenIdea[];
};

// 第六步：方法缺口分析的结构化输出。
// 这些类型描述“已有研究怎么做”和“还能引入什么新方法”。
export type ResearchMethodType =
  | "survey"
  | "experiment"
  | "interview"
  | "contentAnalysis"
  | "systematicReview"
  | "textMining"
  | "causalInference"
  | "learningAnalytics";

export type MethodUsageItem = {
  method: ResearchMethodType;
  label: string;
  count: number;
  share: number;
  evidencePaperIds: string[];
};

export type MethodLimitation = {
  method: ResearchMethodType;
  label: string;
  limitation: string;
};

export type EmergingMethodSuggestion = {
  method: ResearchMethodType;
  label: string;
  priority: "high" | "medium" | "low";
  whyUseful: string;
  canAnswer: string;
  dataRequirement: string;
};

export type MethodGapResult = {
  ideaTitle: string;
  dominantMethod: MethodUsageItem | null;
  methodUsage: MethodUsageItem[];
  limitations: MethodLimitation[];
  emergingMethods: EmergingMethodSuggestion[];
  opportunitySummary: string;
};
