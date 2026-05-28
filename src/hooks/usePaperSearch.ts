import { useEffect, useRef, useState } from "react";
import { searchPapers } from "../services/paperSearchService";
import type { Paper, PaperSearchParams } from "../types";

type UsePaperSearchOptions = {
  initialPapers: Paper[];
  initialParams: PaperSearchParams;
  autoSearch?: boolean;
};

export function usePaperSearch({ initialPapers, initialParams, autoSearch = false }: UsePaperSearchOptions) {
  const [papers, setPapers] = useState<Paper[]>(initialPapers);
  const [params, setParams] = useState<PaperSearchParams>(initialParams);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setPapers(results.length > 0 ? results : initialPapers);
      if (results.length === 0) {
        setError("没有检索到结果，已保留示例论文。");
      }
    } catch (searchError) {
      if (controller.signal.aborted) {
        return;
      }

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
