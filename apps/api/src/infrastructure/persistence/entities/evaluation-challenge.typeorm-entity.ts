import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { EvaluationTypeormEntity } from "./evaluation.typeorm-entity";
import { ChallengeTypeormEntity } from "./challenge.typeorm-entity";

@Entity("evaluation_challenges")
export class EvaluationChallengeTypeormEntity {
  @PrimaryColumn({ name: "evaluation_id" })
  evaluationId: number;

  @PrimaryColumn({ name: "challenge_id" })
  challengeId: number;

  @ManyToOne(
    () => EvaluationTypeormEntity,
    (evaluation) => evaluation.evaluationChallenges,
  )
  @JoinColumn({ name: "evaluation_id" })
  evaluation: EvaluationTypeormEntity;

  @ManyToOne(
    () => ChallengeTypeormEntity,
    (challenge) => challenge.evaluationChallenges,
  )
  @JoinColumn({ name: "challenge_id" })
  challenge: ChallengeTypeormEntity;
}
