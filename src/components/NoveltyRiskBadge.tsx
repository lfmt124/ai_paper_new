import type { NoveltyRiskLevel } from "../types";

// 把内部风险枚举转成中文展示文案，样式颜色由 risk-badge + 等级 class 控制。
const riskLabel: Record<NoveltyRiskLevel, string> = {
  low: "低风险",
  medium: "中风险",
  high: "高风险",
};

type NoveltyRiskBadgeProps = {
  riskLevel: NoveltyRiskLevel;
};

export function NoveltyRiskBadge({ riskLevel }: NoveltyRiskBadgeProps) {
  return <span className={`risk-badge ${riskLevel}`}>{riskLabel[riskLevel]}</span>;
}
