import { Injectable, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SUBMISSION_REPOSITORY } from '../domain/repositories/submission.repository';
import { SubmissionRepository } from '../domain/repositories/submission.repository';
import { Submission } from '../domain/entities/submission.entity';
import { SubmissionStatus } from '../domain/enums/submission-status.enum';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectQueue('sql-evaluation') private sqlQueue: Queue,
    @Inject(SUBMISSION_REPOSITORY) private submissionRepository: SubmissionRepository,
  ) {}

  async createSubmission(dto: CreateSubmissionDto) {
    // Crear submission en estado QUEUED
    const submission = new Submission(
      Date.now(),
      dto.studentId,
      dto.challengeId,
      dto.code,
      SubmissionStatus.QUEUED,
      new Date(),
    );

    // Persistir en base de datos
    const saved = await this.submissionRepository.save(submission);

    // Encolar para evaluación
    await this.sqlQueue.add('execute-sql', {
      submissionId: saved.id,
      studentId: saved.studentId,
      challengeId: saved.challengeId,
      code: saved.code,
    });

    return {
      id: saved.id,
      studentId: saved.studentId,
      challengeId: saved.challengeId,
      status: saved.status,
      createdAt: saved.createdAt,
    };
  }

  async getSubmission(id: number) {
    return await this.submissionRepository.findById(id);
  }

  async getSubmissionsByStudent(studentId: number) {
    return await this.submissionRepository.findByStudent(studentId);
  }

  async getSubmissionsByChallenge(challengeId: number) {
    return await this.submissionRepository.findByChallenge(challengeId);
  }
}
