import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenGenerator } from "../../application/ports/token-generator.port";

@Injectable()
export class NestJwtTokenGeneratorService implements TokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: { sub: number; email: string; role: string }): string {
    return this.jwtService.sign(payload);
  }
}
