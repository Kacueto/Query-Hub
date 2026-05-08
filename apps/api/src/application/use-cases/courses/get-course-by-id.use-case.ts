import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { COURSE_REPOSITORY, CourseRepository } from "../../../domain/repositories/course.repository";
import { Course } from "../../../domain/entities/course.entity";

@Injectable()
export class GetCourseByIdUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(id: number): Promise<Course> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new NotFoundException("Course not found");
    return course;
  }
}
