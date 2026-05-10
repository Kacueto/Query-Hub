# Arquitectura — Query-Hub (vista para IA)

## Visión general del sistema

```
┌─────────────┐     ┌──────────────────────────────────────┐
│  Cliente     │     │              API (NestJS)             │
│  (SPA/curl)  │────▶│  Presentation → Application → Domain  │
└─────────────┘     │              ↕                         │
                    │  Infrastructure (TypeORM, JWT, BullMQ) │
                    └──────┬──────────────┬──────────────────┘
                           │              │
                    ┌──────▼──┐    ┌──────▼──────┐
                    │PostgreSQL│    │ Redis/BullMQ │
                    │ (datos)  │    │  (cola)      │
                    └─────────┘    └──────┬───────┘
                                          │
                                   ┌──────▼───────┐
                                   │ Worker (NestJS)│
                                   │ EvaluationProc. │
                                   └──────┬────────┘
                                          │
                                   ┌──────▼───────┐
                                   │ Runner Docker  │
                                   │ (contenedor PG  │
                                   │  efímero)      │
                                   └──────────────┘
```

## Capas internas de la API

```
┌──────────────────────────────────────────────────────┐
│                   Presentation                        │
│  controllers / guards / decorators / dto / modules   │
│  (carpeta: apps/api/src/presentation/)                │
│  Depende de: application (use-cases)                  │
├──────────────────────────────────────────────────────┤
│                   Application                         │
│  use-cases / dtos / ports (interfaces)               │
│  (carpeta: apps/api/src/application/)                │
│  Depende de: domain (entities, repos interfaces)      │
├──────────────────────────────────────────────────────┤
│                   Domain                              │
│  entities / enums / repository interfaces            │
│  (carpeta: apps/api/src/domain/)                     │
│  Depende de: nada externo (cero imports de NestJS)   │
├──────────────────────────────────────────────────────┤
│                 Infrastructure                        │
│  persistence/ (TypeORM entities + repos)             │
│  auth/ (JWT strategy + token generator)              │
│  queue/ (BullMQ adapter)                             │
│  ai/ (AI advisor adapter)     ← NUEVO                │
│  (carpeta: apps/api/src/infrastructure/)              │
│  Depende de: domain + application ports               │
└──────────────────────────────────────────────────────┘
```

## Worker

```
apps/worker/src/
├── worker.module.ts              # Módulo raíz (sin HTTP)
├── main.ts                       # Punto de entrada
├── evaluation.processor.ts       # Consumidor BullMQ (job: sql-evaluation)
├── runner/                       ← NUEVO: runner SQL con Docker
│   ├── sql-runner.service.ts     # Lógica de contenedor efímero
│   └── runner.module.ts
└── ai/                           ← NUEVO: advisor post-evaluación
    └── ai-advisor.service.ts     # Llama al asistente inteligente
```

## Flujo crítico: Submission → Evaluación

```
POST /api/submissions
       │
       ▼
SubmissionsController
       │
       ▼
CreateSubmissionUseCase
       │
        ├─▶ PostgresSubmissionRepository.save()    → status: QUEUED
       │
       └─▶ BullSubmissionQueueAdapter.publish()   → job: sql-evaluation
                                                          │
                                                     ┌────▼────┐
                                                     │  Redis   │
                                                     └────┬────┘
                                                          │
                                                     ┌────▼──────┐
                                                     │  Worker    │
                                                     │  EvalProc  │
                                                     └────┬──────┘
                                                          │
                                              ┌───────────┼───────────┐
                                              │           │           │
                                              ▼           ▼           ▼
                                        SqlRunner   AiAdvisor   Update DB
                                      (Docker PG)  (recomienda) (resultado)
```

## Reglas de dependencia estrictas

| Capa → Depende de | ¿Puede importar de infra? | ¿Puede importar de NestJS? |
|-------------------|--------------------------|---------------------------|
| Domain → nada | ❌ | ❌ |
| Application → Domain | ❌ | Solo `@nestjs/common` (excepciones) |
| Infrastructure → Domain + Ports | ✅ | ✅ |
| Presentation → Application | ❌ | ✅ |

**Violación común que evitar**: un controlador llamando directamente a un repositorio. Siempre debe pasar por un use-case.
