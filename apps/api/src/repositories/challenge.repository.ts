import { Challenge } from "../entities/challenge.entity";
export const CHALLENGE_REPOSITORY = Symbol("ChallengeRepository");
export interface ChallengeRepository {
  findById(id: number): Promise<Challenge | null>;
  findByCourse(courseId: number): Promise<Challenge[]>;
  findPublishedByCourse(courseId: number): Promise<Challenge[]>;
  save(challenge: Challenge): Promise<Challenge>;
}
