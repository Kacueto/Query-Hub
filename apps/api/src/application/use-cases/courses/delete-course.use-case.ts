import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { COURSE_REPOSITORY, CourseRepository } from "../../../domain/repositories/course.repository";

@Injectable()
export class DeleteCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existing = await this.courseRepository.findById(id);
    if (!existing) throw new NotFoundException("Course not found");
    await this.courseRepository.delete(id);
  }
}
