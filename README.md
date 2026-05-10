# Query-Hub

**Query-Hub** es una plataforma backend para evaluar automáticamente consultas SQL de estudiantes. Los profesores crean retos, los estudiantes envían soluciones SQL y el sistema las evalúa en tiempo real, generando retroalimentación y recomendaciones de optimización.

---

## Estado actual

- **Arquitectura**: Clean Architecture con dominio, aplicación, infraestructura y presentación + puertos/adaptadores.
- **Modelo de dominio**: entidades base (User, Course, Challenge, Submission, Schema, etc.) con repositorios.
- **Autenticación JWT**: endpoint de login funcional con `LoginUseCase` y `TokenGenerator` (desacoplado de NestJS).
- **Gestión de usuarios**: CRUD básico de usuarios, roles (ADMIN, PROFESSOR, STUDENT).
- **Roles y guards**: decorador `@Roles()` y guard para verificar permisos en rutas protegidas.
- **CRUD de cursos**: módulo, controlador, casos de uso y endpoints para administrar cursos.
- **CRUD de retos SQL**: módulo, controlador y casos de uso para crear, leer, actualizar, publicar y eliminar retos.
- **Carga de esquemas y datos**: endpoints para subir DDL de esquemas (`/schema`) y scripts de datos semilla (`/seed`) a los retos.
- **Envío de soluciones SQL**: endpoint `POST /api/submissions` protegido con JWT + roles STUDENT/PROFESSOR. `CreateSubmissionUseCase` persiste y encola evaluación asíncrona.
- **Seed de datos**: script `npm run seed` que crea datos iniciales (admin, profesor, estudiantes, cursos, retos).
- **Documentación inicial de la API**: Swagger habilitado en `http://localhost:3000/api/docs`.
- **Docker Compose**: API, PostgreSQL y Redis funcionando en contenedores.
- **Worker SQL**: modo stub, recibe trabajos desde la cola Redis (simula 2s de ejecución).
- **Documentación de arquitectura**: diseño C4 de componentes y contenedores.

---

## Estructura de Carpetas

```
Query-Hub/
├── apps/
│   ├── api/                    # API NestJS (puerta de entrada)
│   │   ├── src/
│   │   │   ├── domain/         # Entidades, enums, repositorios (reglas de negocio)
│   │   │   ├── application/    # Casos de uso, DTOs, puertos (orquestación)
│   │   │   ├── infrastructure/ # TypeORM, JWT, Redis, base de datos (detalles técnicos)
│   │   │   ├── presentation/   # Controllers, guards, módulos NestJS (HTTP)
│   │   │   ├── seed/           # Script de seed de datos iniciales
│   │   │   ├── app.module.ts   # Módulo raíz
│   │   │   └── main.ts         # Punto de entrada
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── worker/                 # Worker en segundo plano (procesa trabajos SQL)
│       ├── src/
│       │   ├── worker.module.ts
│       │   ├── evaluation.processor.ts  # Procesa trabajos desde Redis (stub)
│       │   └── main.ts
│       ├── Dockerfile
│       └── package.json
│
├── infra/
│   ├── docker-compose.yml      # Configuración de contenedores (postgres, redis, api, worker)
│   ├── .env.example            # Variables de entorno
│   └── .env                    # Variables de entorno activas (gitignored)
│
├── 1-documentation/
│   ├── README.md               # Guía de arquitectura
│   ├── architecture/           # Diagramas y descripción de arquitectura
│   └── api/                    # 📝 PENDIENTE: documentación de endpoints
│
└── README.md                   # Este archivo
```

---

## Qué hace cada carpeta dentro de `apps/api/src/`

