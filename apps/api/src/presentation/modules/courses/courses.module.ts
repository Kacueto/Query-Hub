import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseTypeormEntity } from "../../../infrastructure/persistence/entities/course.typeorm-entity";
import { UserTypeormEntity } from "../../../infrastructure/persistence/entities/user.typeorm-entity";
import { EnrollmentTypeormEntity } from "../../../infrastructure/persistence/entities/enrollment.typeorm-entity";
import { ChallengeTypeormEntity } from "../../../infrastructure/persistence/entities/challenge.typeorm-entity";
import { EvaluationTypeormEntity } from "../../../infrastructure/persistence/entities/evaluation.typeorm-entity";
import { COURSE_REPOSITORY } from "../../../domain/repositories/course.repository";
import { PostgresCourseRepository } from "../../../infrastructure/persistence/repositories/postgres-course.repository";
import { CreateCourseUseCase } from "../../../application/use-cases/courses/create-course.use-case";
import { GetAllCoursesUseCase } from "../../../application/use-cases/courses/get-all-courses.use-case";
import { GetCourseByIdUseCase } from "../../../application/use-cases/courses/get-course-by-id.use-case";
import { UpdateCourseUseCase } from "../../../application/use-cases/courses/update-course.use-case";
import { DeleteCourseUseCase } from "../../../application/use-cases/courses/delete-course.use-case";
import { CoursesController } from "../../http/controllers/courses.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseTypeormEntity,
      UserTypeormEntity,
      EnrollmentTypeormEntity,
      ChallengeTypeormEntity,
      EvaluationTypeormEntity,
    ]),
  ],
  providers: [
    { provide: COURSE_REPOSITORY, useClass: PostgresCourseRepository },
    CreateCourseUseCase,
    GetAllCoursesUseCase,
    GetCourseByIdUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
  ],
  controllers: [CoursesController],
  exports: [COURSE_REPOSITORY],
})
export class CoursesModule {}
