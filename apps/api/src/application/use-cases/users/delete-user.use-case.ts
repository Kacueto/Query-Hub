import { Inject, Injectable, NotFoundException, ConflictException } from "@nestjs/common";
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
    try {
      await this.userRepository.delete(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("foreign key constraint")) {
        throw new ConflictException(
          `No se puede eliminar el usuario ${id}: tiene cursos u otros recursos asociados`,
        );
      }
      throw error;
    }
  }
}
