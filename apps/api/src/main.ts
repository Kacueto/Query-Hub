import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Query Hub API')
    .setDescription('Plataforma de evaluación automática de consultas SQL. Permite a profesores crear retos SQL y a estudiantes enviar soluciones para evaluación automatizada.')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local development')
    .addTag('Auth', 'Autenticación y gestión de tokens JWT')
    .addTag('Users', 'Gestión de usuarios del sistema')
    .addTag('Courses', 'Gestión de cursos académicos')
    .addTag('Challenges', 'Retos SQL para evaluación de estudiantes')
    .addTag('Submissions', 'Envío de soluciones SQL para evaluación')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`API running on port ${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();