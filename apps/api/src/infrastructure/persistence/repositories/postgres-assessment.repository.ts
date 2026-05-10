import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AssessmentRepository } from "../../../domain/repositories/assessment.repository";
import { Assessment } from "../../../domain/entities/assessment.entity";
import { AssessmentTypeormEntity } from "../entities/assessment.typeorm-entity";

@Injectable()
export class PostgresAssessmentRepository implements AssessmentRepository {
  constructor(
    @InjectRepository(AssessmentTypeormEntity)
    private readonly repo: Repository<AssessmentTypeormEntity>,
  ) {}

  private toDomain(entity: AssessmentTypeormEntity): Assessment {
    return new Assessment(
      entity.id,
      entity.submissionId,
      entity.status,
      Number(entity.score),
      entity.executionTimeMs,
      Number(entity.resultadoCorrectoPct),
      Number(entity.tiempoEjecucionPct),
      Number(entity.usoSqlPct),
      Number(entity.claridadPct),
      Number(entity.mejoraPosteriorPct),
      entity.createdAt,
    );
  }

  async findBySubmission(submissionId: number): Promise<Assessment | null> {
    const found = await this.repo.findOne({ where: { submissionId } });
    return found ? this.toDomain(found) : null;
  }

  async save(assessment: Assessment): Promise<Assessment> {
    const saved = await this.repo.save({
      id: assessment.id,
      submissionId: assessment.submissionId,
      status: assessment.status,
      score: assessment.score,
      executionTimeMs: assessment.executionTimeMs,
      resultadoCorrectoPct: assessment.resultadoCorrectoPct,
      tiempoEjecucionPct: assessment.tiempoEjecucionPct,
      usoSqlPct: assessment.usoSqlPct,
      claridadPct: assessment.claridadPct,
      mejoraPosteriorPct: assessment.mejoraPosteriorPct,
    });
    return this.toDomain(saved);
  }

  async updateMejoraPosterior(id: number, pct: number): Promise<void> {
    await this.repo.update(id, { mejoraPosteriorPct: pct });
  }
}
