import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { CreateUserUseCase } from "../../../application/use-cases/users/create-user.use-case";
import { GetAllUsersUseCase } from "../../../application/use-cases/users/get-all-users.use-case";
import { GetUserByIdUseCase } from "../../../application/use-cases/users/get-user-by-id.use-case";
import { DeleteUserUseCase } from "../../../application/use-cases/users/delete-user.use-case";
import { CreateUserDto } from "../../../application/dtos/create-user.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getAllUsers: GetAllUsersUseCase,
    private readonly getUserById: GetUserByIdUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Registrar un nuevo usuario" })
  @ApiResponse({ status: 201, description: "Usuario creado exitosamente" })
  create(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos los usuarios" })
  @ApiResponse({ status: 200, description: "Lista de usuarios" })
  findAll() {
    return this.getAllUsers.execute();
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un usuario por ID" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Usuario encontrado" })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.getUserById.execute(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar un usuario" })
  @ApiParam({ name: "id", type: Number })
  @ApiResponse({ status: 200, description: "Usuario eliminado" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.deleteUser.execute(id);
  }
}
