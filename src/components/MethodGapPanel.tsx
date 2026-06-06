import { FlaskConical } from "lucide-react";
import type { MethodGapResult } from "../types";
import { EmergingMethodList } from "./EmergingMethodList";
import { MethodLimitationList } from "./MethodLimitationList";
import { MethodOpportunityCard } from "./MethodOpportunityCard";
import { MethodUsageChart } from "./MethodUsageChart";

type MethodGapPanelProps = {
  result: MethodGapResult | null;
  onRunCheck: () => void;
};

// 第六步主面板：展示已有方法分布、方法局限和可引入的新方法。
export function MethodGapPanel({ result, onRunCheck }: MethodGapPanelProps) {
  return (
    <section className="method-gap-section">
      <div className="section-heading">
        <FlaskConical size={20} />
        <h2>方法缺口分析</h2>
      </div>

      <div className="method-actions">
        <button type="button" onClick={onRunCheck}>
          重新分析方法缺口
        </button>
      </div>

      {result ? (
        <>
          <div className="method-summary-row">
            <div>
              <span>最常用方法</span>
              <strong>{result.dominantMethod?.label ?? "暂无"}</strong>
            </div>
            <div>
              <span>可引入方法</span>
              <strong>{result.emergingMethods.length} 种</strong>
            </div>
            <div>
              <span>候选 idea</span>
              <strong>{result.ideaTitle}</strong>
            </div>
          </div>

          <p className="method-opportunity-summary">{result.opportunitySummary}</p>

          <div className="method-gap-grid">
            <section>
              <h3>已有研究常用方法</h3>
              <MethodUsageChart usage={result.methodUsage} />
            </section>
            <section>
              <h3>主要局限</h3>
              <MethodLimitationList limitations={result.limitations} />
            </section>
          </div>

          <section>
            <h3>可引入的新兴方法</h3>
            <EmergingMethodList methods={result.emergingMethods} />
          </section>

          <section>
            <h3>新方法能回答的问题</h3>
            <div className="method-opportunity-grid">
              {result.emergingMethods.map((method) => (
                <MethodOpportunityCard key={method.method} method={method} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <p className="empty-note">系统会基于论文证据和数据可行性结果，分析当前议题的方法创新空间。</p>
      )}
    </section>
  );
}
