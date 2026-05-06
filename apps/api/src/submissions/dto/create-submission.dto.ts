import { IsNumber, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  challengeId: number;

  @IsString()
  sql: string;
}