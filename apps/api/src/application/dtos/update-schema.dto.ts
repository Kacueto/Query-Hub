import { IsString } from "class-validator";

export class UpdateSchemaDto {
  @IsString()
  schemaSQL: string;
}
