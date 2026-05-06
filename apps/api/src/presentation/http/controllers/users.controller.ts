import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from "@nestjs/common";
import { CreateUserUseCase } from "../../../application/use-cases/users/create-user.use-case";
import { GetAllUsersUseCase } from "../../../application/use-cases/users/get-all-users.use-case";
import { GetUserByIdUseCase } from "../../../application/use-cases/users/get-user-by-id.use-case";
import { DeleteUserUseCase } from "../../../application/use-cases/users/delete-user.use-case";
import { CreateUserDto } from "../../../application/dtos/create-user.dto";

@Controller("users")
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getAllUsers: GetAllUsersUseCase,
    private readonly getUserById: GetUserByIdUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }

  @Get()
  findAll() {
    return this.getAllUsers.execute();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.getUserById.execute(id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.deleteUser.execute(id);
  }
}
