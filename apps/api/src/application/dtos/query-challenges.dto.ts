import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { ChallengeStatus } from "../../domain/enums/challenge-status.enum";
import { ChallengeDifficulty } from "../../domain/enums/challenge-difficulty.enum";

export class QueryChallengesDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  courseId?: number;

  @IsOptional()
  @IsEnum(ChallengeStatus)
  status?: ChallengeStatus;

  @IsOptional()
  @IsEnum(ChallengeDifficulty)
  difficulty?: ChallengeDifficulty;

  @IsOptional()
  @IsString()
  databaseEngine?: string;
}
