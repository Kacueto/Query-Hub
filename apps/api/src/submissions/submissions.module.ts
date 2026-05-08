import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { SubmissionTypeormEntity } from '../infrastructure/persistence/entities/submission.typeorm-entity';
import { SUBMISSION_REPOSITORY } from '../domain/repositories/submission.repository';
import { PostgresSubmissionRepository } from '../infrastructure/persistence/repositories/postgres-submission.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubmissionTypeormEntity]),
    BullModule.registerQueue({
      name: 'sql-evaluation',
    }),
  ],
  providers: [
    SubmissionsService,
    { provide: SUBMISSION_REPOSITORY, useClass: PostgresSubmissionRepository },
  ],
  controllers: [SubmissionsController],
})
export class SubmissionsModule {}