| Carpeta | Qué hace |
|---------|----------|
| `domain/entities/` | Define qué es un usuario, curso, reto, etc. (sin depender de tecnología) |
| `domain/repositories/` | Contrato que dice "necesito guardar/recuperar datos" (interface) |
| `domain/enums/` | Tipos permitidos: `Role` (ADMIN, PROFESSOR, STUDENT), `ChallengeStatus` (DRAFT, PUBLISHED) |
| `application/use-cases/` | Lógica: "crear usuario", "hacer login", "listar cursos", "gestionar retos" |
| `application/dtos/` | Formato de datos que entra y sale de la API |
| `infrastructure/persistence/` | Implementación real: cómo guardar en PostgreSQL (TypeORM) |
| `application/ports/` | Interfaces que la capa de aplicación define y la infraestructura implementa (TokenGenerator, SubmissionQueue) |
| `infrastructure/auth/` | JWT: estrategia, token, generación |
| `presentation/http/controllers/` | Endpoints REST: POST, GET, DELETE |
| `presentation/guards/` | Verificadores: ¿token válido? ¿rol permitido? |
| `presentation/modules/` | Agrupación NestJS: `AuthModule`, `UsersModule`, `CoursesModule`, `ChallengesModule`, `SubmissionsModule` |

---

## Documentación completa de archivos

### 📂 `apps/api/src/` — El corazón de la API

#### **Domain** — Reglas de negocio (sin tecnología)

**`domain/entities/`** — Qué es cada cosa en el sistema:
- `user.entity.ts` — Representa un usuario (nombre, email, contraseña hash, rol)
- `course.entity.ts` — Representa un curso (nombre, código, profesor responsable)
- `challenge.entity.ts` — Representa un reto SQL (título, descripción, estado, curso)
- `submission.entity.ts` — Representa el envío de un estudiante (código SQL, usuario, reto)
- `schema.entity.ts` — Representa el esquema de base de datos para un reto (DDL SQL)
- `evaluation.entity.ts` — Representa una evaluación/parcial (nombre, curso, fecha)
- `enrollment.entity.ts` — Relación entre estudiante y curso (inscripción)
- `assessment.entity.ts` — Resultado de evaluación (calificación, retroalimentación)
- `ai-recommendation.entity.ts` — Recomendación generada por IA (para optimizar queries)
- `random-data-generation.entity.ts` — Configuración para generar datos de prueba
- `evaluation-challenge.entity.ts` — Relación entre evaluación y retos incluidos
- `test.entity.ts` — Caso de prueba dentro de un reto

**`domain/enums/`** — Tipos permitidos:
- `role.enum.ts` — Roles: `ADMIN`, `PROFESSOR`, `STUDENT`
- `challenge-status.enum.ts` — Estados de un reto: `DRAFT`, `PUBLISHED`, `ARCHIVED`
- `submission-status.enum.ts` — Estados de un envío: `PENDING`, `EVALUATING`, `COMPLETED`, `FAILED`

**`domain/repositories/`** — Contratos para guardar/recuperar datos:
- `user.repository.ts` — Interface: `findById()`, `findByEmail()`, `findAll()`, `save()`, `delete()`
- `course.repository.ts` — Interface: `findById()`, `findByProfessor()`, `save()`, `update()`, `delete()`
- `challenge.repository.ts` — Interface: `findById()`, `findByCourse()`, `save()`, `update()`, `delete()`
- `submission.repository.ts` — Interface: `findByChallenge()`, `findByStudent()`, `save()`
- `assessment.repository.ts` — Interface: `findBySubmission()`, `save()`

---

#### **Application** — Lógica de negocio

**`application/dtos/`** — Formato de datos entrada/salida:
- `create-user.dto.ts` — Body para crear usuario: `nombre`, `email`, `password`, `role`
- `login.dto.ts` — Body para login: `email`, `password`

**`application/use-cases/auth/`** — Casos de uso de autenticación:
- `login.use-case.ts` — Busca usuario por email, valida contraseña con bcrypt, devuelve JWT

