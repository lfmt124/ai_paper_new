import type { AgentMessage } from "../types";
import type { PaperSearchParams } from "../types";

type ChatPanelProps = {
  messages: AgentMessage[];
  searchParams: PaperSearchParams;
  onOpenDrawer: () => void;
};

export function ChatPanel({ messages, searchParams, onOpenDrawer }: ChatPanelProps) {
  return (
    <section className="chat-card" id="agent">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Agent Thread</p>
          <h2>当前研究扫描</h2>
        </div>
        <span className="status-pill">Mock 数据</span>
      </div>

      <div className="scan-summary">
        <div>
          <span>研究方向</span>
          <strong>AI 辅助学术写作</strong>
        </div>
        <div>
          <span>时间范围</span>
          <strong>
            {searchParams.fromYear}-{searchParams.toYear}
          </strong>
        </div>
        <div>
          <span>当前步骤</span>
          <strong>新颖性验证</strong>
        </div>
      </div>

      <div className="chat-thread" aria-label="Agent 对话">
        {messages.map((message, index) => (
          <article className={`message ${message.role}`} key={`${message.role}-${index}`}>
            <div className="avatar">{message.role === "user" ? "我" : "AI"}</div>
            <p>{message.text}</p>
          </article>
        ))}
      </div>

      <button className="inline-compose" type="button" onClick={onOpenDrawer}>
        继续补充研究方向、数据或方法偏好
      </button>
    </section>
  );
}
