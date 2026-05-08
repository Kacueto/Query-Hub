import { IsString } from "class-validator";

export class UpdateSeedDto {
  @IsString()
  seedSQL: string;
}
