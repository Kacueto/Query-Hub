import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginUseCase } from "../../../application/use-cases/auth/login.use-case";
import { LoginDto } from "../../../application/dtos/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Iniciar sesión y obtener token JWT" })
  @ApiResponse({ status: 200, description: "Login exitoso, retorna accessToken" })
  @ApiResponse({ status: 401, description: "Credenciales inválidas" })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos" })
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
