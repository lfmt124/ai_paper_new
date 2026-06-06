import type { ResearchChallenge } from "../types";

type ChallengeListProps = {
  challenges: ResearchChallenge[];
};

// 第三步结果中的“研究挑战”列表：每个挑战都可通过 evidencePaperIds 回溯到证据论文。
// 当前界面先展示标题和解释，后续可在这里扩展“查看证据论文”的交互。
export function ChallengeList({ challenges }: ChallengeListProps) {
  return (
    <div className="challenge-list">
      {challenges.map((challenge, index) => (
        <article className="challenge-card" key={challenge.title}>
          <span>{index + 1}</span>
          <div>
            <h3>{challenge.title}</h3>
            <p>{challenge.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
