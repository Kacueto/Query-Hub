import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { AssessmentTypeormEntity } from "./assessment.typeorm-entity";

@Entity("tests")
export class TestTypeormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "assessment_id" })
  assessmentId: number;

  @ManyToOne(() => AssessmentTypeormEntity, (assessment) => assessment.tests)
  @JoinColumn({ name: "assessment_id" })
  assessment: AssessmentTypeormEntity;

  @Column({ type: "varchar" })
  nombre: string;

  @Column({ type: "varchar" })
  status: string;

  @Column({ type: "text" })
  mensaje: string;

  @Column({ type: "numeric" })
  peso: number;
}
