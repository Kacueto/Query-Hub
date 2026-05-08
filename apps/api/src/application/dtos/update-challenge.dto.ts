import {
  IsString,
  IsEnum,
  IsArray,
  IsInt,
  IsOptional,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";
import { ChallengeDifficulty } from "../../domain/enums/challenge-difficulty.enum";

export class UpdateChallengeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ChallengeDifficulty)
  difficulty?: ChallengeDifficulty;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  databaseEngine?: string;

  @IsOptional()
  @IsInt()
  @Min(1000)
  @Transform(({ value }) => parseInt(value, 10))
  timeLimitMs?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  courseId?: number;
}
