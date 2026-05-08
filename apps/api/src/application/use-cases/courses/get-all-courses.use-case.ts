import { Inject, Injectable } from "@nestjs/common";
import { COURSE_REPOSITORY, CourseRepository } from "../../../domain/repositories/course.repository";
import { Course } from "../../../domain/entities/course.entity";
import { QueryCoursesDto } from "../../dtos/query-courses.dto";

@Injectable()
export class GetAllCoursesUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(filters?: QueryCoursesDto): Promise<Course[]> {
    if (filters?.studentId) {
      return this.courseRepository.findByStudent(filters.studentId);
    }
    return this.courseRepository.findAll();
  }
}
