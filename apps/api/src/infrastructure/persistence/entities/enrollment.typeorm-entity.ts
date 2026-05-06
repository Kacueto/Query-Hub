import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserTypeormEntity } from "./user.typeorm-entity";
import { CourseTypeormEntity } from "./course.typeorm-entity";

@Entity("enrollments")
export class EnrollmentTypeormEntity {
  @PrimaryColumn({ name: "student_id" })
  studentId: number;

  @PrimaryColumn({ name: "course_id" })
  courseId: number;

  @ManyToOne(() => UserTypeormEntity, (user) => user.enrollments)
  @JoinColumn({ name: "student_id" })
  student: UserTypeormEntity;

  @ManyToOne(() => CourseTypeormEntity, (course) => course.enrollments)
  @JoinColumn({ name: "course_id" })
  course: CourseTypeormEntity;

  @CreateDateColumn({ name: "enrolled_at" })
  enrolledAt: Date;
}
