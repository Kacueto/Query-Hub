import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserTypeormEntity } from "../../../infrastructure/persistence/entities/user.typeorm-entity";
import { USER_REPOSITORY } from "../../../domain/repositories/user.repository";
import { PostgresUserRepository } from "../../../infrastructure/persistence/repositories/postgres-user.repository";
import { CreateUserUseCase } from "../../../application/use-cases/users/create-user.use-case";
import { GetAllUsersUseCase } from "../../../application/use-cases/users/get-all-users.use-case";
import { GetUserByIdUseCase } from "../../../application/use-cases/users/get-user-by-id.use-case";
import { DeleteUserUseCase } from "../../../application/use-cases/users/delete-user.use-case";
import { UsersController } from "../../http/controllers/users.controller";
import { RolesGuard } from "../../guards/roles.guard";

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeormEntity])],
  providers: [
    { provide: USER_REPOSITORY, useClass: PostgresUserRepository },
    RolesGuard,
    CreateUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    DeleteUserUseCase,
  ],
  controllers: [UsersController],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
