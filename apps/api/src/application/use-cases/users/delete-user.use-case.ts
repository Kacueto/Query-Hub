import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  UserRepository,
  USER_REPOSITORY,
} from "../../../domain/repositories/user.repository";

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    await this.userRepository.delete(id);
  }
}
