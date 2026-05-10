import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { USER_REPOSITORY, UserRepository } from "../../../domain/repositories/user.repository";
import { TOKEN_GENERATOR, TokenGenerator } from "../../ports/token-generator.port";
import { LoginDto } from "../../dtos/login.dto";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException("Credenciales inválidas");

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException("Credenciales inválidas");

    return {
      accessToken: this.tokenGenerator.generateToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }
}
