import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginUseCase } from "../../../application/use-cases/auth/login.use-case";
import { LoginDto } from "../../../application/dtos/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly login: LoginUseCase) {}

  @Post("login")
  @ApiOperation({ summary: "Iniciar sesión y obtener token JWT" })
  @ApiResponse({ status: 201, description: "Login exitoso, retorna accessToken" })
  @ApiResponse({ status: 401, description: "Credenciales inválidas" })
  signIn(@Body() dto: LoginDto) {
    return this.login.execute(dto);
  }
}
