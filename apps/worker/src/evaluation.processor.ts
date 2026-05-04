import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('sql-evaluation')
export class EvaluationProcessor extends WorkerHost {
  private readonly logger = new Logger(EvaluationProcessor.name);

  async process(job: Job): Promise<unknown> {
    this.logger.log(`Processing job ${job.id} — submission: ${job.data.submissionId}`);

    // Stub: aquí irá la lógica real de evaluación SQL en entregas futuras
    const result = {
      submissionId: job.data.submissionId,
      status: 'evaluated',
      correct: true,
      executionTimeMs: 42,
      message: 'Worker stub: evaluation simulated successfully',
    };

    this.logger.log(`Job ${job.id} completed`);
    return result;
  }
}