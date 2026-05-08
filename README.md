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
