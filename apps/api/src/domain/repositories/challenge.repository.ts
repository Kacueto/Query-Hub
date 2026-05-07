import { Challenge } from "../entities/challenge.entity";
import { ChallengeStatus } from "../enums/challenge-status.enum";

export const CHALLENGE_REPOSITORY = Symbol("ChallengeRepository");

export interface ChallengeRepository {
  findById(id: number): Promise<Challenge | null>;
  findByCourse(courseId: number): Promise<Challenge[]>;
  findPublishedByCourse(courseId: number): Promise<Challenge[]>;
  findAll(filters?: ChallengeFilters): Promise<Challenge[]>;
  save(challenge: Challenge): Promise<Challenge>;
  update(challenge: Challenge): Promise<Challenge>;
  delete(id: number): Promise<void>;
}

export interface ChallengeFilters {
  courseId?: number;
  status?: ChallengeStatus;
  difficulty?: string;
  databaseEngine?: string;
}
