type FeasibilityScoreCardProps = {
  label: string;
  score: number;
};

// 小型评分卡，复用于总体分、样本覆盖、变量支撑和可证伪性。
export function FeasibilityScoreCard({ label, score }: FeasibilityScoreCardProps) {
  return (
    <div className="feasibility-score-card">
      <span>{label}</span>
      <strong>{score}%</strong>
      <div className="score-bar">
        {/* score 已在 Agent 层限制到合理范围，这里只负责把数值映射成进度条。 */}
        <span style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
