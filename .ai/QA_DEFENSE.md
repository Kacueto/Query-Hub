# Posibles preguntas del profesor — Entrega Final

Este documento anticipa las preguntas que el profesor podría hacer durante la defensa de la entrega final, organizadas por módulo. Cada pregunta incluye la respuesta clave y la **ubicación exacta** de los archivos involucrados.

---

## 1. Runner SQL con Docker (15%)

### ¿Cómo se crea el contenedor temporal para evaluar una submission?

El runner usa `dockerode` (SDK de Docker para Node.js) para levantar un contenedor PostgreSQL 16 efímero por cada evaluación. El ciclo de vida es:

1. Crear contenedor con `postgres:16-alpine`
2. Esperar a que PostgreSQL esté listo (healthcheck)
3. Copiar schema + seed al contenedor
4. Ejecutar query del estudiante + query esperada
5. Capturar resultados y tiempo
6. Destruir contenedor en `finally`

**Archivos:**
- `apps/worker/src/runner/sql-runner.service.ts` — Lógica del runner
- `apps/worker/src/runner/runner.module.ts` — Módulo NestJS del runner

### ¿Cómo se asegura de que el contenedor se limpie al finalizar?

El cleanup se hace en un bloque `finally` de TypeScript. Incluso si la evaluación lanza una excepción, el contenedor se elimina. Se usa `try / catch / finally` o `using` con disposición asíncrona.

**Archivo:**
- `apps/worker/src/runner/sql-runner.service.ts` (método `evaluate()`, bloque `finally` con `container.remove({ force: true })`)

### ¿Qué límites de recursos se aplican y dónde se configuran?

| Recurso | Límite | Dónde se define |
|---------|--------|----------------|
| Memoria | 256 MB | `sql-runner.service.ts` — `containerOptions.HostConfig.Memory` |
| CPU | 0.5 cores | `sql-runner.service.ts` — `containerOptions.HostConfig.NanoCpus` |
| Timeout | 30s (configurable por challenge) | `sql-runner.service.ts` — `AbortController` con timeout |

El timeout base se puede sobrescribir desde el `challenge.timeLimit`.

**Archivos:**
- `apps/worker/src/runner/sql-runner.service.ts` — Configuración de recursos del contenedor
- `apps/api/src/domain/entities/challenge.entity.ts` — Campo `timeLimit`

### ¿Cómo se mide el tiempo de ejecución?

Se usa `performance.now()` antes y después de ejecutar la query contra PostgreSQL dentro del contenedor. La diferencia en ms se almacena en `evaluation.executionTimeMs`.

```typescript
const start = performance.now();
const result = await client.query(studentQuery);
const executionTimeMs = performance.now() - start;
```

**Archivos:**
- `apps/worker/src/runner/sql-runner.service.ts` — Medición con `performance.now()`
- `apps/api/src/domain/entities/evaluation.entity.ts` — Campo `executionTimeMs`

### ¿Qué pasa si la query del estudiante tarda más del límite?

El `AbortController` cancela la operación y el runner devuelve un estado `TIME_LIMIT_EXCEEDED`. La submission se marca con ese estado y no se compara el resultado.

**Archivos:**
- `apps/worker/src/runner/sql-runner.service.ts` — Lógica de timeout y cancelación
- `apps/api/src/domain/enums/submission-status.enum.ts` — Estado `TIME_LIMIT_EXCEEDED`

---

## 2. Evaluador SQL funcional (20%)

### ¿Cómo se comparan los resultados de la query del estudiante contra lo esperado?

Se usa la sentencia SQL `EXCEPT` o `EXCEPT ALL` de PostgreSQL para encontrar diferencias entre el resultado del estudiante y el esperado:

```sql
SELECT column1, column2 FROM (query_estudiante) AS student
EXCEPT
SELECT column1, column2 FROM (query_esperada) AS expected;
```

Si el EXCEPT devuelve 0 filas, los resultados son idénticos → `ACCEPTED`.
Si devuelve filas, hay diferencias → `WRONG_ANSWER`.
Si la query del estudiante tiene error de sintaxis → `SYNTAX_ERROR`.

**Archivos:**
- `apps/worker/src/runner/sql-runner.service.ts` — Comparación con EXCEPT
- `apps/worker/src/evaluation.processor.ts` — Orquestación de la evaluación

### ¿Qué criterios de evaluación se usan?

