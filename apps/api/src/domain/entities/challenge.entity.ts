import { ChallengeStatus } from "../enums/challenge-status.enum";

export class Challenge {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string,
    public readonly difficulty: string,
    public readonly tags: string[],
    public readonly databaseEngine: string,
    public readonly timeLimitMs: number,
    public readonly status: ChallengeStatus,
    public readonly courseId: number,
    public readonly createdBy: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isPublished(): boolean {
    return this.status === ChallengeStatus.PUBLISHED;
  }
  isDraft(): boolean {
    return this.status === ChallengeStatus.DRAFT;
  }
  isArchived(): boolean {
    return this.status === ChallengeStatus.ARCHIVED;
  }

  canTransitionTo(next: ChallengeStatus): boolean {
    const transitions: Record<ChallengeStatus, ChallengeStatus[]> = {
      [ChallengeStatus.DRAFT]: [ChallengeStatus.PUBLISHED],
      [ChallengeStatus.PUBLISHED]: [ChallengeStatus.ARCHIVED],
      [ChallengeStatus.ARCHIVED]: [],
    };
    return transitions[this.status].includes(next);
  }
}
