import { DatabaseZap } from "lucide-react";
import type { DatasetProfile, FeasibilityCheckResult } from "../types";
import { DataDrivenIdeaList } from "./DataDrivenIdeaList";
import { DatasetProfileCard } from "./DatasetProfileCard";
import { DatasetSelector } from "./DatasetSelector";
import { FalsifiabilityCheck } from "./FalsifiabilityCheck";
import { FeasibilityScoreCard } from "./FeasibilityScoreCard";
import { VariableSupportList } from "./VariableSupportList";

type FeasibilityPanelProps = {
  datasets: DatasetProfile[];
  selectedDatasetId: string;
  selectedDataset: DatasetProfile | undefined;
  result: FeasibilityCheckResult | null;
  onSelectDataset: (datasetId: string) => void;
  onRunCheck: () => void;
};

// 第五步主面板：把候选 idea 与可用数据放在一起，判断能不能进入研究设计。
export function FeasibilityPanel({
  datasets,
  selectedDatasetId,
  selectedDataset,
  result,
  onSelectDataset,
  onRunCheck,
}: FeasibilityPanelProps) {
  return (
    <section className="feasibility-section">
      <div className="section-heading">
        <DatabaseZap size={20} />
        <h2>数据可行性分析</h2>
      </div>

      <DatasetSelector datasets={datasets} selectedDatasetId={selectedDatasetId} onSelect={onSelectDataset} />

      {/* 手动重跑入口保留给用户；当前也会在 idea/数据集变化时自动刷新。 */}
      <div className="feasibility-actions">
        <button type="button" onClick={onRunCheck}>
          重新分析数据匹配度
        </button>
      </div>

      {selectedDataset ? <DatasetProfileCard dataset={selectedDataset} /> : null}

      {result ? (
        <>
          {/* 四个分数对应第五步的核心判断维度：总体、样本、变量、可证伪性。 */}
          <div className="feasibility-score-grid">
            <FeasibilityScoreCard label="总体可行性" score={result.overallScore} />
            <FeasibilityScoreCard label="样本覆盖" score={result.coverageScore} />
            <FeasibilityScoreCard label="变量支撑" score={result.variableScore} />
            <FeasibilityScoreCard label="可证伪性" score={result.falsifiabilityScore} />
          </div>

          <p className="feasibility-summary">{result.coverageSummary}</p>

          {/* 详细区左侧看变量，右侧看可证伪性和缺口，便于用户决定是否补数据。 */}
          <div className="feasibility-detail-grid">
            <section>
              <h3>变量支撑</h3>
              <VariableSupportList variables={result.variableSupport} />
            </section>
            <FalsifiabilityCheck summary={result.falsifiabilitySummary} dataGaps={result.dataGaps} />
          </div>

          {/* 方法建议来自数据形态，而不是论文检索结果。 */}
          <section className="method-suggestion-block">
            <h3>建议方法</h3>
            <div className="suggestion-list">
              {result.methodSuggestions.map((suggestion) => (
                <span key={suggestion}>{suggestion}</span>
              ))}
            </div>
          </section>

          {/* 当原 idea 不够稳时，给用户一组可用数据更容易支撑的替代问题。 */}
          <section>
            <h3>从数据反推的研究问题</h3>
            <DataDrivenIdeaList ideas={result.dataDrivenIdeas} />
          </section>
        </>
      ) : (
        <p className="empty-note">请选择一个数据集，系统会判断样本、变量和可证伪性是否支撑当前 idea。</p>
      )}
    </section>
  );
}
