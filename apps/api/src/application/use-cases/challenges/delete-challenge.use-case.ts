import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  ChallengeRepository,
  CHALLENGE_REPOSITORY,
} from "../../../domain/repositories/challenge.repository";

@Injectable()
export class DeleteChallengeUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const existing = await this.challengeRepository.findById(id);
    if (!existing) {
      throw new NotFoundException("Challenge not found");
    }
    await this.challengeRepository.delete(id);
  }
}
