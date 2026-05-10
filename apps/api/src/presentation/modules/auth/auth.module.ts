import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "../../../infrastructure/auth/jwt.strategy";
import { NestJwtTokenGeneratorService } from "../../../infrastructure/auth/nest-jwt-token-generator.service";
import { TOKEN_GENERATOR } from "../../../application/ports/token-generator.port";
import { LoginUseCase } from "../../../application/use-cases/auth/login.use-case";
import { AuthController } from "../../http/controllers/auth.controller";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: config.get<string>("JWT_EXPIRES_IN") },
      }),
    }),
    UsersModule,
  ],
  providers: [
    JwtStrategy,
    LoginUseCase,
    { provide: TOKEN_GENERATOR, useClass: NestJwtTokenGeneratorService },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
