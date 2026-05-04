import { plainToInstance } from "class-transformer";
import { IsEnum, IsInt, IsString, validateSync } from "class-validator";

enum Environment {
  Development = "development",
  Production = "production",
  Test = "test",
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString() POSTGRES_HOST: string;
  @IsInt() POSTGRES_PORT: number;
  @IsString() POSTGRES_USER: string;
  @IsString() POSTGRES_PASSWORD: string;
  @IsString() POSTGRES_DB: string;

  @IsString() JWT_SECRET: string;
  @IsString() JWT_EXPIRES_IN: string;

  @IsString() REDIS_HOST: string;
  @IsInt() REDIS_PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated);
  if (errors.length > 0) throw new Error(errors.toString());
  return validated;
}