**`application/use-cases/users/`** — Casos de uso de usuarios:
- `create-user.use-case.ts` — Crea usuario nuevo, hashea contraseña, guarda en DB
- `get-user-by-id.use-case.ts` — Busca usuario por ID, lanza `NotFoundException` si no existe
- `get-all-users.use-case.ts` — Lista todos los usuarios
- `delete-user.use-case.ts` — Busca usuario y lo elimina de la DB

**`application/use-cases/courses/`** — Casos de uso de cursos:
- `create-course.use-case.ts` — Crea un curso nuevo
- `get-course-by-id.use-case.ts` — Busca un curso por ID
- `get-all-courses.use-case.ts` — Lista todos los cursos
- `update-course.use-case.ts` — Actualiza un curso existente
- `delete-course.use-case.ts` — Elimina un curso

**`application/use-cases/challenges/`** — Casos de uso de retos:
- `create-challenge.use-case.ts` — Crea un reto SQL asociado a un curso
- `get-challenge-by-id.use-case.ts` — Busca un reto por ID
- `get-all-challenges.use-case.ts` — Lista retos con filtros
- `update-challenge.use-case.ts` — Actualiza un reto existente
- `publish-challenge.use-case.ts` — Publica un reto para hacerlo visible a estudiantes
- `delete-challenge.use-case.ts` — Elimina un reto
- `update-challenge-schema.use-case.ts` — Actualiza el esquema SQL del reto
- `update-challenge-seed.use-case.ts` — Actualiza los datos semilla del reto

---

#### **Infrastructure** — Detalles técnicos (base de datos, JWT, etc.)

**`infrastructure/persistence/entities/`** — Entidades TypeORM para PostgreSQL:
- `user.typeorm-entity.ts` — Mapeo de usuario en tabla `users`
- `course.typeorm-entity.ts` — Mapeo de curso en tabla `courses`
- `challenge.typeorm-entity.ts` — Mapeo de reto en tabla `challenges`
- `submission.typeorm-entity.ts` — Mapeo de envío en tabla `submissions`
- `schema.typeorm-entity.ts` — Mapeo de esquema en tabla `schemas`
- Y otros... (evaluation, enrollment, assessment, etc.)

**`infrastructure/persistence/repositories/`** — Implementación real con TypeORM:
- `postgres-user.repository.ts`, `postgres-course.repository.ts`, `postgres-challenge.repository.ts`, `postgres-submission.repository.ts`, `postgres-assessment.repository.ts` — Implementaciones concretas de cada repositorio de dominio con TypeORM y PostgreSQL

**`infrastructure/auth/`** — Autenticación con JWT:
- `jwt.strategy.ts` — Estrategia Passport para validar JWT en header `Authorization: Bearer <token>`
- (El guard `jwt-auth.guard` se movió a `presentation/guards/` — ver abajo)

**`infrastructure/security/`** — Utilidades de seguridad (puede estar vacío, preparado para después)

---

#### **Presentation** — Exposición HTTP (controladores, guards, módulos)

**`presentation/http/controllers/`** — Endpoints REST:
- `auth.controller.ts` — Endpoint `POST /auth/login` para obtener token
- `users.controller.ts` — Endpoints: `POST /users`, `GET /users`, `GET /users/:id`, `DELETE /users/:id`
- `courses.controller.ts` — Endpoints CRUD para cursos
- `challenges.controller.ts` — Endpoints CRUD y acciones de publicación para retos
- `submissions.controller.ts` — Endpoint `POST /submissions` para enviar soluciones SQL y encolar evaluación

**`presentation/http/dto/`** — DTOs específicas de HTTP (si hay conversiones especiales)

**`presentation/decorators/`** — Decoradores personalizados:
- `roles.decorator.ts` — `@Roles(Role.PROFESSOR)` marca qué roles pueden acceder a una ruta

**`presentation/guards/`** — Guardias de acceso:
- `roles.guard.ts` — Verifica si el usuario tiene el rol requerido; lanza `ForbiddenException` si no

