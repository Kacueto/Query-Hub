# Query-Hub

**Query-Hub** es una plataforma backend para evaluar automáticamente consultas SQL de estudiantes. Los profesores crean retos, los estudiantes envían soluciones SQL y el sistema las evalúa en tiempo real, generando retroalimentación y recomendaciones de optimización.

---

## Estado: Entrega Parcial 1

### Lo que ya está LISTO

- **Arquitectura**: estructura Clean Architecture con dominio, aplicación, infraestructura y presentación.
- **Modelo de dominio**: entidades base (User, Course, Challenge, Submission, Schema, etc.) con repositorios.
- **Autenticación JWT**: endpoint de login funcional con tokens JWT.
- **Gestión de usuarios**: CRUD básico de usuarios, roles (ADMIN, PROFESSOR, STUDENT).
- **Roles y guards**: decorador `@Roles()` y guard para verificar permisos en rutas protegidas.
- **Docker Compose**: API, PostgreSQL y Redis funcionando en contenedores.
- **Worker SQL**: modo stub, espera trabajos desde la cola Redis.
- **Documentación de arquitectura**: diseño C4 de componentes y contenedores.

###  Lo que FALTA para completar la parcial 1

- **CRUD de cursos**: módulo, controlador, casos de uso.
- **CRUD de retos SQL**: módulo, controlador, casos de uso (challenges).
- **Carga de esquemas**: funcionalidad para subir esquemas a retos.
- **Generación de datos de prueba**: funcionalidad para generar datos iniciales en un reto.
- **Documentación de la API**: archivos en `1-documentation/api/` con especificación de endpoints.

---

## Estructura de Carpetas

```
Query-Hub/
├── apps/
│   ├── api/                    # API NestJS (puerta de entrada)
│   │   ├── src/
│   │   │   ├── domain/         # Entidades, enums, repositorios (reglas de negocio)
│   │   │   ├── application/    # Casos de uso, DTOs (orquestación)
│   │   │   ├── infrastructure/ # TypeORM, JWT, base de datos (detalles técnicos)
│   │   │   ├── presentation/   # Controllers, guards, módulos NestJS (HTTP)
│   │   │   ├── app.module.ts   # Módulo raíz
│   │   │   └── main.ts         # Punto de entrada
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── worker/                 # Worker en segundo plano (procesa trabajos SQL)
│       ├── src/
│       │   ├── worker.module.ts
│       │   ├── evaluation.processor.ts  # Procesa trabajos desde Redis
│       │   └── main.ts
│       ├── Dockerfile
│       └── package.json
│
├── infra/
│   ├── docker-compose.yml      # Configuración de contenedores
│   ├── .env.example            # Variables de entorno
│   └── postgres/init/          # Scripts de inicialización DB
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
| `application/use-cases/` | Lógica: "crear usuario", "hacer login", "listar cursos" |
| `application/dtos/` | Formato de datos que entra y sale de la API |
| `infrastructure/persistence/` | Implementación real: cómo guardar en PostgreSQL (TypeORM) |
| `infrastructure/auth/` | JWT: estrategia, token, verificación |
| `presentation/http/controllers/` | Endpoints REST: POST, GET, DELETE |
| `presentation/guards/` | Verificadores: ¿token válido? ¿rol permitido? |
| `presentation/modules/` | Agrupación NestJS: `AuthModule`, `UsersModule`, `CoursesModule` (falta), etc. |

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
- `postgres-user.repository.ts` — Implementa `UserRepository` usando TypeORM y PostgreSQL

**`infrastructure/auth/`** — Autenticación con JWT:
- `jwt.strategy.ts` — Estrategia Passport para validar JWT en header `Authorization: Bearer <token>`
- `jwt-auth.guard.ts` — Guard que valida que el token sea válido antes de acceder a rutas protegidas

**`infrastructure/security/`** — Utilidades de seguridad (puede estar vacío, preparado para después)

---

#### **Presentation** — Exposición HTTP (controladores, guards, módulos)

**`presentation/http/controllers/`** — Endpoints REST:
- `auth.controller.ts` — Endpoint `POST /auth/login` para obtener token
- `users.controller.ts` — Endpoints: `POST /users`, `GET /users`, `GET /users/:id`, `DELETE /users/:id`

**`presentation/http/dto/`** — DTOs específicas de HTTP (si hay conversiones especiales)

**`presentation/decorators/`** — Decoradores personalizados:
- `roles.decorator.ts` — `@Roles(Role.PROFESSOR)` marca qué roles pueden acceder a una ruta

**`presentation/guards/`** — Guardias de acceso:
- `roles.guard.ts` — Verifica si el usuario tiene el rol requerido; lanza `ForbiddenException` si no

**`presentation/modules/`** — Módulos NestJS (agrupan funcionalidad):
- `auth/auth.module.ts` — Agrupa login, JWT strategy, JWT guard
- `users/users.module.ts` — Agrupa usuarios, casos de uso, repositorio

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
5. Crea un JWT con `JwtService` (firmado con `JWT_SECRET`)
6. Devuelve `{ accessToken: "eyJhbGc..." }`
7. Cliente guarda el token y lo manda en cada request: `Authorization: Bearer <token>`
8. `JwtAuthGuard` intercepta, valida el token, y si es válido, permite acceso
9. Si la ruta tiene `@Roles(Role.PROFESSOR)`, el `RolesGuard` verifica que el rol del usuario esté en la lista permitida

---

## Flujo simplificado: un estudiante envía una solución SQL

1. Estudiante hace `POST /api/submissions` con `{ challengeId: 1, code: "SELECT * FROM users" }`
2. `SubmissionsController` recibe el request (AQUÍ FALTA IMPLEMENTACIÓN COMPLETA)
3. Se crea un `Submission` en la DB con estado `PENDING`
4. La API publica un job en la cola Redis: `{ submissionId: 1, code: "...", challengeId: 1 }`
5. El `Worker` consume el job de la cola
6. El `EvaluationProcessor` simula la ejecución SQL (AQUÍ FALTA REAL IMPLEMENTATION)
7. Publica resultados de vuelta (detalles pending)

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

3. **Listo**, los logs te mostrarán cuando esté funcionando.

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

## Cómo probar que funciona

### 1. Crear un usuario
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "email": "juan@example.com",
    "password": "123456",
    "role": "PROFESSOR"
  }'
```

