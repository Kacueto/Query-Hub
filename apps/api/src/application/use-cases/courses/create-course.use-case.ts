import { Inject, Injectable } from "@nestjs/common";
import { COURSE_REPOSITORY, CourseRepository } from "../../../domain/repositories/course.repository";
import { Course } from "../../../domain/entities/course.entity";
import { CreateCourseDto } from "../../dtos/create-course.dto";

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(dto: CreateCourseDto): Promise<Course> {
    const course = new Course(
      null,
      dto.nombre,
      dto.codigoNrc,
      dto.periodoAcademico,
      dto.profesorResponsableId,
      new Date(),
      new Date(),
    );
    return this.courseRepository.save(course);
  }
}