**`presentation/modules/`** — Módulos NestJS (agrupan funcionalidad):
- `auth/auth.module.ts` — Agrupa login, JWT strategy, JWT guard
- `courses/courses.module.ts` — Agrupa cursos, casos de uso y repositorio
- `challenges/challenges.module.ts` — Agrupa retos, casos de uso y repositorio
- `users/users.module.ts` — Agrupa usuarios, casos de uso, repositorio
- `submissions/submissions.module.ts` — Agrupa el flujo de envíos y evaluación

**`app.module.ts`** — Módulo raíz que importa: `AuthModule`, `UsersModule`, `SubmissionsModule`, etc.

**`main.ts`** — Punto de entrada: crea la app, habilita validación global, CORS, prefijo `/api`, puerto 3000

---

### 📂 `apps/worker/src/` — Procesamiento en segundo plano

- `main.ts` — Inicia el worker (no expone HTTP, solo procesa jobs)
- `worker.module.ts` — Configura BullMQ, registra queue `sql-evaluation`
- `evaluation.processor.ts` — Procesa jobs: recibe un trabajo, simula 2 segundos, log de "SQL ejecutado"

---

### 📂 `infra/` — Configuración Docker y base de datos

- `docker-compose.yml` — Define 4 servicios: `postgres`, `redis`, `api`, `worker` con sus puertos y dependencias
- `.env.example` — Variables de entorno (copiar a `.env` para levanta Docker)
- `postgres/init/` — Scripts SQL que se ejecutan al iniciar PostgreSQL (vacío por ahora)

---

### 📂 `1-documentation/` — Documentación del proyecto

- `README.md` — Guía de arquitectura y diseño (está bastante completa)
- `architecture/01-system-architecture.md` — Descripción de contenedores y servicios
- `architecture/02-components-api-and-worker.md` — Descomposición de la API en capas
- `architecture/03-queue-contract-sql-evaluation.md` — Contrato entre API y Worker vía Redis
- `diagrams/01-components-textual.md` — Diagrama de componentes en texto ASCII

---

### 📂 Raíz del proyecto

- `README.md` — **ESTE ARCHIVO** — Guía general, setup, cómo probar
- `.gitignore` — Qué no versionear (node_modules, .env, dist/, etc.)
- `package.json` — Dependencias del workspace raíz (actualmente vacío, cada app tiene su propio)
- `package-lock.json` — Lock de dependencias del workspace

---

## Flujo simplificado: un usuario hace login

1. Usuario hace `POST /api/auth/login` con email y password
2. `AuthController` llama a `LoginUseCase`
3. `LoginUseCase` busca el user en DB vía `UserRepository`
4. Valida contraseña con `bcrypt.compare()`
5. `LoginUseCase` usa `TokenGenerator` (implementado por `NestJwtTokenGeneratorService`) para crear un JWT firmado con `JWT_SECRET`
6. Devuelve `{ accessToken: "eyJhbGc..." }`
7. Cliente guarda el token y lo manda en cada request: `Authorization: Bearer <token>`
8. `JwtAuthGuard` intercepta, valida el token, y si es válido, permite acceso
9. Si la ruta tiene `@Roles(Role.PROFESSOR)`, el `RolesGuard` verifica que el rol del usuario esté en la lista permitida

---

## Flujo simplificado: un estudiante envía una solución SQL

1. Estudiante hace `POST /api/submissions` con `Authorization: Bearer <token>` y body `{ challengeId: 1, sql: "SELECT * FROM users" }`
2. `JwtAuthGuard` valida el token JWT → 401 si no es válido
3. `RolesGuard` verifica que el rol sea STUDENT o PROFESSOR → 403 si no corresponde
4. `CreateSubmissionUseCase` registra la submission vía `PostgresSubmissionRepository` y la encola vía `BullSubmissionQueueAdapter`
5. La API publica un job en la cola Redis (`sql-evaluation`): `{ submissionId, sql }`
6. El `Worker` consume el job de la cola
7. El `EvaluationProcessor` simula la ejecución SQL (2 segundos) — pendiente implementar evaluación real

