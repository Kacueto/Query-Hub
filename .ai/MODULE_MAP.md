# Mapa de Módulos — Query-Hub

Este archivo mapea cada módulo del proyecto a sus carpetas, responsable y estado actual.

> **Estructura de archivos**: Los controladores viven en `presentation/http/controllers/`, los módulos NestJS en `presentation/modules/*/`. Un módulo nuevo requiere ambos.

## Módulos existentes

| Módulo | Carpetas principales | Responsable | Estado |
|--------|---------------------|-------------|--------|
| **Infraestructura** | `infra/`, `apps/api/src/infrastructure/config/`, `apps/worker/` | Carlos | ✅ Listo |
| **Auth + Users** | `domain/entities/user.entity.ts`, `domain/enums/role.enum.ts`, `application/use-cases/auth/`, `application/use-cases/users/`, `infrastructure/auth/`, `presentation/http/controllers/auth.controller.ts`, `presentation/http/controllers/users.controller.ts`, `presentation/modules/auth/`, `presentation/modules/users/` | Darlen | ✅ Listo |
| **Courses** | `domain/entities/course.entity.ts`, `application/use-cases/courses/`, `infrastructure/persistence/repositories/postgres-course.repository.ts`, `presentation/http/controllers/courses.controller.ts`, `presentation/modules/courses/` | Kevin C | ✅ Listo |
| **Challenges + Schemas** | `domain/entities/challenge.entity.ts`, `domain/entities/schema.entity.ts`, `application/use-cases/challenges/`, `infrastructure/persistence/repositories/postgres-challenge.repository.ts`, `presentation/http/controllers/challenges.controller.ts`, `presentation/modules/challenges/` | Sebastian | ✅ Listo |
| **Submissions** | `domain/entities/submission.entity.ts`, `application/use-cases/submissions/`, `infrastructure/queue/bull-submission-queue.adapter.ts`, `infrastructure/persistence/repositories/postgres-submission.repository.ts`, `presentation/http/controllers/submissions.controller.ts`, `presentation/modules/submissions/` | Kevin R | ✅ Listo (falta worker real) |
| **Worker (stub)** | `apps/worker/src/main.ts`, `apps/worker/src/worker.module.ts`, `apps/worker/src/evaluation.processor.ts` | Kevin R | ⚠️ Stub |
| **Assessment** | `domain/entities/assessment.entity.ts`, `domain/repositories/assessment.repository.ts`, `infrastructure/persistence/repositories/postgres-assessment.repository.ts` | — | ✅ Listo (entidad creada) |
| **Evaluation** | `domain/entities/evaluation.entity.ts`, `domain/entities/evaluation-challenge.entity.ts` | — | ✅ Listo (entidades creadas) |

## Módulos a construir (Entrega Final)

| Módulo | Carpetas a crear/modificar | Responsable sugerido | Prioridad |
|--------|---------------------------|---------------------|-----------|
| **Runner Docker** | `apps/worker/src/runner/sql-runner.service.ts` (nuevo), `apps/worker/src/runner/runner.module.ts` (nuevo), `infra/docker-compose.yml` | Carlos | 🔴 Alta |
| **Evaluador SQL** | `apps/worker/src/evaluation.processor.ts` (modificar), `infrastructure/persistence/` | Kevin R | 🔴 Alta |
| **Asistente IA** | `apps/api/src/application/ports/ai-advisor.port.ts` (nuevo), `apps/api/src/infrastructure/ai/` (nuevo), `apps/worker/src/ai/` (nuevo), `domain/entities/ai-recommendation.entity.ts` (revisar) | Darlen | 🔴 Alta |
| **Generador datos** | `apps/api/src/application/use-cases/random-data/` (nuevo), `apps/api/src/presentation/http/controllers/random-data.controller.ts` (nuevo), `apps/api/src/presentation/modules/random-data/` (nuevo) | Sebastian | 🟡 Media |
| **Evaluaciones** | `apps/api/src/application/use-cases/assessments/` (nuevo), `apps/api/src/presentation/http/controllers/assessments.controller.ts` (nuevo), `apps/api/src/presentation/modules/assessments/` (nuevo) | Kevin C | 🟡 Media |
| **Reportes** | `apps/api/src/application/use-cases/reports/` (nuevo), `apps/api/src/presentation/http/controllers/reports.controller.ts` (nuevo), `apps/api/src/presentation/modules/reports/` (nuevo) | Cualquiera | 🟡 Media |

## Archivos de coordinación

Estos archivos afectan a todo el equipo. Cualquier cambio debe coordinarse:

| Archivo | Propietario | Riesgo si se cambia sin avisar |
|---------|-------------|-------------------------------|
| `apps/api/src/app.module.ts` | Carlos | Rompe la inyección de dependencias de todos |
| `apps/api/package.json` | Carlos | Dependencias compartidas |
| `apps/worker/package.json` | Kevin R | Dependencias del worker |
| `infra/docker-compose.yml` | Carlos | Todos los servicios |
| `infra/.env.example` | Carlos | Variables de entorno |
| `README.md` | — | Documentación general |

## Áreas de trabajo por persona (Entrega Final)

| Persona | Área principal | Evitar pisar |
|---------|---------------|--------------|
| **Carlos** | `infra/`, `apps/worker/src/runner/`, `apps/api/src/infrastructure/config/` | Módulos de dominio de otros |
| **Darlen** | `apps/api/src/infrastructure/ai/`, `apps/api/src/application/ports/ai*`, `apps/worker/src/ai/` | Worker, infraestructura compartida |
| **Kevin C** | `apps/api/src/application/use-cases/assessments/`, `apps/api/src/presentation/modules/assessments/`, `apps/api/src/presentation/http/controllers/assessments.controller.ts` | Runner, evaluador |
| **Kevin R** | `apps/worker/src/evaluation.processor.ts`, `apps/api/src/domain/entities/assessment*`, `apps/api/src/infrastructure/persistence/` | Módulos de frontend de otros |
| **Sebastian** | `apps/api/src/domain/entities/random-data*`, `apps/api/src/application/use-cases/random-data/` | Worker, runner |
