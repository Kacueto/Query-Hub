import {
  IsString,
  IsEnum,
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ArrayNotEmpty,
} from "class-validator";
import { Transform } from "class-transformer";
import { ChallengeDifficulty } from "../../domain/enums/challenge-difficulty.enum";

export class CreateChallengeDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(ChallengeDifficulty)
  difficulty: ChallengeDifficulty;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  databaseEngine: string;

  @IsInt()
  @Min(1000)
  @Transform(({ value }) => parseInt(value, 10))
  timeLimitMs: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  courseId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  createdBy: number;

  @IsOptional()
  @IsString()
  schemaSQL?: string;

  @IsOptional()
  @IsString()
  seedSQL?: string;
}
