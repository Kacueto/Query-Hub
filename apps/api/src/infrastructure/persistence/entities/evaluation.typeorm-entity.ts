import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { CourseTypeormEntity } from "./course.typeorm-entity";
import { EvaluationChallengeTypeormEntity } from "./evaluation-challenge.typeorm-entity";
import { SubmissionTypeormEntity } from "./submission.typeorm-entity";

@Entity("evaluations")
export class EvaluationTypeormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "course_id" })
  courseId: number;

  @ManyToOne(() => CourseTypeormEntity, (course) => course.evaluations)
  @JoinColumn({ name: "course_id" })
  course: CourseTypeormEntity;

  @Column({ type: "varchar" })
  nombre: string;

  @Column({ type: "text" })
  descripcion: string;

  @Column({ type: "timestamp", name: "fecha_apertura" })
  fechaApertura: Date;

  @Column({ type: "timestamp", name: "fecha_cierre" })
  fechaCierre: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @OneToMany(() => EvaluationChallengeTypeormEntity, (ec) => ec.evaluation)
  evaluationChallenges: EvaluationChallengeTypeormEntity[];

  @OneToMany(
    () => SubmissionTypeormEntity,
    (submission) => submission.evaluation,
  )
  submissions: SubmissionTypeormEntity[];
}
