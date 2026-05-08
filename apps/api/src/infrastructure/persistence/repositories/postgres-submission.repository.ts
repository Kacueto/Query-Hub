import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Submission } from "../../../domain/entities/submission.entity";
import { SubmissionRepository } from "../../../domain/repositories/submission.repository";
import { SubmissionTypeormEntity } from "../entities/submission.typeorm-entity";
import { SubmissionStatus } from "../../../domain/enums/submission-status.enum";

@Injectable()
export class PostgresSubmissionRepository implements SubmissionRepository {
  constructor(
    @InjectRepository(SubmissionTypeormEntity)
    private readonly repo: Repository<SubmissionTypeormEntity>,
  ) {}

  async findById(id: number): Promise<Submission | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByStudent(studentId: number): Promise<Submission[]> {
    const all = await this.repo.find({ where: { studentId } });
    return all.map((e) => this.toDomain(e));
  }

  async findByChallenge(challengeId: number): Promise<Submission[]> {
    const all = await this.repo.find({ where: { challengeId } });
    return all.map((e) => this.toDomain(e));
  }

  async findByStudentAndChallenge(
    studentId: number,
    challengeId: number,
  ): Promise<Submission[]> {
    const all = await this.repo.find({
      where: { studentId, challengeId },
    });
    return all.map((e) => this.toDomain(e));
  }

  async countByStudentAndEvaluation(
    studentId: number,
    evaluationId: number,
  ): Promise<number> {
    return await this.repo.count({
      where: { studentId, evaluationId },
    });
  }

  async findBestScoreByStudentAndChallenge(
    studentId: number,
    challengeId: number,
  ): Promise<number | null> {
    const result = await this.repo.findOne({
      where: { studentId, challengeId },
      order: { score: "DESC" },
    });
    return result?.score ?? null;
  }

  async save(submission: Submission): Promise<Submission> {
    const entity = new SubmissionTypeormEntity();
    entity.id = submission.id;
    entity.studentId = submission.studentId;
    entity.challengeId = submission.challengeId;
    entity.code = submission.code;
    entity.status = submission.status;
    entity.executionTimeMs = submission.executionTimeMs || null;
    entity.score = submission.score || null;
    entity.result = submission.result || null;
    entity.feedback = submission.feedback || null;
    entity.createdAt = submission.createdAt;
    entity.updatedAt = new Date();

    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await this.repo.update({ id }, { status: status as SubmissionStatus });
  }

  private toDomain(entity: SubmissionTypeormEntity): Submission {
    return new Submission(
      entity.id,
      entity.studentId,
      entity.challengeId,
      entity.code,
      entity.status,
      entity.createdAt,
      entity.executionTimeMs,
      entity.score,
      entity.result,
      entity.feedback,
    );
  }
}
