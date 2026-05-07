import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { ChallengeStatus } from "../../domain/enums/challenge-status.enum";

export class QueryChallengesDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  courseId?: number;

  @IsOptional()
  @IsEnum(ChallengeStatus)
  status?: ChallengeStatus;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  databaseEngine?: string;
}
