import { useEffect, useMemo, useState } from "react";
import { runFeasibilityAgent } from "../agents/feasibilityAgent";
import type {
  DatasetProfile,
  FeasibilityCheckResult,
  GapScanIdea,
  NoveltyCheckResult,
} from "../types";

type UseFeasibilityCheckOptions = {
  ideas: GapScanIdea[];
  datasets: DatasetProfile[];
  selectedIdeaTitle: string;
  noveltyResult: NoveltyCheckResult | null;
};

// 第五步专用 Hook：管理数据集选择和可行性分析结果。
// 规则 Agent 是同步的，但这里仍保留 runCheck 入口，后续替换异步接口时组件无需大改。
export function useFeasibilityCheck({
  ideas,
  datasets,
  selectedIdeaTitle,
  noveltyResult,
}: UseFeasibilityCheckOptions) {
  const [selectedDatasetId, setSelectedDatasetId] = useState(datasets[0]?.id ?? "");
  const [result, setResult] = useState<FeasibilityCheckResult | null>(null);

  // 当前 idea 来自第四步正在验证的 idea；如果标题找不到，就回退到第一条候选 idea。
  const selectedIdea = useMemo(
    () => ideas.find((idea) => idea.title === selectedIdeaTitle) ?? ideas[0],
    [ideas, selectedIdeaTitle],
  );

  // 数据集同理用 id 定位，便于后续接口分页或动态加载时保持选择状态稳定。
  const selectedDataset = useMemo(
    () => datasets.find((dataset) => dataset.id === selectedDatasetId) ?? datasets[0],
    [datasets, selectedDatasetId],
  );

  // 统一的运行入口。真实接口版可以在这里加入 loading/error，而组件 props 不需要变。
  function runCheck() {
    if (!selectedIdea || !selectedDataset) {
      setResult(null);
      return;
    }

    setResult(runFeasibilityAgent(selectedIdea, selectedDataset, noveltyResult));
  }

  useEffect(() => {
    if (!datasets.some((dataset) => dataset.id === selectedDatasetId)) {
      setSelectedDatasetId(datasets[0]?.id ?? "");
    }
  }, [datasets, selectedDatasetId]);

  // 当前 idea、数据集或第四步风险等级变化时，自动刷新第五步结果。
  useEffect(() => {
    runCheck();
  }, [selectedIdea?.title, selectedDataset?.id, noveltyResult?.riskLevel]);

  return {
    selectedDatasetId,
    selectedDataset,
    result,
    selectDataset: setSelectedDatasetId,
    runCheck,
  };
}
