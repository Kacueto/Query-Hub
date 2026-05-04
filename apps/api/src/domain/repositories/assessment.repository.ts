import { Assessment } from "../entities/assessment.entity";
export const ASSESSMENT_REPOSITORY = Symbol("AssessmentRepository");
export interface AssessmentRepository {
  findBySubmission(submissionId: number): Promise<Assessment | null>;
  save(assessment: Assessment): Promise<Assessment>;
  updateMejoraPosterior(id: number, pct: number): Promise<void>;
}
