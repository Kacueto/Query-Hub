import { SubmissionStatus } from "../enums/submission-status.enum";

export class Submission {
  constructor(
    public readonly id: number,
    public readonly studentId: number,
    public readonly challengeId: number,
    public readonly code: string,
    public readonly status: SubmissionStatus,
    public readonly createdAt: Date,
    public readonly executionTimeMs?: number | null,
    public readonly score?: number | null,
    public readonly result?: string | null,
    public readonly feedback?: string | null,
  ) {}

  isPending(): boolean {
    return (
      this.status === SubmissionStatus.QUEUED ||
      this.status === SubmissionStatus.RUNNING
    );
  }

  isAccepted(): boolean {
    return this.status === SubmissionStatus.ACCEPTED;
  }
}
