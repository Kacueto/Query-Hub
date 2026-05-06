import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";
import { UserTypeormEntity } from "../entities/user.typeorm-entity";
import { Role } from "../../../domain/enums/role.enum";

@Injectable()
export class PostgresUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserTypeormEntity)
    private readonly repo: Repository<UserTypeormEntity>,
  ) {}

  private toDomain(entity: UserTypeormEntity): User {
    return new User(
      entity.id,
      entity.nombre,
      entity.email,
      entity.passwordHash,
      entity.role as Role,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  async findById(id: number): Promise<User | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.repo.findOne({ where: { email } });
    return found ? this.toDomain(found) : null;
  }

  async findAll(): Promise<User[]> {
    const all = await this.repo.find();
    return all.map(this.toDomain.bind(this));
  }

  async save(user: User): Promise<User> {
    const saved = await this.repo.save({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
    });
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
