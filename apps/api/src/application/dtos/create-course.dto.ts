import { IsString, IsInt } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCourseDto {
  @ApiProperty({ example: "Bases de Datos I" })
  @IsString()
  nombre: string;

  @ApiProperty({ example: "NRC-12345" })
  @IsString()
  codigoNrc: string;

  @ApiProperty({ example: "2024-1" })
  @IsString()
  periodoAcademico: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  profesorResponsableId: number;
}
