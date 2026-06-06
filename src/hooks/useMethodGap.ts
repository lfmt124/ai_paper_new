import { useEffect, useMemo, useState } from "react";
import { runMethodGapAgent } from "../agents/methodGapAgent";
import type {
  DatasetProfile,
  FeasibilityCheckResult,
  GapScanIdea,
  MethodGapResult,
  Paper,
} from "../types";

type UseMethodGapOptions = {
  ideas: GapScanIdea[];
  selectedIdeaTitle: string;
  papers: Paper[];
  dataset: DatasetProfile | undefined;
  feasibilityResult: FeasibilityCheckResult | null;
};

// 第六步专用 Hook：把论文证据、当前 idea 和第五步数据结果组合成方法缺口分析。
export function useMethodGap({
  ideas,
  selectedIdeaTitle,
  papers,
  dataset,
  feasibilityResult,
}: UseMethodGapOptions) {
  const [result, setResult] = useState<MethodGapResult | null>(null);

  const selectedIdea = useMemo(
    () => ideas.find((idea) => idea.title === selectedIdeaTitle) ?? ideas[0],
    [ideas, selectedIdeaTitle],
  );

  function runCheck() {
    setResult(runMethodGapAgent(selectedIdea, papers, dataset, feasibilityResult));
  }

  useEffect(() => {
    runCheck();
  }, [selectedIdea?.title, papers, dataset?.id, feasibilityResult?.overallScore]);

  return {
    result,
    runCheck,
  };
}
