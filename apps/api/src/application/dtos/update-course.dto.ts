import { IsString, IsInt, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: "Bases de Datos II" })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ example: "NRC-67890" })
  @IsOptional()
  @IsString()
  codigoNrc?: string;

  @ApiPropertyOptional({ example: "2024-2" })
  @IsOptional()
  @IsString()
  periodoAcademico?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  profesorResponsableId?: number;
}