| Criterio | Peso |
|----------|------|
| Resultado correcto | 60% |
| Tiempo de ejecución | 15% |
| Uso adecuado de SQL | 10% |
| Claridad de la consulta | 5% |
| Recomendaciones atendidas | 10% |

**Archivos:**
- `apps/api/src/domain/entities/evaluation.entity.ts` — Campos `score`
- `apps/worker/src/evaluation.processor.ts` — Cálculo del puntaje

### ¿Qué estados de submission existen y cómo se asignan?

| Estado | Cuándo se asigna | Archivo donde se asigna |
|--------|-----------------|------------------------|
| `QUEUED` | Al crear la submission | `apps/api/src/application/use-cases/submissions/create-submission.use-case.ts` |
| `RUNNING` | Worker empieza a evaluar | `apps/worker/src/evaluation.processor.ts` |
| `ACCEPTED` | Resultado correcto | `apps/worker/src/evaluation.processor.ts` |
| `WRONG_ANSWER` | Resultado incorrecto | `apps/worker/src/evaluation.processor.ts` |
| `SYNTAX_ERROR` | Error de sintaxis SQL | `apps/worker/src/runner/sql-runner.service.ts` |
| `TIME_LIMIT_EXCEEDED` | Excedió tiempo límite | `apps/worker/src/runner/sql-runner.service.ts` |
| `RUNTIME_ERROR` | Error inesperado | `apps/worker/src/evaluation.processor.ts` (catch general) |
| `OPTIMIZATION_REQUIRED` | Funciona pero bajo rendimiento | `apps/worker/src/evaluation.processor.ts` |

**Archivo de referencia:**
- `apps/api/src/domain/enums/submission-status.enum.ts` — Definición del enum

### ¿Dónde se actualiza el estado de la submission después de evaluar?

El worker llama al `PostgresSubmissionRepository` para actualizar el estado y guardar el resultado (`Evaluation`). Esto puede hacerse directamente desde el worker (tiene acceso a PostgreSQL) o a través de un evento BullMQ.

**Archivos:**
- `apps/worker/src/evaluation.processor.ts` — Actualización post-evaluación
- `apps/api/src/infrastructure/persistence/repositories/postgres-submission.repository.ts` — `updateStatus()`
- `apps/api/src/domain/repositories/submission.repository.ts` — Interfaz con `updateStatus()`

---

## 3. Worker SQL funcional

### ¿Cómo consume el worker los trabajos desde Redis?

El worker usa BullMQ con un `Worker` que escucha la cola `sql-evaluation`. Cuando llega un job, el `EvaluationProcessor` lo procesa. La cola está definida con `@nestjs/bullmq`.

```typescript
@Processor('sql-evaluation')
export class EvaluationProcessor {
  @Process()
  async evaluate(job: Job<SqlEvaluationJobPayload>) { ... }
}
```

**Archivos:**
- `apps/worker/src/evaluation.processor.ts` — Procesador de jobs
- `apps/worker/src/worker.module.ts` — Configuración de BullMQ
- `apps/api/src/infrastructure/queue/bull-submission-queue.adapter.ts` — Productor (API encola)
- `1-documentation/architecture/03-queue-contract-sql-evaluation.md` — Contrato del payload

### ¿Qué contiene el payload del job?

```typescript
interface SqlEvaluationJobPayload {
  submissionId: string;
  userId: string;
  challengeId: string;
  sqlQuery: string;
  createdAt: Date | string;
}
```

**Archivo:**
- `1-documentation/architecture/03-queue-contract-sql-evaluation.md` — Documentación del contrato

### ¿Qué pasa si el worker falla durante la evaluación?

BullMQ reintenta el job automáticamente (configurable, ej: 3 intentos). Si falla en todos, el job se marca como `failed` y queda en la cola de fallidos para inspección manual.

**Archivos:**
- `apps/worker/src/worker.module.ts` — Configuración de reintentos
- Dashboard BullMQ (si se implementa) para monitoreo

---

## 4. Asistente Inteligente (10%) — OBLIGATORIO

### ¿Cómo está desacoplado el proveedor de IA?

Se definió un **puerto** (interfaz) `AiAdvisor` en `application/ports/`. La infraestructura implementa ese puerto. Esto permite cambiar de proveedor sin tocar los casos de uso.

```typescript
// Puerto (application/ports)
export interface AiAdvisor {
  analyze(payload: AiAnalysisRequest): Promise<AiRecommendation>;
}

// Implementación (infrastructure/ai)
export class OpenAiAdvisorService implements AiAdvisor { ... }
```

