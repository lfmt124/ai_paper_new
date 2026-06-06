import { FlaskConical, Search, Target, X } from "lucide-react";

type AgentDrawerProps = {
  open: boolean;
  onClose: () => void;
};

// 右侧抽屉：收集用户的研究身份、领域、具体方向和想运行的工作流。
// 当前表单还没有提交到后端，后续接 Agent 时应把这里改成受控表单并触发真实任务。
export function AgentDrawer({ open, onClose }: AgentDrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="drawer-layer" role="presentation">
      <button className="drawer-backdrop" type="button" aria-label="关闭抽屉" onClick={onClose} />
      <aside className="agent-drawer" aria-label="新建研究扫描">
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Research Direction</p>
            <h2>新建研究扫描</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭">
            <X size={18} />
          </button>
        </div>

        <label className="field">
          <span>研究身份</span>
          <select defaultValue="博士生">
            <option>硕士生</option>
            <option>博士生</option>
          </select>
        </label>

        <label className="field">
          <span>学科领域</span>
          <input defaultValue="教育技术" placeholder="例如：传播学、管理学、计算机视觉" />
        </label>

        <label className="field">
          <span>具体方向</span>
          <textarea
            defaultValue="AI 辅助学术写作，尤其关注研究生如何理解、采纳和转化 LLM 写作反馈。"
            placeholder="描述你的研究兴趣、可用数据或想验证的现象"
          />
        </label>

        <div className="drawer-tool-grid">
          <button className="tool-card selected" type="button">
            <Search size={18} />
            <strong>研究空白扫描</strong>
            <span>近 3 年重要论文、贡献与挑战</span>
          </button>
          <button className="tool-card" type="button">
            <Target size={18} />
            <strong>新颖性验证</strong>
            <span>review 检索与最新进展检查</span>
          </button>
          <button className="tool-card" type="button">
            <FlaskConical size={18} />
            <strong>方法缺口</strong>
            <span>比较常用方法和可引入的新方法</span>
          </button>
        </div>

        <button className="drawer-submit" type="button" onClick={onClose}>
          运行 Agent 工作流
        </button>
      </aside>
    </div>
  );
}
