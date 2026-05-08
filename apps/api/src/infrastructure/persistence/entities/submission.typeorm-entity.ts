import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { SubmissionStatus } from "../../../domain/enums/submission-status.enum";
import { UserTypeormEntity } from "./user.typeorm-entity";
import { ChallengeTypeormEntity } from "./challenge.typeorm-entity";
import { EvaluationTypeormEntity } from "./evaluation.typeorm-entity";
import { AssessmentTypeormEntity } from "./assessment.typeorm-entity";
import { AiRecommendationTypeormEntity } from "./ai-recommendation.typeorm-entity";

@Entity("submissions")
export class SubmissionTypeormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "student_id" })
  studentId: number;

  @ManyToOne(() => UserTypeormEntity, (user) => user.submissions)
  @JoinColumn({ name: "student_id" })
  student: UserTypeormEntity;

  @Column({ name: "challenge_id" })
  challengeId: number;

  @ManyToOne(() => ChallengeTypeormEntity, (challenge) => challenge.submissions)
  @JoinColumn({ name: "challenge_id" })
  challenge: ChallengeTypeormEntity;

  @Column({ name: "evaluation_id", nullable: true, type: "int" })
  evaluationId: number | null;

  @ManyToOne(
    () => EvaluationTypeormEntity,
    (evaluation) => evaluation.submissions,
    { nullable: true },
  )
  @JoinColumn({ name: "evaluation_id" })
  evaluation: EvaluationTypeormEntity | null;

  @Column({ type: "text" })
  code: string;

  @Column({
    type: "enum",
    enum: SubmissionStatus,
    default: SubmissionStatus.QUEUED,
  })
  status: SubmissionStatus;

  @Column({ type: "int", nullable: true, name: "execution_time_ms" })
  executionTimeMs: number | null;

  @Column({ type: "int", nullable: true })
  score: number | null;

  @Column({ type: "text", nullable: true })
  result: string | null;

  @Column({ type: "text", nullable: true })
  feedback: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToOne(
    () => AssessmentTypeormEntity,
    (assessment) => assessment.submission,
  )
  assessment: AssessmentTypeormEntity;

  @OneToOne(() => AiRecommendationTypeormEntity, (ai) => ai.submission)
  aiRecommendation: AiRecommendationTypeormEntity;
}
