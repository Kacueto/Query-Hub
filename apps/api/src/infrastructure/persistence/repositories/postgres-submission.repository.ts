import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubmissionRepository } from "../../../domain/repositories/submission.repository";
import { Submission } from "../../../domain/entities/submission.entity";
import { SubmissionTypeormEntity } from "../entities/submission.typeorm-entity";
import { SubmissionStatus } from "../../../domain/enums/submission-status.enum";

@Injectable()
export class PostgresSubmissionRepository implements SubmissionRepository {
  constructor(
    @InjectRepository(SubmissionTypeormEntity)
    private readonly repo: Repository<SubmissionTypeormEntity>,
  ) {}

  private toDomain(entity: SubmissionTypeormEntity): Submission {
    return new Submission(
      entity.id,
      entity.studentId,
      entity.challengeId,
      entity.evaluationId,
      entity.engine,
      entity.querySql,
      entity.status as SubmissionStatus,
      entity.createdAt,
    );
  }

  async findById(id: number): Promise<Submission | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByStudent(studentId: number): Promise<Submission[]> {
    const all = await this.repo.find({ where: { studentId } });
    return all.map(this.toDomain.bind(this));
  }

  async findByChallenge(challengeId: number): Promise<Submission[]> {
    const all = await this.repo.find({ where: { challengeId } });
    return all.map(this.toDomain.bind(this));
  }

  async countByStudentAndEvaluation(studentId: number, evaluationId: number): Promise<number> {
    return this.repo.count({ where: { studentId, evaluationId } });
  }

  async findBestScoreByStudentAndChallenge(studentId: number, challengeId: number): Promise<number | null> {
    const result = await this.repo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.assessment', 'a')
      .where('s.studentId = :studentId', { studentId })
      .andWhere('s.challengeId = :challengeId', { challengeId })
      .select('MAX(a.score)', 'maxScore')
      .getRawOne();
    return result?.maxScore ? Number(result.maxScore) : null;
  }

  async save(submission: Submission): Promise<Submission> {
    const saved = await this.repo.save({
      id: submission.id,
      studentId: submission.studentId,
      challengeId: submission.challengeId,
      evaluationId: submission.evaluationId,
      engine: submission.engine,
      querySql: submission.querySql,
      status: submission.status,
    });
    return this.toDomain(saved);
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await this.repo.update(id, { status: status as SubmissionStatus });
  }
}
