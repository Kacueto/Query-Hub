export interface SubmissionQueue {
  enqueue(submissionId: number, sql: string): Promise<void>;
}
export const SUBMISSION_QUEUE = Symbol('SubmissionQueue');
