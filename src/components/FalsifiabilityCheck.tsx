type FalsifiabilityCheckProps = {
  summary: string;
  dataGaps: string[];
};

// 可证伪性区块：说明 idea 是否能被数据支持或推翻，并列出需要补的数据。
export function FalsifiabilityCheck({ summary, dataGaps }: FalsifiabilityCheckProps) {
  return (
    <section className="falsifiability-check">
      <h3>可证伪性与数据缺口</h3>
      <p>{summary}</p>
      {/* dataGaps 合并了数据集自带限制和 Agent 发现的额外缺口。 */}
      <div className="data-gap-list">
        {dataGaps.map((gap) => (
          <span key={gap}>{gap}</span>
        ))}
      </div>
    </section>
  );
}
