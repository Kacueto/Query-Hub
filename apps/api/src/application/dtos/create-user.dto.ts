export class CreateUserDto {
  nombre: string;
  email: string;
  password: string;
  role: string;
}

// application/dtos/update-user.dto.ts
export class UpdateUserDto {
  nombre?: string;
  email?: string;
  role?: string;
}
