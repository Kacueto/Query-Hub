import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  challengeId: number;

  @ApiProperty({ example: "SELECT * FROM estudiantes WHERE curso_id = 1;" })
  @IsString()
  sql: string;
}