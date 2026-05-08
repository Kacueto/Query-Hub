# Prompt para GitHub Copilot — Entrega Parcial 1: Módulos Faltantes

## Estado actual del proyecto

Este repositorio es el backend de **Query-Hub**, una plataforma de evaluación de SQL académico.
El backend usa **NestJS** con **Clean Architecture** (capas: `domain`, `application`, `infrastructure`, `presentation`),
**TypeORM** + **PostgreSQL** y **Redis/BullMQ** para colas asíncronas.
El monorepo tiene `apps/api` y `apps/worker`.

### ✅ Lo que ya existe en `main`

- Entidades de dominio completas: `User`, `Course`, `Enrollment`, `Challenge`, `Schema`, `Submission`, `Evaluation`, `Assessment`, `AiRecommendation`, `RandomDataGeneration`
- Repositorios de dominio (interfaces): `user.repository.ts`, `challenge.repository.ts`, `course.repository.ts`, `submission.repository.ts`, `assessment.repository.ts`
- CRUD de usuarios completo: casos de uso, `PostgresUserRepository`, `UsersController`, `UsersModule`
- CRUD de retos SQL: 8 casos de uso, `PostgresChallengeRepository`, `ChallengesController`, `ChallengesModule` (en PR #4, listo para merge)
- `RolesGuard` (stub) y decorador `@Roles()` en `presentation/guards` y `presentation/decorators`
- Worker SQL stub con BullMQ en `apps/worker`
- Docker Compose con API, PostgreSQL y Redis en `infra/`
- Documentación de arquitectura C4 en `1-documentation/`

---

## ❌ Lo que falta para la Entrega Parcial 1

Hay **3 módulos sin implementar**. Copilot debe crearlos todos siguiendo exactamente el mismo patrón de Clean Architecture que ya existe en el proyecto.

---

## TAREA 1 — Autenticación con JWT (responsable: Darlen)

> **Contexto**: `User` ya existe como entidad de dominio en `apps/api/src/domain/entities/user.entity.ts`.
> `UserTypeormEntity` ya existe en `apps/api/src/infrastructure/persistence/entities/user.typeorm-entity.ts`.
> `UsersModule` ya exporta `USER_REPOSITORY`. Solo hay que construir el módulo de auth encima de lo que hay.

Instalar dependencias necesarias si no están:
```
@nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs
@types/passport-jwt @types/bcryptjs
```

Crear los siguientes archivos:

### `apps/api/src/application/dtos/login.dto.ts`
```ts
import { IsEmail, IsString } from 'class-validator';
export class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}
```

### `apps/api/src/application/use-cases/auth/login.use-case.ts`
- Recibe `LoginDto`
- Inyecta `USER_REPOSITORY` (símbolo ya definido en `user.repository.ts`)
- Busca el usuario por email
- Compara password con bcrypt (`bcryptjs`)
- Si válido, retorna `{ accessToken: string }` firmado con `JwtService` de `@nestjs/jwt`
- El payload del JWT debe incluir `{ sub: user.id, email: user.email, role: user.role }`
- Si inválido, lanza `UnauthorizedException`

### `apps/api/src/infrastructure/auth/jwt.strategy.ts`
- Extiende `PassportStrategy(Strategy)` de `passport-jwt`
- Extrae el token del header `Authorization: Bearer <token>`
- Usa `process.env.JWT_SECRET` como secret
- El método `validate(payload)` retorna `{ userId: payload.sub, email: payload.email, role: payload.role }`

### `apps/api/src/infrastructure/auth/jwt-auth.guard.ts`
- Extiende `AuthGuard('jwt')` de `@nestjs/passport`
- No necesita lógica extra, solo la clase `@Injectable() export class JwtAuthGuard extends AuthGuard('jwt') {}`

### `apps/api/src/presentation/http/controllers/auth.controller.ts`
- `@Controller('auth')`
- Un endpoint: `POST /login` que llama a `LoginUseCase.execute(dto)` y retorna el token
- No requiere guard (es el endpoint público de login)

### `apps/api/src/presentation/modules/auth/auth.module.ts`
- Importa `UsersModule` (para tener acceso al `USER_REPOSITORY`)
- Importa `PassportModule`
- Importa `JwtModule.register({ secret: process.env.JWT_SECRET || 'secret', signOptions: { expiresIn: '24h' } })`
- Providers: `LoginUseCase`, `JwtStrategy`
- Controllers: `AuthController`
- Exports: `JwtModule`, `JwtAuthGuard`

### Actualizar `apps/api/src/app.module.ts`
- Importar y registrar `AuthModule`

### Actualizar `apps/api/src/presentation/guards/roles.guard.ts`
- El guard actualmente es un stub que siempre retorna `true`
- Actualizarlo para que cuando `requiredRoles` no esté vacío, lea `request.user?.role` y verifique si el rol del usuario está en los roles requeridos
- Si no hay `request.user` y hay roles requeridos, lanzar `ForbiddenException`
- El guard ya importa `Role` del enum existente — usarlo correctamente

---

## TAREA 2 — CRUD de Cursos (responsable: Kevin C)

> **Contexto**: `Course` ya existe como entidad de dominio en `apps/api/src/domain/entities/course.entity.ts`.
> `course.repository.ts` ya existe en `apps/api/src/domain/repositories/course.repository.ts` con la interfaz base.
> `CourseTypeormEntity` ya existe en `apps/api/src/infrastructure/persistence/entities/course.typeorm-entity.ts`.
> Solo hay que implementar el repositorio, los casos de uso, el controlador y el módulo.

Crear los siguientes archivos:

### `apps/api/src/application/dtos/create-course.dto.ts`
- Campos: `title: string`, `description: string`, `createdBy: number`
- Todos con decoradores `class-validator` apropiados

### `apps/api/src/application/dtos/update-course.dto.ts`
- Mismos campos que `CreateCourseDto` pero todos `@IsOptional()`

### `apps/api/src/application/use-cases/courses/create-course.use-case.ts`
- Inyecta `COURSE_REPOSITORY`
- Crea instancia de `Course` con `status: 'active'` y `createdAt/updatedAt` = `new Date()`
- Llama `courseRepository.save(course)` y retorna el resultado

### `apps/api/src/application/use-cases/courses/get-all-courses.use-case.ts`
- Llama `courseRepository.findAll()` y retorna el array

### `apps/api/src/application/use-cases/courses/get-course-by-id.use-case.ts`
- Llama `courseRepository.findById(id)`
- Si no existe, lanza `NotFoundException('Course not found')`

### `apps/api/src/application/use-cases/courses/update-course.use-case.ts`
- Busca el curso por id, lanza `NotFoundException` si no existe
- Construye nuevo `Course` con los campos del DTO o los existentes (merge parcial)
- Llama `courseRepository.update(course)` y retorna el resultado

### `apps/api/src/application/use-cases/courses/delete-course.use-case.ts`
- Busca el curso por id, lanza `NotFoundException` si no existe
- Llama `courseRepository.delete(id)`

### `apps/api/src/infrastructure/persistence/repositories/postgres-course.repository.ts`
- Implementa la interfaz `CourseRepository` usando `CourseTypeormEntity`
- Incluir método privado `toDomain(entity): Course` que mapea la entidad TypeORM a la entidad de dominio
- Métodos: `findById`, `findAll`, `save`, `update`, `delete`
- En `update`: usar `repo.merge()` + `repo.save()` para que `@UpdateDateColumn` se actualice automáticamente
- En `delete`: usar `repo.delete(id)`

### `apps/api/src/presentation/http/controllers/courses.controller.ts`
- `@Controller('courses')`
- 5 endpoints:
  - `POST /` — crea curso, requiere `@Roles(Role.PROFESSOR)` + `@UseGuards(RolesGuard)`
  - `GET /` — lista todos, público
  - `GET /:id` — obtiene por id con `ParseIntPipe`, público
  - `PATCH /:id` — actualiza parcial, requiere `@Roles(Role.PROFESSOR)` + `@UseGuards(RolesGuard)`
  - `DELETE /:id` — elimina, requiere `@Roles(Role.PROFESSOR)` + `@UseGuards(RolesGuard)`

### `apps/api/src/presentation/modules/courses/courses.module.ts`
- Importa `TypeOrmModule.forFeature([CourseTypeormEntity, UserTypeormEntity])`
- Providers: `{ provide: COURSE_REPOSITORY, useClass: PostgresCourseRepository }`, los 5 casos de uso, `RolesGuard`
- Controllers: `CoursesController`
- Exports: `COURSE_REPOSITORY`

### Actualizar `apps/api/src/app.module.ts`
- Importar y registrar `CoursesModule`

---

## TAREA 3 — Documentación inicial de la API (responsable: Kevin C)

Crear los siguientes archivos en `1-documentation/api/`:

### `1-documentation/api/01-auth.md`
Documentar el endpoint de autenticación:
- `POST /api/auth/login` — body, respuesta 200 con token JWT, respuesta 401

### `1-documentation/api/02-users.md`
Documentar los endpoints de usuarios ya existentes en `UsersController`:
- `POST /api/users`
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

### `1-documentation/api/03-courses.md`
Documentar los endpoints de cursos creados en la Tarea 2:
- `POST /api/courses` (requiere PROFESSOR)
- `GET /api/courses`
- `GET /api/courses/:id`
- `PATCH /api/courses/:id` (requiere PROFESSOR)
- `DELETE /api/courses/:id` (requiere PROFESSOR)

### `1-documentation/api/04-challenges.md`
Documentar los 8 endpoints del `ChallengesController` ya existente:
- `POST /api/challenges` (requiere PROFESSOR)
- `GET /api/challenges`
- `GET /api/challenges/:id`
- `PATCH /api/challenges/:id` (requiere PROFESSOR)
- `DELETE /api/challenges/:id` (requiere PROFESSOR)
- `PATCH /api/challenges/:id/publish` (requiere PROFESSOR)
- `POST /api/challenges/:id/schema` (requiere PROFESSOR)
- `POST /api/challenges/:id/seed` (requiere PROFESSOR)

**Formato de cada endpoint en todos los archivos:**
```
### METHOD /ruta
**Descripción:** ...
**Auth:** Bearer JWT requerido / Público
**Request Body:**
\`\`\`json
{ ... }
\`\`\`
**Responses:**
- `200/201` — descripción y ejemplo de respuesta
- `400` — validación fallida
- `401` — no autenticado (si aplica)
- `403` — rol insuficiente (si aplica)
- `404` — recurso no encontrado (si aplica)
```

### `1-documentation/api/README.md`
Índice con los 4 archivos anteriores, una línea de descripción por cada uno y la tabla de endpoints por módulo.

---

## Restricciones importantes

1. **No modificar** entidades TypeORM ni de dominio ya existentes a menos que falte un campo indispensable y esté justificado
2. **No tocar** `docker-compose.yml`, archivos de `infra/`, ni configuración de BullMQ/worker
3. Usar **`Logger` de `@nestjs/common`** en lugar de `console.log` o `console.warn`
4. Los guards siempre deben estar en el array `providers` del módulo que los usa
5. En los repositorios TypeORM, siempre usar `merge() + save()` para updates (no `repo.update()`) para que `@UpdateDateColumn` funcione correctamente
6. El símbolo del repositorio (`COURSE_REPOSITORY`, `USER_REPOSITORY`) siempre debe ser un `Symbol()` exportado desde el archivo del repositorio de dominio
7. Seguir la convención de nombres ya establecida en el proyecto: `kebab-case` para archivos, `PascalCase` para clases
