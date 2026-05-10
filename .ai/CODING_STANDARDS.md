# Coding Standards — Query-Hub

## Naming

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Archivos | `kebab-case` | `create-user.use-case.ts` |
| Clases | `PascalCase` | `CreateUserUseCase` |
| Métodos/funciones | `camelCase` | `findById()`, `save()` |
| Variables | `camelCase` | `userRepository`, `accessToken` |
| Interfaces (dominio) | `PascalCase` sin prefijo I | `UserRepository`, `TokenGenerator` |
| DTOs | Sufijo `Dto` | `CreateUserDto`, `LoginDto` |
| TypeORM entities | Sufijo `TypeormEntity` | `UserTypeormEntity` |
| Repositorios (impl) | Prefijo `Postgres` | `PostgresUserRepository` |
| Enums | `PascalCase` | `Role`, `ChallengeStatus` |
| Archivos de test | Sufijo `.spec.ts` | `create-user.use-case.spec.ts` |

## Estructura de archivos

```
// Un archivo = una exportación principal
// Orden de imports:
// 1. Externos (nest, typeorm, etc.)
// 2. Internos del proyecto (src/...)
// 3. Relativos locales (./...)

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';

import { UserTypeormEntity } from './user.typeorm-entity';
```

## Manejo de errores

- Use-cases lanzan excepciones de `@nestjs/common`:
  - `NotFoundException` — entidad no encontrada
  - `ConflictException` — conflicto (email duplicado, etc.)
  - `BadRequestException` — validación de negocio
  - `UnauthorizedException` — credenciales inválidas
- NO usar `try/catch` genéricos — cada error tiene su tipo
- Casos de uso retornan DTOs, nunca entidades de dominio directamente

## TypeORM

- Entidades de infraestructura con sufijo `TypeormEntity` en `infrastructure/persistence/entities/`
- Repositorios con prefijo `Postgres` en `infrastructure/persistence/repositories/`
- Repositorios implementan la interfaz definida en `domain/repositories/`
- Named exports en TypeORM entities, default exports no

## DTOs

- Los DTOs de entrada usan `@IsString()`, `@IsOptional()`, `@IsEnum()` de `class-validator`
- Usar `@ApiProperty()` para documentación Swagger
- Separar DTOs de entrada (request) de DTOs de salida (response) cuando tengan diferente forma

## Guards y decoradores

- `@Roles(Role.PROFESSOR)` arriba del método del controlador
- Los guards se aplican globalmente o por controlador, no en cada ruta individual
- `JwtAuthGuard` primero, `RolesGuard` después (si aplica)

## Módulos NestJS

- Cada módulo en `presentation/modules/<nombre>/` (ej: `presentation/modules/auth/auth.module.ts`)
- Los controladores HTTP viven en `presentation/http/controllers/` (ej: `presentation/http/controllers/auth.controller.ts`)
- Un módulo nuevo requiere crear ambos: el módulo en `modules/` y el controlador en `http/controllers/`
- Los módulos importan casos de uso y proveen repositorios
- NO importan módulos de infraestructura directamente — usan los providers
- Los módulos son el único lugar donde se configura la inyección de dependencias

## Casos de uso

- Cada caso de uso en `application/use-cases/<modulo>/` (ej: `application/use-cases/auth/login.use-case.ts`)
- Dependen de interfaces (puertos), no de implementaciones concretas
- Reciben DTOs de entrada, retornan DTOs de salida
- Lanzan excepciones de `@nestjs/common` (`NotFoundException`, `ConflictException`, etc.)
