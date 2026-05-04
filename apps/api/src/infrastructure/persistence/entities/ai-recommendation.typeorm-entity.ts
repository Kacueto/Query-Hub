import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { SubmissionTypeormEntity } from "./submission.typeorm-entity";

@Entity("ai_recommendations")
export class AiRecommendationTypeormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "submission_id" })
  submissionId: number;

  @OneToOne(
    () => SubmissionTypeormEntity,
    (submission) => submission.aiRecommendation,
  )
  @JoinColumn({ name: "submission_id" })
  submission: SubmissionTypeormEntity;

  @Column({ type: "text" })
  explanation: string;

  @Column({ type: "text", name: "suggested_query" })
  suggestedQuery: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
