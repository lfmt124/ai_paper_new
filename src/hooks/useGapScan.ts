import { useMemo } from "react";
import { runGapScanAgent } from "../agents/gapScanAgent";
import type { Paper } from "../types";

type UseGapScanOptions = {
  topic: string;
  papers: Paper[];
};

// 第三步前端 hook：把论文证据交给 gapScanAgent，并缓存计算结果。
// 只要 topic 或 papers 变化，研究空白扫描结果就会重新生成。
export function useGapScan({ topic, papers }: UseGapScanOptions) {
  const result = useMemo(() => runGapScanAgent(topic, papers), [topic, papers]);

  return {
    result,
  };
}
