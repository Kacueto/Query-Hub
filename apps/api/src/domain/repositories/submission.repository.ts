import { Submission } from "../entities/submission.entity";
export const SUBMISSION_REPOSITORY = Symbol("SubmissionRepository");
export interface SubmissionRepository {
  findById(id: number): Promise<Submission | null>;
  findByStudent(studentId: number): Promise<Submission[]>;
  findByChallenge(challengeId: number): Promise<Submission[]>;
  countByStudentAndEvaluation(
    studentId: number,
    evaluationId: number,
  ): Promise<number>;
  findBestScoreByStudentAndChallenge(
    studentId: number,
    challengeId: number,
  ): Promise<number | null>;
  save(submission: Submission): Promise<Submission>;
  updateStatus(id: number, status: string): Promise<void>;
}
