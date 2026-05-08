import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateSeedDto {
  @ApiProperty({ example: "INSERT INTO users VALUES (1, 'Ana'), (2, 'Luis');" })
  @IsString()
  seedSQL: string;
}
