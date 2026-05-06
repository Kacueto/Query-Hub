import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
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

  @Column({ type: "varchar" })
  engine: string;

  @Column({ type: "text", name: "query_sql" })
  querySql: string;

  @Column({
    type: "enum",
    enum: SubmissionStatus,
    default: SubmissionStatus.QUEUED,
  })
  status: SubmissionStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @OneToOne(
    () => AssessmentTypeormEntity,
    (assessment) => assessment.submission,
  )
  assessment: AssessmentTypeormEntity;

  @OneToOne(() => AiRecommendationTypeormEntity, (ai) => ai.submission)
  aiRecommendation: AiRecommendationTypeormEntity;
}