**Archivos:**
- `apps/api/src/application/ports/ai-advisor.port.ts` — Interfaz del puerto
- `apps/api/src/infrastructure/ai/openai-advisor.service.ts` — Implementación con OpenAI
- `apps/api/src/infrastructure/ai/claude-advisor.service.ts` — Implementación con Claude (alternativa)
- `apps/api/src/infrastructure/ai/ai.module.ts` — Módulo de inyección

### ¿Qué prompt se usa para analizar la consulta?

```
Analiza la siguiente consulta SQL para un curso de bases de datos.
Schema DDL: {schema}
Consulta del estudiante: {query}
Tiempo de ejecución: {executionTimeMs} ms

Genera:
1. Explicación en lenguaje natural
2. Recomendaciones de optimización
3. Índices sugeridos (CREATE INDEX ...)
4. Advertencias de malas prácticas
5. Versión optimizada si aplica
6. Impacto estimado de las mejoras
```

**Archivo:**
- `apps/api/src/infrastructure/ai/openai-advisor.service.ts` — Template del prompt

### ¿Qué genera exactamente?

```typescript
interface AiRecommendation {
  explicacion: string;                    // Explicación en lenguaje natural
  recomendaciones: string[];              // Lista de recomendaciones
  indicesSugeridos: string[];             // CREATE INDEX statements
  malasPracticas: string[];               // Advertencias
  queryReescrita?: string;                // Versión optimizada (opcional)
  impactoEstimado?: string;               // Impacto de las mejoras
}
```

**Archivos:**
- `apps/api/src/domain/entities/ai-recommendation.entity.ts` — Entidad de dominio
- `apps/api/src/infrastructure/ai/openai-advisor.service.ts` — Mapeo de respuesta

### ¿Dónde se guardan las recomendaciones?

Se persisten en la tabla `ai_recommendations` de PostgreSQL, relacionadas con la `submission`. El worker llama al advisor después de la evaluación y guarda el resultado.

```typescript
const recommendation = await aiAdvisor.analyze({ query, schema, executionTimeMs });
await aiRecommendationRepository.save(recommendation);
```

**Archivos:**
- `apps/api/src/domain/entities/ai-recommendation.entity.ts` — Entidad
- `apps/api/src/infrastructure/persistence/entities/ai-recommendation.typeorm-entity.ts` — TypeORM entity
- `apps/api/src/domain/repositories/ai-recommendation.repository.ts` — Interfaz
- `apps/worker/src/evaluation.processor.ts` — Invocación post-evaluación

### ¿Cómo se integra con el worker?

El worker recibe el resultado del runner (evaluación), luego llama al `AiAdvisor` con la query, el schema y el tiempo de ejecución, y persiste el resultado junto con la evaluación.

**Archivo:**
- `apps/worker/src/evaluation.processor.ts` — Flujo: runner → advisor → persistencia

---

## 5. Generador de datos aleatorios (10%)

### ¿Cómo respeta las relaciones entre tablas?

La configuración del generador incluye referencias a foreign keys. Al generar datos, primero inserta registros en las tablas padre, luego en las tablas hijas, respetando las claves foráneas generadas.

```typescript
// Ejemplo de configuración
{
  "table": "orders",
  "rows": 10000,
  "fields": {
    "customer_id": {
      "type": "foreign_key",
      "references": "customers.id"  // ← FK constraint
    }
  }
}
```

**Archivos:**
- `apps/api/src/domain/entities/random-data-generation.entity.ts` — Entidad de configuración
- `apps/api/src/application/use-cases/random-data/generate-random-data.use-case.ts` — Lógica de generación respetando FKs
- `apps/api/src/presentation/modules/random-data/random-data.controller.ts` — Endpoint de generación

### ¿Qué configuraciones soporta?

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `number` | Rango numérico | `{ min: 10000, max: 5000000 }` |
| `string` | Longitud fija/variable | `{ minLength: 5, maxLength: 20 }` |
| `date` | Rango de fechas | `{ from: "2026-01-01", to: "2026-12-31" }` |
| `enum` | Lista de valores posibles | `{ values: ["PENDING", "PAID"] }` |
| `foreign_key` | Referencia a otra tabla | `{ references: "customers.id" }` |
| `null_percentage` | % de valores nulos | `{ nullPercentage: 10 }` |

**Archivos:**
- `apps/api/src/domain/entities/random-data-generation.entity.ts` — Schema de configuración
- `apps/api/src/application/use-cases/random-data/generate-random-data.use-case.ts` — Implementación por tipo

