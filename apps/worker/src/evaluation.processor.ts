import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('sql-jobs')
export class EvaluationProcessor {

  @Process('execute-sql')
  async handle(job: Job) {
    console.log('Job recibido:', job.data);

    // Simulación
    await new Promise(res => setTimeout(res, 2000));

    console.log('SQL ejecutado');
  }
}