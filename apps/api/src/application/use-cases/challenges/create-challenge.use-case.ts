import { Inject, Injectable } from "@nestjs/common";
import {
  ChallengeRepository,
  CHALLENGE_REPOSITORY,
} from "../../../domain/repositories/challenge.repository";
import { Challenge } from "../../../domain/entities/challenge.entity";
import { ChallengeStatus } from "../../../domain/enums/challenge-status.enum";
import { CreateChallengeDto } from "../../dtos/create-challenge.dto";

@Injectable()
export class CreateChallengeUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(dto: CreateChallengeDto): Promise<Challenge> {
    const challenge = new Challenge(
      null,
      dto.title,
      dto.description,
      dto.difficulty,
      dto.tags,
      dto.databaseEngine,
      dto.timeLimitMs,
      ChallengeStatus.DRAFT,
      dto.courseId,
      dto.createdBy,
      dto.schemaSQL ?? "",
      dto.seedSQL ?? "",
      new Date(),
      new Date(),
    );
    return this.challengeRepository.save(challenge);
  }
}
