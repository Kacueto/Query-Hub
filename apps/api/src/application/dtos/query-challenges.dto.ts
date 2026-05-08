import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { ChallengeStatus } from "../../domain/enums/challenge-status.enum";
import { ChallengeDifficulty } from "../../domain/enums/challenge-difficulty.enum";

export class QueryChallengesDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  courseId?: number;

  @ApiPropertyOptional({ enum: ChallengeStatus })
  @IsOptional()
  @IsEnum(ChallengeStatus)
  status?: ChallengeStatus;

  @ApiPropertyOptional({ enum: ChallengeDifficulty })
  @IsOptional()
  @IsEnum(ChallengeDifficulty)
  difficulty?: ChallengeDifficulty;

  @ApiPropertyOptional({ example: "postgresql" })
  @IsOptional()
  @IsString()
  databaseEngine?: string;
}
