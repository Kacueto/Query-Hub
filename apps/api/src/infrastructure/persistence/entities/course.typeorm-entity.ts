import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { UserTypeormEntity } from "./user.typeorm-entity";
import { EnrollmentTypeormEntity } from "./enrollment.typeorm-entity";
import { ChallengeTypeormEntity } from "./challenge.typeorm-entity";
import { EvaluationTypeormEntity } from "./evaluation.typeorm-entity";

@Entity("courses")
export class CourseTypeormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  nombre: string;

  @Column({ type: "varchar", name: "codigo_nrc" })
  codigoNrc: string;

  @Column({ type: "varchar", name: "periodo_academico" })
  periodoAcademico: string;

  @Column({ name: "profesor_responsable_id" })
  profesorResponsableId: number;

  @ManyToOne(() => UserTypeormEntity, (user) => user.courses)
  @JoinColumn({ name: "profesor_responsable_id" })
  profesorResponsable: UserTypeormEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => EnrollmentTypeormEntity, (enrollment) => enrollment.course)
  enrollments: EnrollmentTypeormEntity[];

  @OneToMany(() => ChallengeTypeormEntity, (challenge) => challenge.course)
  challenges: ChallengeTypeormEntity[];

  @OneToMany(() => EvaluationTypeormEntity, (evaluation) => evaluation.course)
  evaluations: EvaluationTypeormEntity[];
}
