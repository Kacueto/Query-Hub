import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChallengeTypeormEntity } from "../../../infrastructure/persistence/entities/challenge.typeorm-entity";
import { CourseTypeormEntity } from "../../../infrastructure/persistence/entities/course.typeorm-entity";
import { UserTypeormEntity } from "../../../infrastructure/persistence/entities/user.typeorm-entity";
import { SchemaTypeormEntity } from "../../../infrastructure/persistence/entities/schema.typeorm-entity";
import { SubmissionTypeormEntity } from "../../../infrastructure/persistence/entities/submission.typeorm-entity";
import { RandomDataGenerationTypeormEntity } from "../../../infrastructure/persistence/entities/random-data-generation.typeorm-entity";
import { EvaluationChallengeTypeormEntity } from "../../../infrastructure/persistence/entities/evaluation-challenge.typeorm-entity";
import { EnrollmentTypeormEntity } from "../../../infrastructure/persistence/entities/enrollment.typeorm-entity";
import { EvaluationTypeormEntity } from "../../../infrastructure/persistence/entities/evaluation.typeorm-entity";
import { AssessmentTypeormEntity } from "../../../infrastructure/persistence/entities/assessment.typeorm-entity";
import { AiRecommendationTypeormEntity } from "../../../infrastructure/persistence/entities/ai-recommendation.typeorm-entity";
import { TestTypeormEntity } from "../../../infrastructure/persistence/entities/test.typeorm-entity";
import { CHALLENGE_REPOSITORY } from "../../../domain/repositories/challenge.repository";
import { PostgresChallengeRepository } from "../../../infrastructure/persistence/repositories/postgres-challenge.repository";
import { CreateChallengeUseCase } from "../../../application/use-cases/challenges/create-challenge.use-case";
import { GetAllChallengesUseCase } from "../../../application/use-cases/challenges/get-all-challenges.use-case";
import { GetChallengeByIdUseCase } from "../../../application/use-cases/challenges/get-challenge-by-id.use-case";
import { UpdateChallengeUseCase } from "../../../application/use-cases/challenges/update-challenge.use-case";
import { DeleteChallengeUseCase } from "../../../application/use-cases/challenges/delete-challenge.use-case";
import { PublishChallengeUseCase } from "../../../application/use-cases/challenges/publish-challenge.use-case";
import { UpdateChallengeSchemaUseCase } from "../../../application/use-cases/challenges/update-challenge-schema.use-case";
import { UpdateChallengeSeedUseCase } from "../../../application/use-cases/challenges/update-challenge-seed.use-case";
import { ChallengesController } from "../../http/controllers/challenges.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChallengeTypeormEntity,
      CourseTypeormEntity,
      UserTypeormEntity,
      SchemaTypeormEntity,
      SubmissionTypeormEntity,
      RandomDataGenerationTypeormEntity,
      EvaluationChallengeTypeormEntity,
      EnrollmentTypeormEntity,
      EvaluationTypeormEntity,
      AssessmentTypeormEntity,
      AiRecommendationTypeormEntity,
      TestTypeormEntity,
    ]),
  ],
  providers: [
    { provide: CHALLENGE_REPOSITORY, useClass: PostgresChallengeRepository },
    CreateChallengeUseCase,
    GetAllChallengesUseCase,
    GetChallengeByIdUseCase,
    UpdateChallengeUseCase,
    DeleteChallengeUseCase,
    PublishChallengeUseCase,
    UpdateChallengeSchemaUseCase,
    UpdateChallengeSeedUseCase,
  ],
  controllers: [ChallengesController],
  exports: [CHALLENGE_REPOSITORY],
})
export class ChallengesModule {}
