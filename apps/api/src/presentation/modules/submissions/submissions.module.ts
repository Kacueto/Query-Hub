import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bull";
import { SubmissionTypeormEntity } from "../../../infrastructure/persistence/entities/submission.typeorm-entity";
import { AssessmentTypeormEntity } from "../../../infrastructure/persistence/entities/assessment.typeorm-entity";
import { SUBMISSION_REPOSITORY } from "../../../domain/repositories/submission.repository";
import { ASSESSMENT_REPOSITORY } from "../../../domain/repositories/assessment.repository";
import { SUBMISSION_QUEUE } from "../../../application/ports/submission-queue.port";
import { PostgresSubmissionRepository } from "../../../infrastructure/persistence/repositories/postgres-submission.repository";
import { PostgresAssessmentRepository } from "../../../infrastructure/persistence/repositories/postgres-assessment.repository";
import { BullSubmissionQueueAdapter } from "../../../infrastructure/queue/bull-submission-queue.adapter";
import { CreateSubmissionUseCase } from "../../../application/use-cases/submissions/create-submission.use-case";
import { SubmissionsController } from "../../http/controllers/submissions.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubmissionTypeormEntity, AssessmentTypeormEntity]),
    BullModule.registerQueue({ name: 'sql-evaluation' }),
  ],
  controllers: [SubmissionsController],
  providers: [
    { provide: SUBMISSION_REPOSITORY, useClass: PostgresSubmissionRepository },
    { provide: ASSESSMENT_REPOSITORY, useClass: PostgresAssessmentRepository },
    { provide: SUBMISSION_QUEUE, useClass: BullSubmissionQueueAdapter },
    CreateSubmissionUseCase,
  ],
})
export class SubmissionsModule {}
