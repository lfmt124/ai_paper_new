import {
  History,
  Library,
  MessageSquareText,
  Settings,
} from "lucide-react";
import type { AgentMessage, Idea, NavItem, Paper, WorkflowStep } from "../types";

export const navItems: NavItem[] = [
  { label: "Agent 工作台", href: "#agent", icon: MessageSquareText, active: true },
  { label: "我的文献库", href: "#library", icon: Library },
  { label: "项目历史", href: "#history", icon: History },
  { label: "设置", href: "#settings", icon: Settings },
];

export const projectHistory = [
  "AI 辅助学术写作",
  "短视频健康传播",
  "生成式 AI 与课堂互动",
];

export const workflowSteps: WorkflowStep[] = [
  {
    id: "scan",
    label: "研究空白扫描",
    summary: "锁定关键词、贡献和挑战",
    status: "done",
  },
  {
    id: "theory",
    label: "理论框架筛选",
    summary: "对比主流理论和可操作性",
    status: "done",
  },
  {
    id: "novelty",
    label: "新颖性验证",
    summary: "检索综述和最新进展",
    status: "active",
  },
  {
    id: "data",
    label: "数据可行性",
    summary: "检查样本、变量和可证伪性",
    status: "next",
  },
  {
    id: "method",
    label: "方法缺口分析",
    summary: "寻找可引入的新方法",
    status: "next",
  },
  {
    id: "proposal",
    label: "提案生成",
    summary: "形成导师讨论版草稿",
    status: "next",
  },
];

export const papers: Paper[] = [
  {
    id: "p1",
    title: "Large Language Models as Writing Feedback Partners in Higher Education",
    authors: "M. Chen, A. Rivera",
    year: 2025,
    venue: "Computers & Education",
    type: "empirical",
    contribution: "比较 LLM 反馈与教师反馈在研究生学术写作训练中的互补作用。",
    evidence: "支持挑战 1：长期学习效果仍缺少跨学期追踪证据。",
  },
  {
    id: "p2",
    title: "AI-Mediated Academic Writing Support: A Systematic Review",
    authors: "Y. Li, S. Ahmed",
    year: 2024,
    venue: "Educational Research Review",
    type: "review",
    contribution: "总结 AI 写作工具在高等教育中的干预方式、评价指标和伦理风险。",
    evidence: "用于新颖性验证：该方向已有综述，但真实课堂数据仍不足。",
  },
  {
    id: "p3",
    title: "Prompt Literacy and Graduate Student Writing Revision",
    authors: "R. Walker et al.",
    year: 2026,
    venue: "Learning, Media and Technology",
    type: "latest",
    contribution: "提出 prompt literacy 会影响学生采纳 AI 反馈的深度。",
    evidence: "支持 idea：把提示词素养作为中介变量进行实证检验。",
  },
];

export const ideas: Idea[] = [
  {
    title: "提示词素养如何影响 AI 反馈采纳",
    value: "将既有写作反馈理论放到 LLM 辅助学术写作的新情境中检验。",
    risk: "已有 prompt literacy 研究，需要限定到研究生论文写作场景。",
    feasibility: 86,
  },
  {
    title: "AI 反馈与导师反馈的互补机制",
    value: "关注不同反馈来源如何影响修改深度、写作信心和研究自主性。",
    risk: "需要拿到真实修改记录和访谈材料。",
    feasibility: 78,
  },
  {
    title: "基于修改轨迹的学术写作成长预测",
    value: "用文本版本差异和反馈采纳路径预测写作表现变化。",
    risk: "方法门槛较高，需要文本分析和较完整的过程数据。",
    feasibility: 68,
  },
];

export const messages: AgentMessage[] = [
  {
    role: "user",
    text: "我是教育技术方向博士生，研究兴趣是 AI 辅助学术写作。请帮我找可能的论文 idea。",
  },
  {
    role: "assistant",
    text: "我已按近 3 年论文进行初步扫描。当前较有潜力的空白集中在长期学习效果、真实课堂数据和学生如何理解并采纳 AI 反馈。",
  },
  {
    role: "assistant",
    text: "建议优先验证“提示词素养如何影响 AI 反馈采纳”。它不是创造新理论，而是把写作反馈理论放到 LLM 场景下做修正和检验。",
  },
];

export const proposalPreview =
  "本研究拟探讨研究生提示词素养如何影响其对 AI 写作反馈的采纳过程。既有研究已经证明 AI 写作工具能提升反馈可得性，但对学生如何理解、选择并转化这些反馈的机制解释仍不足。研究将结合写作反馈理论和人机协作视角，采集研究生论文修改记录、AI 反馈日志与访谈材料，分析提示词素养、反馈采纳深度和写作表现之间的关系。";
