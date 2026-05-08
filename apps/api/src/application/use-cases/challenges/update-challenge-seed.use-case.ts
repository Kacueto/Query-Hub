import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  ChallengeRepository,
  CHALLENGE_REPOSITORY,
} from "../../../domain/repositories/challenge.repository";
import { Challenge } from "../../../domain/entities/challenge.entity";
import { UpdateSeedDto } from "../../dtos/update-seed.dto";

@Injectable()
export class UpdateChallengeSeedUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(id: number, dto: UpdateSeedDto): Promise<Challenge> {
    const existing = await this.challengeRepository.findById(id);
    if (!existing) {
      throw new NotFoundException("Challenge not found");
    }

    const updated = new Challenge(
      existing.id,
      existing.title,
      existing.description,
      existing.difficulty,
      existing.tags,
      existing.databaseEngine,
      existing.timeLimitMs,
      existing.status,
      existing.courseId,
      existing.createdBy,
      existing.schemaSQL,
      dto.seedSQL,
      existing.createdAt,
      new Date(),
    );

    return this.challengeRepository.update(updated);
  }
}
