import { IsString, IsEmail, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../domain/enums/role.enum";

export class CreateUserDto {
  @ApiProperty({ example: "Ana García" })
  @IsString()
  nombre: string;

  @ApiProperty({ example: "ana@universidad.edu" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "secret123" })
  @IsString()
  password: string;

  @ApiProperty({ enum: Role, example: Role.STUDENT })
  @IsEnum(Role)
  role: Role;
}
