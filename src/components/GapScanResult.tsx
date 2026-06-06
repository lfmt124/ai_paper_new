import { Microscope } from "lucide-react";
import type { GapScanResult as GapScanResultType } from "../types";
import { ChallengeList } from "./ChallengeList";
import { KeyPaperList } from "./KeyPaperList";

type GapScanResultProps = {
  result: GapScanResultType;
};

// 第三步“研究空白扫描”的总展示区。
// 这里负责把 Agent 输出拆给关键论文列表和挑战列表，避免把子视图都堆在一个组件里。
export function GapScanResult({ result }: GapScanResultProps) {
  return (
    <section className="gap-scan-section">
      <div className="section-heading">
        <Microscope size={20} />
        <h2>研究空白扫描</h2>
      </div>

      {/* 顶部摘要用于快速判断本次扫描覆盖了哪个主题、多少论文和多少候选 idea。 */}
      <div className="gap-scan-summary">
        <div>
          <span>主题</span>
          <strong>{result.topic}</strong>
        </div>
        <div>
          <span>关键论文</span>
          <strong>{result.keyPapers.length} 篇</strong>
        </div>
        <div>
          <span>候选 Idea</span>
          <strong>{result.ideas.length} 个</strong>
        </div>
      </div>

      {/* 下方两个区域分别展示证据论文和研究挑战，后续可以继续拆出 idea 推荐面板。 */}
      <div className="gap-scan-grid">
        <section>
          <h3>关键论文与贡献</h3>
          <KeyPaperList papers={result.keyPapers} />
        </section>
        <section>
          <h3>主要研究挑战</h3>
          <ChallengeList challenges={result.challenges} />
        </section>
      </div>
    </section>
  );
}
