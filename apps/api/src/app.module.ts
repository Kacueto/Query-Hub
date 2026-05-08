import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { AuthModule } from './presentation/modules/auth/auth.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ChallengesModule } from './presentation/modules/challenges/challenges.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get<string>('POSTGRES_HOST'),

        port: config.get<number>('POSTGRES_PORT'),

        username: config.get<string>('POSTGRES_USER'),

        password: config.get<string>('POSTGRES_PASSWORD'),

        database: config.get<string>('POSTGRES_DB'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST'),

          port: config.get<number>('REDIS_PORT'),
        },
      }),
    }),

    AuthModule,
    SubmissionsModule,
    ChallengesModule,
  ],
})
export class AppModule {}