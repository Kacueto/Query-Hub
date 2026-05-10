import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bull";

import { createTypeOrmConfig } from "./infrastructure/config/database.config";
import { AuthModule } from "./presentation/modules/auth/auth.module";
import { SubmissionsModule } from "./presentation/modules/submissions/submissions.module";
import { ChallengesModule } from "./presentation/modules/challenges/challenges.module";
import { CoursesModule } from "./presentation/modules/courses/courses.module";
import { UsersModule } from "./presentation/modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => createTypeOrmConfig(config),
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>("REDIS_HOST"),

          port: config.get<number>("REDIS_PORT"),
        },
      }),
    }),

    AuthModule,
    SubmissionsModule,
    ChallengesModule,
    CoursesModule,
    UsersModule,
  ],
})
export class AppModule {}
