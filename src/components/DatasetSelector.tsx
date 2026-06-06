import type { DatasetProfile } from "../types";

type DatasetSelectorProps = {
  datasets: DatasetProfile[];
  selectedDatasetId: string;
  onSelect: (datasetId: string) => void;
};

// 第五步的数据集选择器。以后接用户项目库时，只需要把 datasets 换成接口返回值。
export function DatasetSelector({ datasets, selectedDatasetId, onSelect }: DatasetSelectorProps) {
  return (
    <div className="dataset-selector">
      {datasets.map((dataset) => (
        <button
          className={dataset.id === selectedDatasetId ? "selected" : ""}
          key={dataset.id}
          type="button"
          onClick={() => onSelect(dataset.id)}
        >
          {/* 卡片只显示选择所需的最小信息，完整数据集详情交给 DatasetProfileCard。 */}
          <strong>{dataset.name}</strong>
          <span>{dataset.population}</span>
          <small>N={dataset.sampleSize}</small>
        </button>
      ))}
    </div>
  );
}
