import type { DatasetProfile } from "../types";

type DatasetProfileCardProps = {
  dataset: DatasetProfile;
};

// 展示数据集的基本覆盖范围，让用户先判断样本、人群和数据来源是否靠谱。
export function DatasetProfileCard({ dataset }: DatasetProfileCardProps) {
  return (
    <article className="dataset-profile-card">
      {/* 这些字段主要服务“样本覆盖是否匹配研究问题”的判断。 */}
      <div>
        <span>样本</span>
        <strong>{dataset.population}</strong>
      </div>
      <div>
        <span>规模</span>
        <strong>{dataset.sampleSize} 人</strong>
      </div>
      <div>
        <span>时间范围</span>
        <strong>{dataset.timeRange}</strong>
      </div>
      <div className="dataset-source-row">
        {/* 数据来源决定后续可用的方法，例如文本分析、问卷模型或访谈编码。 */}
        <span>数据来源</span>
        <p>{dataset.dataSources.join(" / ")}</p>
      </div>
    </article>
  );
}
