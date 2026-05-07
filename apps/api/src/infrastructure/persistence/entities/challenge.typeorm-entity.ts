import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { ChallengeStatus } from "../../../domain/enums/challenge-status.enum";
import { ChallengeDifficulty } from "../../../domain/enums/challenge-difficulty.enum";
import { CourseTypeormEntity } from "./course.typeorm-entity";
import { UserTypeormEntity } from "./user.typeorm-entity";
import { SchemaTypeormEntity } from "./schema.typeorm-entity";
import { SubmissionTypeormEntity } from "./submission.typeorm-entity";
import { RandomDataGenerationTypeormEntity } from "./random-data-generation.typeorm-entity";
import { EvaluationChallengeTypeormEntity } from "./evaluation-challenge.typeorm-entity";

@Entity("challenges")
export class ChallengeTypeormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "enum", enum: ChallengeDifficulty })
  difficulty: ChallengeDifficulty;

  @Column({ type: "json" })
  tags: string[];

  @Column({ type: "varchar", name: "database_engine" })
  databaseEngine: string;

  @Column({ type: "int", name: "time_limit_ms" })
  timeLimitMs: number;

  @Column({
    type: "enum",
    enum: ChallengeStatus,
    default: ChallengeStatus.DRAFT,
  })
  status: ChallengeStatus;

  @Column({ name: "course_id" })
  courseId: number;

  @ManyToOne(() => CourseTypeormEntity, (course) => course.challenges)
  @JoinColumn({ name: "course_id" })
  course: CourseTypeormEntity;

  @Column({ name: "created_by" })
  createdBy: number;

  @ManyToOne(() => UserTypeormEntity, (user) => user.challenges)
  @JoinColumn({ name: "created_by" })
  createdByUser: UserTypeormEntity;

  @Column({ type: "text", name: "schema_sql", nullable: true, default: "" })
  schemaSQL: string | null;

  @Column({ type: "text", name: "seed_sql", nullable: true, default: "" })
  seedSQL: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => SchemaTypeormEntity, (schema) => schema.challenge)
  schemas: SchemaTypeormEntity[];

  @OneToMany(
    () => SubmissionTypeormEntity,
    (submission) => submission.challenge,
  )
  submissions: SubmissionTypeormEntity[];

  @OneToOne(() => RandomDataGenerationTypeormEntity, (rdg) => rdg.challenge)
  randomDataGeneration: RandomDataGenerationTypeormEntity;

  @OneToMany(() => EvaluationChallengeTypeormEntity, (ec) => ec.challenge)
  evaluationChallenges: EvaluationChallengeTypeormEntity[];
}
