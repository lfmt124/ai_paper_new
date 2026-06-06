import { useState } from "react";
import { AgentDrawer } from "./components/AgentDrawer";
import { AppHeader } from "./components/AppHeader";
import { ChatPanel } from "./components/ChatPanel";
import { EvidencePanel } from "./components/EvidencePanel";
import { FeasibilityPanel } from "./components/FeasibilityPanel";
import { GapScanResult } from "./components/GapScanResult";
import { IdeaBoard } from "./components/IdeaBoard";
import { MethodGapPanel } from "./components/MethodGapPanel";
import { NoveltyCheckPanel } from "./components/NoveltyCheckPanel";
import { Sidebar } from "./components/Sidebar";
import { WorkflowStepper } from "./components/WorkflowStepper";
import {
  initialPaperSearchParams,
  ideas,
  messages,
  navItems,
  papers,
  projectHistory,
  proposalPreview,
  workflowSteps,
} from "./data/mockData";
import { datasets } from "./data/mockDatasets";
import { useFeasibilityCheck } from "./hooks/useFeasibilityCheck";
import { useGapScan } from "./hooks/useGapScan";
import { useMethodGap } from "./hooks/useMethodGap";
import { useNoveltyCheck } from "./hooks/useNoveltyCheck";
import { usePaperSearch } from "./hooks/usePaperSearch";

// App 只做页面组装和少量顶层状态编排。
// 具体 UI 放在 components，数据放在 data，检索和 Agent 状态放在 hooks/services/agents。
export function App() {
  // 控制“新建研究扫描”右侧抽屉的打开/关闭。
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 第二步论文检索状态：负责从 OpenAlex / Semantic Scholar 拉论文证据。
  const paperSearch = usePaperSearch({
    initialPapers: papers,
    initialParams: initialPaperSearchParams,
    autoSearch: true,
  });

  // 第三步研究空白扫描：当前是规则版 Agent，后续可替换为真实 LLM。
  const gapScan = useGapScan({
    topic: "AI 辅助学术写作",
    papers: paperSearch.papers,
  });

  // 第四步新颖性验证：基于候选 idea 和当前检索参数做相似研究/综述/最新进展检查。
  const noveltyCheck = useNoveltyCheck({
    ideas: gapScan.result.ideas,
    searchParams: paperSearch.params,
  });

  // 第五步数据可行性分析：把当前 idea、新颖性验证结果和可用数据集放在一起评估。
  const feasibilityCheck = useFeasibilityCheck({
    ideas: gapScan.result.ideas,
    datasets,
    selectedIdeaTitle: noveltyCheck.selectedIdeaTitle,
    noveltyResult: noveltyCheck.result,
  });

  // 第六步方法缺口分析：基于论文证据和第五步数据可行性结果，寻找可引入的新方法。
  const methodGap = useMethodGap({
    ideas: gapScan.result.ideas,
    selectedIdeaTitle: noveltyCheck.selectedIdeaTitle,
    papers: paperSearch.papers,
    dataset: feasibilityCheck.selectedDataset,
    feasibilityResult: feasibilityCheck.result,
  });

  return (
    <div className="app-shell">
      <Sidebar navItems={navItems} projectHistory={projectHistory} />

      <main className="workspace">
        <AppHeader onOpenDrawer={() => setDrawerOpen(true)} />
        <WorkflowStepper steps={workflowSteps} />

        {/* 左侧主工作区放 Agent 流程结果，右侧放论文证据面板。 */}
        <div className="content-grid">
          <section className="agent-panel">
            <ChatPanel
              messages={messages}
              searchParams={paperSearch.params}
              onOpenDrawer={() => setDrawerOpen(true)}
            />
            <GapScanResult result={gapScan.result} />
            <IdeaBoard ideas={ideas} />
            <NoveltyCheckPanel
              ideas={gapScan.result.ideas}
              selectedIdeaTitle={noveltyCheck.selectedIdeaTitle}
              result={noveltyCheck.result}
              isLoading={noveltyCheck.isLoading}
              error={noveltyCheck.error}
              onSelectIdea={noveltyCheck.selectIdea}
              onRunCheck={() => void noveltyCheck.runCheck()}
            />
            <FeasibilityPanel
              datasets={datasets}
              selectedDatasetId={feasibilityCheck.selectedDatasetId}
              selectedDataset={feasibilityCheck.selectedDataset}
              result={feasibilityCheck.result}
              onSelectDataset={feasibilityCheck.selectDataset}
              onRunCheck={feasibilityCheck.runCheck}
            />
            <MethodGapPanel result={methodGap.result} onRunCheck={methodGap.runCheck} />
          </section>
          <EvidencePanel
            papers={paperSearch.papers}
            proposalPreview={proposalPreview}
            searchParams={paperSearch.params}
            isLoading={paperSearch.isLoading}
            error={paperSearch.error}
            onSearch={paperSearch.runSearch}
          />
        </div>
      </main>

      <AgentDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
