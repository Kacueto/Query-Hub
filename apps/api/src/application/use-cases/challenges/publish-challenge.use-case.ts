import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import {
  ChallengeRepository,
  CHALLENGE_REPOSITORY,
} from "../../../domain/repositories/challenge.repository";
import { Challenge } from "../../../domain/entities/challenge.entity";
import { ChallengeStatus } from "../../../domain/enums/challenge-status.enum";

@Injectable()
export class PublishChallengeUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(id: number): Promise<Challenge> {
    const existing = await this.challengeRepository.findById(id);
    if (!existing) {
      throw new NotFoundException("Challenge not found");
    }

    if (!existing.canTransitionTo(ChallengeStatus.PUBLISHED)) {
      throw new BadRequestException(
        `Cannot publish a challenge with status ${existing.status}`,
      );
    }

    const published = new Challenge(
      existing.id,
      existing.title,
      existing.description,
      existing.difficulty,
      existing.tags,
      existing.databaseEngine,
      existing.timeLimitMs,
      ChallengeStatus.PUBLISHED,
      existing.courseId,
      existing.createdBy,
      existing.schemaSQL,
      existing.seedSQL,
      existing.createdAt,
      new Date(),
    );

    return this.challengeRepository.update(published);
  }
}
