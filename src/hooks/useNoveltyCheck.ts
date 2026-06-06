import { useEffect, useRef, useState } from "react";
import { runNoveltyAgent } from "../agents/noveltyAgent";
import type { GapScanIdea, NoveltyCheckResult, PaperSearchParams } from "../types";

type UseNoveltyCheckOptions = {
  ideas: GapScanIdea[];
  searchParams: PaperSearchParams;
};

// 第四步专用 Hook：把“选择 idea、运行验证、处理 loading/error”封装起来。
// 这样 NoveltyCheckPanel 可以专注 UI，后续换接口时主要改 agent/service 层。
export function useNoveltyCheck({ ideas, searchParams }: UseNoveltyCheckOptions) {
  const [selectedIdeaTitle, setSelectedIdeaTitle] = useState(ideas[0]?.title ?? "");
  const [result, setResult] = useState<NoveltyCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // 每次重新验证前取消上一次请求，避免用户快速切换 idea 时旧结果覆盖新结果。
  async function runCheck(ideaTitle = selectedIdeaTitle) {
    if (!ideaTitle) {
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSelectedIdeaTitle(ideaTitle);
    setIsLoading(true);
    setError(null);

    try {
      const nextResult = await runNoveltyAgent(ideaTitle, searchParams, controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      setResult(nextResult);
    } catch (checkError) {
      if (controller.signal.aborted) {
        return;
      }
      setError(checkError instanceof Error ? checkError.message : "新颖性验证失败，请稍后重试。");
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }

  // 如果第三步重新生成了 idea，确保当前选中的标题仍然存在。
  useEffect(() => {
    if (!ideas.some((idea) => idea.title === selectedIdeaTitle)) {
      setSelectedIdeaTitle(ideas[0]?.title ?? "");
    }
  }, [ideas, selectedIdeaTitle]);

  // idea 或检索年份/数据源变化时，自动重新跑新颖性验证。
  useEffect(() => {
    if (selectedIdeaTitle) {
      void runCheck(selectedIdeaTitle);
    }

    return () => {
      abortRef.current?.abort();
    };
  }, [selectedIdeaTitle, searchParams.fromYear, searchParams.toYear, searchParams.source]);

  return {
    selectedIdeaTitle,
    result,
    isLoading,
    error,
    selectIdea: setSelectedIdeaTitle,
    runCheck,
  };
}
