import type { MethodUsageItem } from "../types";

type MethodUsageChartProps = {
  usage: MethodUsageItem[];
};

// 展示当前论文证据中常见研究方法的分布。
// share 是规则服务算好的百分比，组件只负责画条形图。
export function MethodUsageChart({ usage }: MethodUsageChartProps) {
  if (usage.length === 0) {
    return <p className="empty-note">当前论文证据不足，暂时无法判断方法分布。</p>;
  }

  return (
    <div className="method-usage-chart">
      {usage.map((item) => (
        <article key={item.method}>
          <div>
            <strong>{item.label}</strong>
            <span>{item.count} 篇 / {item.share}%</span>
          </div>
          <div className="method-bar">
            <span style={{ width: `${item.share}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}