---

## Cómo ejecutar localmente

### Requisitos

- **Docker** y **Docker Compose** instalados
- **Node.js** versión 18+ (si quieres desarrollar sin Docker)

### Opción 1: Correr todo con Docker Compose (recomendado)

1. **Coloca el archivo `.env`** en la carpeta `infra/`:
   ```bash
   cd infra
   cp .env.example .env
   ```

2. **Levanta los contenedores**:
   ```bash
   docker compose up --build
   ```
   - API estará en `http://localhost:3000`
   - PostgreSQL en `localhost:5432`
   - Redis en `localhost:6379`
   - Worker escuchando en background

3. **Poblar datos iniciales**: El seed se ejecuta automáticamente al iniciar la API con Docker Compose. Si quieres ejecutarlo manualmente:
   ```bash
   cd apps/api
   npm run seed
   ```
   Esto crea un admin, profesor, estudiantes, cursos y retos de prueba.

   **Credenciales de usuarios de prueba:**

   | Rol | Email | Contraseña |
   |------|-------|-----------|
   | ADMIN | `admin@queryhub.com` | `Admin123!` |
   | PROFESSOR | `maria.garcia@universidad.edu` | `Prof1234!` |
   | STUDENT | `carlos.lopez@universidad.edu` | `Estudiante1!` |
   | STUDENT | `ana.martinez@universidad.edu` | `Estudiante1!` |

4. **Listo**, los logs te mostrarán cuando esté funcionando. Swagger en `http://localhost:3000/api/docs`

### Opción 2: Correr localmente en desarrollo

1. **Configura el `.env` en `infra/`** (igual que arriba)

2. **En una terminal, levanta los servicios base**:
   ```bash
   cd infra
   docker compose up postgres redis
   ```

3. **En otra terminal, inicia la API**:
   ```bash
   cd apps/api
   npm install
   npm run start:dev
   ```

4. **En otra terminal, inicia el worker**:
   ```bash
   cd apps/worker
   npm install
   npm run start:dev
   ```

---

## Seed de datos iniciales

El proyecto incluye un script que crea datos de prueba (idempotente — no duplica datos si se ejecuta varias veces):

```bash
cd apps/api
npm run seed
```

### Datos creados por el seed

| Tipo | Cantidad | Detalles |
|------|----------|---------|
| **Admin** | 1 | `admin@queryhub.com` / `admin123` |
| **Profesor** | 1 | `maria.garcia@universidad.edu` / `Prof1234!` |
| **Estudiantes** | 2 | `carlos.lopez@universidad.edu`, `ana.martinez@universidad.edu` / `Estudiante1!` |
| **Cursos** | 2 | Bases de Datos I, SQL Avanzado |
| **Inscripciones** | 3 | Carlos→ambos cursos, Ana→Bases de Datos I |
| **Retos SQL** | 4 | SELECT básica (EASY), WHERE (EASY), JOIN (MEDIUM), Subconsultas (HARD) — todos PUBLICADOS con schema/seed SQL |

> **Nota:** Los datos seed persisten en el volumen de PostgreSQL aunque reinicies los contenedores.

