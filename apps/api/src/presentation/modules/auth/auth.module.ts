import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthController } from '../../http/controllers/auth.controller';
import { LoginUseCase } from '../../../application/use-cases/auth/login.use-case';
import { JwtStrategy } from '../../../infrastructure/auth/jwt.strategy';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [LoginUseCase, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}