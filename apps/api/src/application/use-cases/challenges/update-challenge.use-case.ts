import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  ChallengeRepository,
  CHALLENGE_REPOSITORY,
} from "../../../domain/repositories/challenge.repository";
import { Challenge } from "../../../domain/entities/challenge.entity";
import { UpdateChallengeDto } from "../../dtos/update-challenge.dto";

@Injectable()
export class UpdateChallengeUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(id: number, dto: UpdateChallengeDto): Promise<Challenge> {
    const existing = await this.challengeRepository.findById(id);
    if (!existing) {
      throw new NotFoundException("Challenge not found");
    }

    const updated = new Challenge(
      existing.id,
      dto.title ?? existing.title,
      dto.description ?? existing.description,
      dto.difficulty ?? existing.difficulty,
      dto.tags ?? existing.tags,
      dto.databaseEngine ?? existing.databaseEngine,
      dto.timeLimitMs ?? existing.timeLimitMs,
      existing.status,
      dto.courseId ?? existing.courseId,
      existing.createdBy,
      existing.schemaSQL,
      existing.seedSQL,
      existing.createdAt,
      new Date(),
    );

    return this.challengeRepository.update(updated);
  }
}
