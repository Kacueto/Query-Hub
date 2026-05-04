import { SubmissionStatus } from "../enums/submission-status.enum";

export class Submission {
  constructor(
    public readonly id: number,
    public readonly studentId: number,
    public readonly challengeId: number,
    public readonly evaluationId: number | null, // nullable: puede ser fuera de evaluación
    public readonly engine: string,
    public readonly querySql: string,
    public readonly status: SubmissionStatus,
    public readonly createdAt: Date,
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
