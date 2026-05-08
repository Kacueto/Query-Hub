import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { COURSE_REPOSITORY, CourseRepository } from "../../../domain/repositories/course.repository";
import { Course } from "../../../domain/entities/course.entity";
import { UpdateCourseDto } from "../../dtos/update-course.dto";

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(id: number, dto: UpdateCourseDto): Promise<Course> {
    const existing = await this.courseRepository.findById(id);
    if (!existing) throw new NotFoundException("Course not found");

    const updated = new Course(
      existing.id,
      dto.nombre ?? existing.nombre,
      dto.codigoNrc ?? existing.codigoNrc,
      dto.periodoAcademico ?? existing.periodoAcademico,
      dto.profesorResponsableId ?? existing.profesorResponsableId,
      existing.createdAt,
      new Date(),
    );
    return this.courseRepository.update(updated);
  }
}
