import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  // El worker no expone HTTP; solo procesa jobs de la cola
  const app = await NestFactory.createApplicationContext(WorkerModule);
  console.log('Worker SQL listening for jobs...');
  await app.init();
}

bootstrap();