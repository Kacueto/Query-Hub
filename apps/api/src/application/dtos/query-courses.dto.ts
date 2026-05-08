import { IsInt, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class QueryCoursesDto {
  @ApiPropertyOptional({ example: 5, description: "Filtra los cursos en los que está inscrito el estudiante" })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  studentId?: number;
}
