import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectQueue('sql-evaluation') private sqlQueue: Queue,
  ) {}

  async createSubmission(dto: CreateSubmissionDto) {
    const submission = {
      id: Date.now(),
      ...dto,
      status: 'PENDING',
    };

    await this.sqlQueue.add('execute-sql', {
      submissionId: submission.id,
      sql: dto.sql,
    });

    return submission;
  }
}