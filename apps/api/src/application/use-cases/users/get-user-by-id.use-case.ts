import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  UserRepository,
  USER_REPOSITORY,
} from "../../../domain/repositories/user.repository";

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return user;
  }
}