---

## 6. Evaluaciones/parciales (15%)

### ¿Cómo se relacionan las evaluaciones con los retos?

Un `Assessment` (evaluación/parcial) contiene múltiples `EvaluationChallenge` (retos asociados). Es una relación ManyToMany con una entidad intermedia que permite configurar propiedades específicas (puntaje máximo, orden, etc.).

```typescript
// Assessment Entity
{
  id: number;
  nombre: string;
  fechaInicio: Date;
  fechaCierre: Date;
  duracion: number; // minutos
  intentosMaximos: number;
  courseId: number;
  challenges: EvaluationChallenge[];
}
```

**Archivos:**
- `apps/api/src/domain/entities/assessment.entity.ts` — Entidad Assessment
- `apps/api/src/domain/entities/evaluation-challenge.entity.ts` — Entidad intermedia
- `apps/api/src/application/use-cases/assessments/create-assessment.use-case.ts` — Creación con challenges asociados
- `apps/api/src/presentation/modules/assessments/assessments.controller.ts` — Endpoints CRUD

### ¿Cómo se controlan los intentos máximos?

Antes de permitir una submission, se verifica la cantidad de submissions que el estudiante ya tiene para ese assessment. Si excede `intentosMaximos`, se rechaza.

**Archivos:**
- `apps/api/src/domain/entities/assessment.entity.ts` — Campo `intentosMaximos`
- `apps/api/src/application/use-cases/submissions/create-submission.use-case.ts` — Validación de intentos

### ¿Visibilidad de resultados?

Se puede configurar si el estudiante ve los resultados inmediatamente después de enviar o solo después de la fecha de cierre del assessment.

**Archivos:**
- `apps/api/src/domain/entities/assessment.entity.ts` — Campo `visibilidadResultados` (inmediata | post-cierre)
- `apps/api/src/application/use-cases/assessments/get-assessment-results.use-case.ts` — Lógica de visibilidad

---

## 7. Reportes (10%)

### ¿Qué reportes están disponibles?

| Reporte | Qué muestra | Endpoint |
|---------|------------|----------|
| Reporte por estudiante | Submissions, scores, evolución temporal | `GET /api/reports/students/:id` |
| Reporte por reto | Estadísticas, tasa de acierto, tiempo promedio | `GET /api/reports/challenges/:id` |
| Reporte por curso | Progreso general, promedios por evaluación | `GET /api/reports/courses/:id` |

**Archivos:**
- `apps/api/src/presentation/modules/reports/reports.controller.ts` — Endpoints
- `apps/api/src/application/use-cases/reports/get-student-report.use-case.ts`
- `apps/api/src/application/use-cases/reports/get-challenge-report.use-case.ts`
- `apps/api/src/application/use-cases/reports/get-course-report.use-case.ts`
- `apps/api/src/domain/repositories/submission.repository.ts` — Métodos agregados para reportes

### ¿Cómo se agregan los datos para los reportes?

Se usan consultas SQL agregadas con `COUNT`, `AVG`, `GROUP BY` directamente en los repositorios. Para reportes más complejos, se pueden crear vistas en PostgreSQL o queries específicas en los repositorios.

```typescript
// Ejemplo
async getChallengeStats(challengeId: number): Promise<ChallengeStats> {
  return this.dataSource.query(`
    SELECT
      COUNT(*) as total,
      AVG(score) as avgScore,
      AVG("executionTimeMs") as avgTime,
      COUNT(CASE WHEN status = 'ACCEPTED' THEN 1 END) as passed
    FROM submissions s
    JOIN evaluations e ON e."submissionId" = s.id
    WHERE s."challengeId" = $1
  `, [challengeId]);
}
```

**Archivo:**
- `apps/api/src/infrastructure/persistence/repositories/postgres-submission.repository.ts` — Queries agregadas

---

## 8. Arquitectura general y Clean Architecture

### ¿Cómo se mantuvo Clean Architecture al agregar los nuevos módulos?

Cada módulo nuevo (runner, asistente IA, generador, evaluaciones, reportes) respetó las 4 capas:

