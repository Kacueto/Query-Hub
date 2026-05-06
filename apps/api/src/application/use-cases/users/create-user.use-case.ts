import { Inject, Injectable, ConflictException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import {
  UserRepository,
  USER_REPOSITORY,
} from "../../../domain/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";
import { Role } from "../../../domain/enums/role.enum";
import { CreateUserDto } from "../../dtos/create-user.dto";

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException("El email ya está registrado");

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.userRepository.save(
      new User(
        null,
        dto.nombre,
        dto.email,
        passwordHash,
        dto.role as Role,
        new Date(),
        new Date(),
      ),
    );
  }
}
