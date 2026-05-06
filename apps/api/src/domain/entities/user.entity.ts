import { Role } from "../enums/role.enum";

export class User {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: Role,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isProfessor(): boolean {
    return this.role === Role.PROFESSOR;
  }
  isStudent(): boolean {
    return this.role === Role.STUDENT;
  }
  isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }
}