| Capa | Runner | Asistente IA | Generador | Evaluaciones | Reportes |
|------|--------|-------------|-----------|-------------|----------|
| Domain | — | `AiAdvisor` port | `RandomDataGeneration` entity | `Assessment`, `EvaluationChallenge` | — (usa datos existentes) |
| Application | — (vive en worker) | `AnalyzeQueryUseCase` | `GenerateRandomDataUseCase` | `CreateAssessmentUseCase` | `GetStudentReportUseCase` |
| Infrastructure | `SqlRunnerService` | `OpenAiAdvisorService` | Implementación | `PostgresAssessmentRepo` | Queries agregadas |
| Presentation | — (no HTTP) | (opcional endpoint test) | `RandomDataController` | `AssessmentsController` | `ReportsController` |

**Archivo de referencia:**
- `.ai/ARCHITECTURE.md` — Mapa completo de capas
- `.ai/skills/clean-architecture.md` — Skill con checklist por capa

### ¿Dónde está cada capa en el sistema de archivos?

| Capa | Ruta base |
|------|-----------|
| Domain | `apps/api/src/domain/entities/`, `apps/api/src/domain/enums/`, `apps/api/src/domain/repositories/` |
| Application | `apps/api/src/application/use-cases/`, `apps/api/src/application/dtos/`, `apps/api/src/application/ports/` |
| Infrastructure | `apps/api/src/infrastructure/persistence/`, `apps/api/src/infrastructure/auth/`, `apps/api/src/infrastructure/queue/`, `apps/api/src/infrastructure/ai/` |
| Presentation | `apps/api/src/presentation/http/controllers/`, `apps/api/src/presentation/guards/`, `apps/api/src/presentation/modules/` |
| Worker | `apps/worker/src/evaluation.processor.ts`, `apps/worker/src/runner/` |

---

## Índice de archivos clave por módulo

### Runner SQL
| Archivo | Propósito |
|---------|-----------|
| `apps/worker/src/runner/sql-runner.service.ts` | Lógica del contenedor Docker |
| `apps/worker/src/runner/runner.module.ts` | Módulo NestJS del runner |
| `apps/worker/src/runner/sql-runner.service.spec.ts` | Tests del runner |

### Evaluador SQL / Worker
| Archivo | Propósito |
|---------|-----------|
| `apps/worker/src/evaluation.processor.ts` | Consumidor BullMQ, orquesta evaluación |
| `apps/worker/src/worker.module.ts` | Configuración del worker |
| `apps/api/src/domain/enums/submission-status.enum.ts` | Estados de submission |
| `apps/api/src/domain/entities/evaluation.entity.ts` | Entidad Evaluation |
| `apps/api/src/infrastructure/persistence/repositories/postgres-submission.repository.ts` | Actualización de estados |
| `1-documentation/architecture/03-queue-contract-sql-evaluation.md` | Contrato de cola |

### Asistente IA
| Archivo | Propósito |
|---------|-----------|
| `apps/api/src/application/ports/ai-advisor.port.ts` | Puerto/interfaz |
| `apps/api/src/infrastructure/ai/openai-advisor.service.ts` | Implementación OpenAI |
| `apps/api/src/infrastructure/ai/ai.module.ts` | Módulo NestJS |
| `apps/api/src/domain/entities/ai-recommendation.entity.ts` | Entidad de recomendación |
| `apps/worker/src/evaluation.processor.ts` | Integración con worker |

### Generador de datos
| Archivo | Propósito |
|---------|-----------|
| `apps/api/src/domain/entities/random-data-generation.entity.ts` | Configuración |
| `apps/api/src/application/use-cases/random-data/generate-random-data.use-case.ts` | Lógica |
| `apps/api/src/presentation/modules/random-data/random-data.controller.ts` | Endpoint |

### Evaluaciones
| Archivo | Propósito |
|---------|-----------|
| `apps/api/src/domain/entities/assessment.entity.ts` | Entidad Assessment |
| `apps/api/src/domain/entities/evaluation-challenge.entity.ts` | Relación evaluación-reto |
| `apps/api/src/application/use-cases/assessments/` | Casos de uso CRUD |
| `apps/api/src/presentation/modules/assessments/` | Controladores |

### Reportes
| Archivo | Propósito |
|---------|-----------|
| `apps/api/src/application/use-cases/reports/` | Casos de uso de reportes |
| `apps/api/src/presentation/modules/reports/reports.controller.ts` | Endpoints |

### Configuración e infraestructura
| Archivo | Propósito |
|---------|-----------|
| `infra/docker-compose.yml` | Servicios Docker |
| `infra/.env.example` | Variables de entorno |
| `apps/api/src/app.module.ts` | Módulo raíz |
| `apps/api/src/infrastructure/config/` | Configuración NestJS/TypeORM |
