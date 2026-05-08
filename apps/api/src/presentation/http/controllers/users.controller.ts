import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { CreateUserUseCase } from "../../../application/use-cases/users/create-user.use-case";
import { GetAllUsersUseCase } from "../../../application/use-cases/users/get-all-users.use-case";
import { GetUserByIdUseCase } from "../../../application/use-cases/users/get-user-by-id.use-case";
import { DeleteUserUseCase } from "../../../application/use-cases/users/delete-user.use-case";
import { CreateUserDto } from "../../../application/dtos/create-user.dto";
import { JwtAuthGuard } from "../../../infrastructure/auth/jwt-auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../decorators/roles.decorator";
import { Role } from "../../../domain/enums/role.enum";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getAllUsers: GetAllUsersUseCase,
    private readonly getUserById: GetUserByIdUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.getAllUsers.execute();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.getUserById.execute(id);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.deleteUser.execute(id);
  }
}
