import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { createTypeOrmConfig } from "../infrastructure/config/database.config";
import { SeedService } from "./seed.service";
import { UserTypeormEntity } from "../infrastructure/persistence/entities/user.typeorm-entity";
import { CourseTypeormEntity } from "../infrastructure/persistence/entities/course.typeorm-entity";
import { ChallengeTypeormEntity } from "../infrastructure/persistence/entities/challenge.typeorm-entity";
import { EnrollmentTypeormEntity } from "../infrastructure/persistence/entities/enrollment.typeorm-entity";
import { USER_REPOSITORY } from "../domain/repositories/user.repository";
import { COURSE_REPOSITORY } from "../domain/repositories/course.repository";
import { CHALLENGE_REPOSITORY } from "../domain/repositories/challenge.repository";
import { PostgresUserRepository } from "../infrastructure/persistence/repositories/postgres-user.repository";
import { PostgresCourseRepository } from "../infrastructure/persistence/repositories/postgres-course.repository";
import { PostgresChallengeRepository } from "../infrastructure/persistence/repositories/postgres-challenge.repository";

@Module({
  imports: [
    // Standalone context: necesita su propia conexión TypeORM
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createTypeOrmConfig(config),
    }),
    TypeOrmModule.forFeature([
      UserTypeormEntity,
      CourseTypeormEntity,
      ChallengeTypeormEntity,
      EnrollmentTypeormEntity,
    ]),
  ],
  providers: [
    { provide: USER_REPOSITORY, useClass: PostgresUserRepository },
    { provide: COURSE_REPOSITORY, useClass: PostgresCourseRepository },
    { provide: CHALLENGE_REPOSITORY, useClass: PostgresChallengeRepository },
    SeedService,
  ],
})
export class SeedModule {}
