import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({ example: 1, description: "ID del usuario (estudiante) que envía" })
  @IsNumber()
  studentId: number;

  @ApiProperty({ example: 1, description: "ID del reto SQL" })
  @IsNumber()
  challengeId: number;

  @ApiProperty({ example: "SELECT * FROM estudiantes WHERE curso_id = 1;", description: "Código SQL a evaluar" })
  @IsString()
  code: string;
}