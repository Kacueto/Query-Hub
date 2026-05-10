import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChallengeTypeormEntity } from "../../../infrastructure/persistence/entities/challenge.typeorm-entity";
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
    TypeOrmModule.forFeature([ChallengeTypeormEntity]),
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