### 2. Hacer login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "123456"
  }'
```
Guardarás el `accessToken` que devuelve.

### 3. Listar usuarios (con token)
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <TU_TOKEN_AQUI>"
```

### 4. Ver logs
```bash
# Ver logs de API
docker compose logs -f api

# Ver logs de worker
docker compose logs -f worker

# Ver logs de DB
docker compose logs -f postgres
```

---

## Para completar la entrega parcial

1. **CRUD de Cursos**
   - Crear módulo `CoursesModule`
   - Implementar casos de uso (crear, listar, actualizar, eliminar)
   - Endpoints: `POST/GET/PATCH/DELETE /courses`

2. **CRUD de Retos SQL**
   - Crear módulo `ChallengesModule`
   - Implementar casos de uso (crear, listar, publicar, etc.)
   - Endpoints: `POST/GET/PATCH/DELETE /challenges`

3. **Carga de esquemas**
   - Endpoint para cargar esquema SQL en un reto
   - Endpoint: `POST /challenges/{id}/schema`

4. **Generación de datos de prueba**
   - Endpoint para generar datos iniciales
   - Endpoint: `POST /challenges/{id}/seed`

5. **Documentación API**
   - Crear archivos markdown en `1-documentation/api/`
   - Documentar todos los endpoints con ejemplos

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
REDIS_PORT=puerto

# API
PORT=puerto

# JWT (cambiar en producción)
JWT_SECRET=change_this_secret
```

---

## Estructura de commits esperada

- Commits pequeños y atómicos (una funcionalidad = un commit)
- Mensajes en inglés o español consistente: `feat: add login endpoint` o `feat: agregar endpoint de login`
- Un commit por feature, no 5 commits por un CRUD

---

## Contacto / Preguntas

Si algo no funciona:
1. Revisa los logs con `docker compose logs`
2. Verifica que las variables de `.env` sean correctas
3. Asegúrate de que Docker está corriendo
4. Intenta `docker compose down` y `docker compose up --build` para limpiar

---

**Última actualización**: Mayo 7, 2026  
**Estado**: Entrega Parcial 1 en progreso
