import {
  IsString,
  IsEnum,
  IsArray,
  IsInt,
  IsOptional,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { ChallengeDifficulty } from "../../domain/enums/challenge-difficulty.enum";

export class UpdateChallengeDto {
  @ApiPropertyOptional({ example: "SELECT avanzado" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: "Nueva descripción" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ChallengeDifficulty })
  @IsOptional()
  @IsEnum(ChallengeDifficulty)
  difficulty?: ChallengeDifficulty;

  @ApiPropertyOptional({ example: ["sql"], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: "postgresql" })
  @IsOptional()
  @IsString()
  databaseEngine?: string;

  @ApiPropertyOptional({ example: 3000 })
  @IsOptional()
  @IsInt()
  @Min(1000)
  @Transform(({ value }) => parseInt(value, 10))
  timeLimitMs?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  courseId?: number;
}
