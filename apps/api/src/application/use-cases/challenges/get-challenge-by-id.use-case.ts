import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  ChallengeRepository,
  CHALLENGE_REPOSITORY,
} from "../../../domain/repositories/challenge.repository";
import { Challenge } from "../../../domain/entities/challenge.entity";

@Injectable()
export class GetChallengeByIdUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(id: number): Promise<Challenge> {
    const challenge = await this.challengeRepository.findById(id);
    if (!challenge) {
      throw new NotFoundException("Challenge not found");
    }
    return challenge;
  }
}
