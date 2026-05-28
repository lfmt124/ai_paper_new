import { Search } from "lucide-react";
import { useState } from "react";
import type { PaperSearchParams } from "../types";

type PaperSearchControlsProps = {
  params: PaperSearchParams;
  isLoading: boolean;
  onSearch: (params: PaperSearchParams) => void;
};

export function PaperSearchControls({ params, isLoading, onSearch }: PaperSearchControlsProps) {
  const [draft, setDraft] = useState(params);

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

      <button className="search-submit" type="submit" disabled={isLoading || !draft.query.trim()}>
        <Search size={16} />
        {isLoading ? "检索中" : "检索论文"}
      </button>
    </form>
  );
}
