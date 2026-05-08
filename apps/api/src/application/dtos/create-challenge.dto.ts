import {
  IsString,
  IsEnum,
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ArrayNotEmpty,
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ChallengeDifficulty } from "../../domain/enums/challenge-difficulty.enum";

export class CreateChallengeDto {
  @ApiProperty({ example: "SELECT con JOIN" })
  @IsString()
  title: string;

  @ApiProperty({ example: "Obtén los nombres de todos los estudiantes inscritos en un curso" })
  @IsString()
  description: string;

  @ApiProperty({ enum: ChallengeDifficulty, example: ChallengeDifficulty.EASY })
  @IsEnum(ChallengeDifficulty)
  difficulty: ChallengeDifficulty;

  @ApiProperty({ example: ["sql", "join"], type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: "postgresql" })
  @IsString()
  databaseEngine: string;

  @ApiProperty({ example: 5000, description: "Tiempo límite en milisegundos (mínimo 1000)" })
  @IsInt()
  @Min(1000)
  @Transform(({ value }) => parseInt(value, 10))
  timeLimitMs: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  courseId: number;

  @ApiProperty({ example: 1, description: "ID del profesor que crea el reto" })
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  createdBy: number;

  @ApiPropertyOptional({ example: "CREATE TABLE estudiantes (id INT PRIMARY KEY, nombre VARCHAR);" })
  @IsOptional()
  @IsString()
  schemaSQL?: string;

  @ApiPropertyOptional({ example: "INSERT INTO estudiantes VALUES (1, 'Ana');" })
  @IsOptional()
  @IsString()
  seedSQL?: string;
}
