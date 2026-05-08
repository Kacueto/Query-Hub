import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateSchemaDto {
  @ApiProperty({ example: "CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100));" })
  @IsString()
  schemaSQL: string;
}
