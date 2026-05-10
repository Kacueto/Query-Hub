# Glosario de Dominio — Query-Hub (Lenguaje Ubicuo)

## Entidades principales

| Término | Definición | Archivo | Atributos clave |
|---------|-----------|---------|-----------------|
| **User** | Persona del sistema (admin, profesor, estudiante) | `domain/entities/user.entity.ts` | id, nombre, email, password, role |
| **Course** | Curso académico con profesor responsable | `domain/entities/course.entity.ts` | id, nombre, codigoNrc, periodoAcademico, profesorResponsableId |
| **Challenge** | Reto SQL que los estudiantes deben resolver | `domain/entities/challenge.entity.ts` | id, title, description, difficulty, status, tags, databaseEngine, timeLimit, courseId, createdBy |
| **Submission** | Envío de solución SQL por un estudiante | `domain/entities/submission.entity.ts` | id, studentId, challengeId, evaluationId (nullable), engine, querySql, status, createdAt |
| **Schema** | DDL del esquema de base de datos del reto | `domain/entities/schema.entity.ts` | id, challengeId, nombre, ddlSql, createdAt |
| **Test** | Caso de prueba dentro de una evaluación | `domain/entities/test.entity.ts` | id, assessmentId, nombre, status, mensaje, peso |
| **Evaluation** | Evaluación o parcial que agrupa retos | `domain/entities/evaluation.entity.ts` | id, courseId, nombre, descripcion, fechaApertura, fechaCierre, createdAt |
| **Assessment** | Resultado de evaluar una submission individual (contiene nota, tiempos, desglose) | `domain/entities/assessment.entity.ts` | id, submissionId, status, score, executionTimeMs, resultadoCorrectoPct, tiempoEjecucionPct, usoSqlPct, claridadPct, mejoraPosteriorPct, createdAt |
| **Enrollment** | Inscripción de estudiante en un curso | `domain/entities/enrollment.entity.ts` | studentId, courseId, enrolledAt |
| **EvaluationChallenge** | Relación entre evaluation y retos incluidos | `domain/entities/evaluation-challenge.entity.ts` | evaluationId, challengeId |
| **AI Recommendation** | Recomendación generada por IA (análisis de la consulta) | `domain/entities/ai-recommendation.entity.ts` | id, submissionId, explanation, suggestedQuery, createdAt |
| **RandomDataGeneration** | Configuración para generar datos de prueba | `domain/entities/random-data-generation.entity.ts` | id, challengeId, registrosPorTabla[], rangoFechas, minNumeric, maxNumeric, textValueLists, nullPercentage, edgeCases, createdAt |

## Enums

| Enum | Valores | Archivo |
|------|---------|---------|
| **Role** | `ADMIN`, `PROFESSOR`, `STUDENT` | `domain/enums/role.enum.ts` |
| **ChallengeStatus** | `DRAFT`, `PUBLISHED`, `ARCHIVED` | `domain/enums/challenge-status.enum.ts` |
| **ChallengeDifficulty** | `EASY`, `MEDIUM`, `HARD` | `domain/enums/challenge-difficulty.enum.ts` |
| **SubmissionStatus** | `QUEUED`, `RUNNING`, `ACCEPTED`, `WRONG_ANSWER`, `SYNTAX_ERROR`, `TIME_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `OPTIMIZATION_REQUIRED` | `domain/enums/submission-status.enum.ts` |

## Repositorios (interfaces de dominio)

| Interfaz | Métodos principales | Implementación |
|----------|-------------------|----------------|
| `UserRepository` | findById, findByEmail, findAll, save, delete | `PostgresUserRepository` |
| `CourseRepository` | findAll, findById, findByProfessor, findByStudent, save, update, delete | `PostgresCourseRepository` |
| `ChallengeRepository` | findById, findByCourse, findPublishedByCourse, findAll(filters?), save, update, delete | `PostgresChallengeRepository` |
| `SubmissionRepository` | findById, findByStudent, findByChallenge, countByStudentAndEvaluation, findBestScoreByStudentAndChallenge, save, updateStatus | `PostgresSubmissionRepository` |
| `AssessmentRepository` | findBySubmission, save, updateMejoraPosterior | `PostgresAssessmentRepository` |

## Puertos de aplicación (interfaces que implementa infraestructura)

| Puerto | Método | Implementación | Propósito |
|--------|--------|---------------|-----------|
| `TokenGenerator` | generate(payload) | `NestJwtTokenGeneratorService` | Generar JWT |
| `SubmissionQueue` | publish(job) | `BullSubmissionQueueAdapter` | Encolar submission para evaluación asíncrona |
| `SqlRunner` | evaluate(payload) | `DockerSqlRunnerService` (por implementar) | Ejecutar SQL en contenedor Docker aislado |
| `AiAdvisor` | analyze(query, schema) | `OpenAiAdvisorService` (por implementar) | Recomendaciones de optimización SQL |
