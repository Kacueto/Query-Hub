import { User } from "../entities/user.entity";
export const USER_REPOSITORY = Symbol("UserRepository");
export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<User>;
}
