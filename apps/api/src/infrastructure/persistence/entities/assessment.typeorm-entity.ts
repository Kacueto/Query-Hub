import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { SubmissionTypeormEntity } from "./submission.typeorm-entity";
import { TestTypeormEntity } from "./test.typeorm-entity";

@Entity("assessments")
export class AssessmentTypeormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "submission_id" })
  submissionId: number;

  @OneToOne(
    () => SubmissionTypeormEntity,
    (submission) => submission.assessment,
  )
  @JoinColumn({ name: "submission_id" })
  submission: SubmissionTypeormEntity;

  @Column({ type: "varchar" })
  status: string;

  @Column({ type: "numeric" })
  score: number;

  @Column({ type: "int", name: "execution_time_ms" })
  executionTimeMs: number;

  @Column({ type: "numeric", name: "resultado_correcto_pct" })
  resultadoCorrectoPct: number;

  @Column({ type: "numeric", name: "tiempo_ejecucion_pct" })
  tiempoEjecucionPct: number;

  @Column({ type: "numeric", name: "uso_sql_pct" })
  usoSqlPct: number;

  @Column({ type: "numeric", name: "claridad_pct" })
  claridadPct: number;

  @Column({ type: "numeric", name: "mejora_posterior_pct", default: 0 })
  mejoraPosteriorPct: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @OneToMany(() => TestTypeormEntity, (test) => test.assessment)
  tests: TestTypeormEntity[];
}
