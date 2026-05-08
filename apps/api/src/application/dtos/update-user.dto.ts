import { IsString, IsEmail, IsEnum, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "../../domain/enums/role.enum";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "Ana García López" })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ example: "anagarcia@universidad.edu" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.PROFESSOR })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