## Endpoints de la API

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| POST | `/api/auth/login` | ❌ | — | Iniciar sesión, recibe JWT |
| POST | `/api/users` | ✅ | ADMIN | Crear usuario |
| GET | `/api/users` | ✅ | ADMIN | Listar usuarios |
| GET | `/api/users/:id` | ✅ | — | Obtener usuario por ID |
| DELETE | `/api/users/:id` | ✅ | ADMIN | Eliminar usuario |
| POST | `/api/courses` | ✅ | PROFESSOR | Crear curso |
| GET | `/api/courses` | ✅ | — | Listar cursos |
| GET | `/api/courses/:id` | ✅ | PROFESSOR/ADMIN | Obtener curso |
| PATCH | `/api/courses/:id` | ✅ | PROFESSOR | Actualizar curso |
| DELETE | `/api/courses/:id` | ✅ | PROFESSOR | Eliminar curso |
| POST | `/api/challenges` | ✅ | PROFESSOR | Crear reto (estado DRAFT) |
| GET | `/api/challenges` | ❌ | — | Listar retos (con filtros) |
| GET | `/api/challenges/:id` | ❌ | — | Obtener reto por ID |
| PATCH | `/api/challenges/:id` | ✅ | PROFESSOR | Actualizar reto |
| DELETE | `/api/challenges/:id` | ✅ | PROFESSOR | Eliminar reto |
| PATCH | `/api/challenges/:id/publish` | ✅ | PROFESSOR | Publicar reto (DRAFT→PUBLISHED) |
| POST | `/api/challenges/:id/schema` | ✅ | PROFESSOR | Subir DDL del reto |
| POST | `/api/challenges/:id/seed` | ✅ | PROFESSOR | Subir datos semilla del reto |
| POST | `/api/submissions` | ✅ | STUDENT/PROFESSOR | Enviar solución SQL para evaluación |

## Cómo probar que funciona

### 1. Login con datos seed
```bash
# Login como ADMIN
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@queryhub.com", "password": "admin123"}'

# Login como PROFESOR
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "maria.garcia@universidad.edu", "password": "Prof1234!"}'
```

Guarda el `accessToken` que devuelve.

### 2. Obtener retos (sin auth — público)
```bash
curl http://localhost:3000/api/challenges
```

### 3. Enviar solución SQL (como estudiante)
```bash
TOKEN="<token_de_estudiante>"  # carlos.lopez / Estudiante1!

curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"challengeId": 1, "sql": "SELECT * FROM estudiantes;"}'
```

### 4. Ver logs de los contenedores
```bash
docker compose logs -f api
docker compose logs -f worker
docker compose logs -f postgres
```

### 5. Swagger UI
Abrir `http://localhost:3000/api/docs` en el navegador.

---

## Próximos pasos

1. **Documentación API**
   - Crear archivos markdown en `1-documentation/api/`
   - Documentar todos los endpoints con ejemplos

2. **Evaluación SQL real** (worker)
   - Sustituir el stub del worker por ejecución de consultas contra el entorno controlado
   - Registrar resultados, errores y tiempos de evaluación
   - El worker necesita acceder a PostgreSQL para ejecutar las consultas de los estudiantes

3. **Flujo completo de submissions**
   - Enriquecer el job de la cola con datos del reto (schema_sql, seed_sql) para que el worker pueda evaluar
   - ✅ Submissions persistidas en PostgreSQL vía `PostgresSubmissionRepository`
   - Devolver resultados de evaluación al estudiante

---

## Variables de entorno (`.env`)

Copia `.env.example` a `infra/.env` y ajusta si es necesario:

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=#changeme
POSTGRES_DB=queryhub

# Redis (sin cambios en local)
REDIS_HOST=redis
REDIS_PORT=6379

# API
PORT=3000

# JWT (cambiar en producción)
JWT_SECRET=change_this_secret
```

---

## Estructura de commits esperada

- Commits pequeños y atómicos (una funcionalidad = un commit)
- Mensajes en inglés o español consistente: `feat: add login endpoint` o `feat: agregar endpoint de login`
- Un commit por feature, no 5 commits por un CRUD

---

## Revisar

Si algo no funciona:
1. Revisa los logs con `docker compose logs`
2. Verifica que las variables de `.env` sean correctas
3. Asegúrate de que Docker está corriendo
4. Intenta `docker compose down` y `docker compose up --build` para limpiar

---

