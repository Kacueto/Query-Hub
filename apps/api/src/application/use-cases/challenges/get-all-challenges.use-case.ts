import { Inject, Injectable } from "@nestjs/common";
import {
  ChallengeRepository,
  CHALLENGE_REPOSITORY,
} from "../../../domain/repositories/challenge.repository";
import { Challenge } from "../../../domain/entities/challenge.entity";
import { QueryChallengesDto } from "../../dtos/query-challenges.dto";

@Injectable()
export class GetAllChallengesUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly challengeRepository: ChallengeRepository,
  ) {}

  async execute(filters?: QueryChallengesDto): Promise<Challenge[]> {
    return this.challengeRepository.findAll(filters);
  }
}
