import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  ChallengeRepository,
  ChallengeFilters,
} from "../../../domain/repositories/challenge.repository";
import { Challenge } from "../../../domain/entities/challenge.entity";
import { ChallengeTypeormEntity } from "../entities/challenge.typeorm-entity";
import { ChallengeStatus } from "../../../domain/enums/challenge-status.enum";
import { ChallengeDifficulty } from "../../../domain/enums/challenge-difficulty.enum";

@Injectable()
export class PostgresChallengeRepository implements ChallengeRepository {
  constructor(
    @InjectRepository(ChallengeTypeormEntity)
    private readonly repo: Repository<ChallengeTypeormEntity>,
  ) {}

  private toDomain(entity: ChallengeTypeormEntity): Challenge {
    return new Challenge(
      entity.id,
      entity.title,
      entity.description,
      entity.difficulty as ChallengeDifficulty,
      entity.tags,
      entity.databaseEngine,
      entity.timeLimitMs,
      entity.status as ChallengeStatus,
      entity.courseId,
      entity.createdBy,
      entity.schemaSQL ?? "",
      entity.seedSQL ?? "",
      entity.createdAt,
      entity.updatedAt,
    );
  }

  async findById(id: number): Promise<Challenge | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByCourse(courseId: number): Promise<Challenge[]> {
    const all = await this.repo.find({ where: { courseId } });
    return all.map((e) => this.toDomain(e));
  }

  async findPublishedByCourse(courseId: number): Promise<Challenge[]> {
    const all = await this.repo.find({
      where: { courseId, status: ChallengeStatus.PUBLISHED },
    });
    return all.map((e) => this.toDomain(e));
  }

  async findAll(filters?: ChallengeFilters): Promise<Challenge[]> {
    const where: Record<string, unknown> = {};
    if (filters?.courseId) {
      where.courseId = filters.courseId;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.difficulty) {
      where.difficulty = filters.difficulty;
    }
    if (filters?.databaseEngine) {
      where.databaseEngine = filters.databaseEngine;
    }
    const all = await this.repo.find({ where });
    return all.map((e) => this.toDomain(e));
  }

  async save(challenge: Challenge): Promise<Challenge> {
    const saved = await this.repo.save({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      tags: challenge.tags,
      databaseEngine: challenge.databaseEngine,
      timeLimitMs: challenge.timeLimitMs,
      status: challenge.status,
      courseId: challenge.courseId,
      createdBy: challenge.createdBy,
      schemaSQL: challenge.schemaSQL,
      seedSQL: challenge.seedSQL,
    });
    return this.toDomain(saved);
  }

  async update(challenge: Challenge): Promise<Challenge> {
    const existing = await this.repo.findOne({ where: { id: challenge.id } });
    if (!existing) {
      throw new Error(`Challenge with id ${challenge.id} not found for update`);
    }

    const merged = this.repo.merge(existing, {
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      tags: challenge.tags,
      databaseEngine: challenge.databaseEngine,
      timeLimitMs: challenge.timeLimitMs,
      status: challenge.status,
      courseId: challenge.courseId,
      schemaSQL: challenge.schemaSQL,
      seedSQL: challenge.seedSQL,
    });

    const saved = await this.repo.save(merged);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
