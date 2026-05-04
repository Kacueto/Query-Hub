import { Course } from "../entities/course.entity";
export const COURSE_REPOSITORY = Symbol("CourseRepository");
export interface CourseRepository {
  findById(id: number): Promise<Course | null>;
  findByProfessor(professorId: number): Promise<Course[]>;
  save(course: Course): Promise<Course>;
  delete(id: number): Promise<void>;
}
