import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function createTypeOrmConfig(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: "postgres",
    host: config.get<string>("POSTGRES_HOST"),
    port: config.get<number>("POSTGRES_PORT"),
    username: config.get<string>("POSTGRES_USER"),
    password: config.get<string>("POSTGRES_PASSWORD"),
    database: config.get<string>("POSTGRES_DB"),
    entities: [__dirname + "/../../**/*.typeorm-entity{.ts,.js}"],
    synchronize: true,
  };
}
