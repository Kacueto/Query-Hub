import { Inject, Injectable } from "@nestjs/common";
import {
  UserRepository,
  USER_REPOSITORY,
} from "../../../domain/repositories/user.repository";

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute() {
    return this.userRepository.findAll();
  }
}
