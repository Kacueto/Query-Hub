import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('sql-evaluation')
export class EvaluationProcessor {
  private readonly logger = new Logger(EvaluationProcessor.name);

  @Process('execute-sql')
  async handle(job: Job) {
    this.logger.log('Job recibido: ' + JSON.stringify(job.data));

    // Simulación
    await new Promise(res => setTimeout(res, 2000));

    this.logger.log('SQL ejecutado');
  }
}