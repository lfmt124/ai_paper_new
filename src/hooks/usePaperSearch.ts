import { useEffect, useRef, useState } from "react";
import { searchPapers } from "../services/paperSearchService";
import type { Paper, PaperSearchParams } from "../types";

type UsePaperSearchOptions = {
  initialPapers: Paper[];
  initialParams: PaperSearchParams;
  // true 时页面加载后自动执行一次默认检索。
  autoSearch?: boolean;
};

// 管理论文检索的前端状态：
// papers 当前展示结果，params 当前检索条件，isLoading/error 给 UI 显示状态。
export function usePaperSearch({ initialPapers, initialParams, autoSearch = false }: UsePaperSearchOptions) {
  const [papers, setPapers] = useState<Paper[]>(initialPapers);
  const [params, setParams] = useState<PaperSearchParams>(initialParams);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 用 AbortController 取消旧请求，避免用户连续检索时旧结果覆盖新结果。
  const abortRef = useRef<AbortController | null>(null);

  async function runSearch(nextParams: PaperSearchParams = params) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setParams(nextParams);
    setIsLoading(true);
    setError(null);

    try {
      const results = await searchPapers(nextParams, controller.signal);
      if (controller.signal.aborted) {
        return;
      }

      // 没有结果时保留示例论文，保证原型页面不会变成空状态。
      setPapers(results.length > 0 ? results : initialPapers);
      if (results.length === 0) {
        setError("没有检索到结果，已保留示例论文。");
      } else {
        setError(null);
      }
    } catch (searchError) {
      if (controller.signal.aborted) {
        return;
      }

      // 接口失败时同样 fallback 到 mock 数据，错误信息交给 EvidencePanel 展示。
      setPapers(initialPapers);
      setError(searchError instanceof Error ? searchError.message : "论文检索失败，已保留示例论文。");
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (autoSearch) {
      void runSearch(initialParams);
    }

    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return {
    papers,
    params,
    isLoading,
    error,
    runSearch,
  };
}
