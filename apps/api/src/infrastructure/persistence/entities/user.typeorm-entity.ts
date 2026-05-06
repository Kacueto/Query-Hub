import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Role } from "../../../domain/enums/role.enum";
import { EnrollmentTypeormEntity } from "./enrollment.typeorm-entity";
import { SubmissionTypeormEntity } from "./submission.typeorm-entity";
import { ChallengeTypeormEntity } from "./challenge.typeorm-entity";
import { CourseTypeormEntity } from "./course.typeorm-entity";

@Entity("users")
export class UserTypeormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  nombre: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar", name: "password_hash" })
  passwordHash: string;

  @Column({ type: "enum", enum: Role })
  role: Role;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => CourseTypeormEntity, (course) => course.profesorResponsable)
  courses: CourseTypeormEntity[];

  @OneToMany(() => EnrollmentTypeormEntity, (enrollment) => enrollment.student)
  enrollments: EnrollmentTypeormEntity[];

  @OneToMany(() => SubmissionTypeormEntity, (submission) => submission.student)
  submissions: SubmissionTypeormEntity[];

  @OneToMany(
    () => ChallengeTypeormEntity,
    (challenge) => challenge.createdByUser,
  )
  challenges: ChallengeTypeormEntity[];
}
