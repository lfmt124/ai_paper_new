import { Search } from "lucide-react";
import { useState } from "react";
import type { PaperSearchParams } from "../types";

type PaperSearchControlsProps = {
  params: PaperSearchParams;
  isLoading: boolean;
  onSearch: (params: PaperSearchParams) => void;
};

// 论文检索表单：只维护用户正在编辑的 draft 参数。
// 点击“检索论文”时才把 draft 通过 onSearch 交给 usePaperSearch。
export function PaperSearchControls({ params, isLoading, onSearch }: PaperSearchControlsProps) {
  const [draft, setDraft] = useState(params);

  // 泛型写法保证 key 和 value 类型匹配，例如 mode 只能传 PaperSearchMode。
  function updateDraft<Key extends keyof PaperSearchParams>(key: Key, value: PaperSearchParams[Key]) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <form
      className="paper-search-controls"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(draft);
      }}
    >
      <label className="search-field primary">
        <span>检索关键词</span>
        <input
          value={draft.query}
          onChange={(event) => updateDraft("query", event.target.value)}
          placeholder="例如 AI academic writing feedback"
        />
      </label>

      <div className="year-fields">
        <label className="search-field">
          <span>开始年份</span>
          <input
            type="number"
            value={draft.fromYear}
            onChange={(event) => updateDraft("fromYear", Number(event.target.value))}
            min={1990}
            max={2030}
          />
        </label>
        <label className="search-field">
          <span>结束年份</span>
          <input
            type="number"
            value={draft.toYear}
            onChange={(event) => updateDraft("toYear", Number(event.target.value))}
            min={1990}
            max={2030}
          />
        </label>
      </div>

      <div className="mode-tabs" aria-label="检索模式">
        {/* mode 会影响服务层排序和查询词：trends=高引用，latest=新论文，review=追加 review。 */}
        {[
          ["trends", "高影响"],
          ["latest", "最新"],
          ["review", "综述"],
        ].map(([mode, label]) => (
          <button
            className={draft.mode === mode ? "selected" : ""}
            key={mode}
            type="button"
            onClick={() => updateDraft("mode", mode as PaperSearchParams["mode"])}
          >
            {label}
          </button>
        ))}
      </div>

      <label className="search-field primary">
        <span>数据源</span>
        {/* source 会决定调用单一数据源还是多源聚合。 */}
        <select
          value={draft.source}
          onChange={(event) => updateDraft("source", event.target.value as PaperSearchParams["source"])}
        >
          <option value="combined">多源聚合</option>
          <option value="semanticScholar">Semantic Scholar</option>
          <option value="openalex">OpenAlex</option>
        </select>
      </label>

      <button className="search-submit" type="submit" disabled={isLoading || !draft.query.trim()}>
        <Search size={16} />
        {isLoading ? "检索中" : "检索论文"}
      </button>
    </form>
  );
}
