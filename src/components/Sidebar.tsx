import { ChevronRight, Sparkles } from "lucide-react";
import type { NavItem } from "../types";

type SidebarProps = {
  navItems: NavItem[];
  projectHistory: string[];
};

// 左侧固定导航：品牌、主导航、最近项目。
// 它只接收配置数据，不关心当前业务流程，方便以后替换成真实项目列表。
export function Sidebar({ navItems, projectHistory }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Sparkles size={22} />
        </div>
        <div>
          <strong>学术 Idea Agent</strong>
          <span>AI Paper Assistant</span>
        </div>
      </div>

      <nav className="nav-list" aria-label="主导航">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a className={`nav-item ${item.active ? "active" : ""}`} href={item.href} key={item.label}>
              <Icon size={18} />
              {item.label}
            </a>
          );
        })}
      </nav>

      <section className="history-panel">
        <div className="panel-title">最近项目</div>
        {projectHistory.map((item) => (
          <button className="history-item" key={item}>
            <span>{item}</span>
            <ChevronRight size={15} />
          </button>
        ))}
      </section>
    </aside>
  );
}
