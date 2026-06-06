import type { DatasetProfile } from "../types";

// 第五步使用的示例数据集。
// 真实版本可以由文件上传、数据库接口或用户项目库返回，然后统一映射成 DatasetProfile。
export const datasets: DatasetProfile[] = [
  {
    id: "graduate-writing-logs",
    name: "研究生论文写作修改与 AI 反馈日志",
    population: "教育技术方向硕博生",
    sampleSize: 128,
    timeRange: "2025 春季学期 - 2026 春季学期",
    dataSources: ["论文草稿版本", "AI 反馈记录", "导师批注", "写作反思日志"],
    // variables 是第五步最重要的输入：role 决定它在研究设计里更像自变量、因变量还是控制变量。
    variables: [
      {
        name: "prompt_literacy",
        label: "提示词素养评分",
        role: "independent",
        description: "根据提示词清晰度、上下文提供和反馈追问能力综合评分。",
      },
      {
        name: "feedback_uptake_depth",
        label: "反馈采纳深度",
        role: "dependent",
        description: "根据修改位置、修改幅度和论证质量变化标注反馈采纳程度。",
      },
      {
        name: "advisor_feedback_density",
        label: "导师反馈密度",
        role: "control",
        description: "每千字导师批注数量，用于控制人工反馈影响。",
      },
      {
        name: "draft_revision_text",
        label: "草稿修改文本",
        role: "text",
        description: "论文多版本文本，可用于文本相似度、语义变化和论证结构分析。",
      },
      {
        name: "writing_confidence",
        label: "写作信心",
        role: "mediator",
        description: "阶段性问卷测量学生对学术写作任务的自我效能感。",
      },
    ],
    limitations: ["样本集中在一个学院", "尚未覆盖理工科与人文社科差异", "访谈材料数量有限"],
  },
  {
    id: "course-ai-feedback-survey",
    name: "生成式 AI 写作课程问卷",
    population: "本科生与硕士生混合样本",
    sampleSize: 342,
    timeRange: "2024 秋季学期",
    dataSources: ["课前问卷", "课后问卷", "AI 工具使用频率记录"],
    // 第二个数据集故意缺少真实文本轨迹，用来演示不同数据集会得到不同可行性判断。
    variables: [
      {
        name: "ai_usage_frequency",
        label: "AI 使用频率",
        role: "independent",
        description: "学生在写作任务中使用生成式 AI 的频率。",
      },
      {
        name: "writing_score_change",
        label: "写作成绩变化",
        role: "dependent",
        description: "课前和课后写作任务评分差异。",
      },
      {
        name: "discipline",
        label: "学科背景",
        role: "control",
        description: "学生所在学科门类。",
      },
      {
        name: "perceived_usefulness",
        label: "感知有用性",
        role: "mediator",
        description: "学生对 AI 写作反馈有用性的主观评价。",
      },
    ],
    limitations: ["缺少真实修改轨迹", "自陈变量较多", "无法精确区分 AI 反馈类型"],
  },
];
