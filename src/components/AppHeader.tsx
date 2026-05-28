import { FileText, Plus } from "lucide-react";

type AppHeaderProps = {
  onOpenDrawer: () => void;
};

export function AppHeader({ onOpenDrawer }: AppHeaderProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">MVP Prototype</p>
        <h1>从研究方向到可讨论提案</h1>
        <p className="topbar-copy">
          围绕硕博生找论文 idea 的真实流程，先跑通文献扫描、验证和提案生成闭环。
        </p>
      </div>
      <div className="topbar-actions">
        <button className="secondary-action" type="button">
          <FileText size={17} />
          导出草稿
        </button>
        <button className="primary-action" type="button" onClick={onOpenDrawer}>
          <Plus size={17} />
          新建扫描
        </button>
      </div>
    </header>
  );
}
