import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  ChallengeRepository,
  CHALLENGE_REPOSITORY,
} from "../../../domain/repositories/challenge.repository";
import { Challenge } from "../../../domain/entities/challenge.entity";
import { UpdateSchemaDto } from "../../dtos/update-schema.dto";

@Injectable()
export class UpdateChallengeSchemaUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(id: number, dto: UpdateSchemaDto): Promise<Challenge> {
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
      dto.schemaSQL,
      existing.seedSQL,
      existing.createdAt,
      new Date(),
    );

    return this.challengeRepository.update(updated);
  }
}
