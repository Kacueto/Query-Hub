# Skill: Analizar impacto de cambios

## Propósito

Antes de escribir código, evaluar el alcance del cambio para evitar roturas inesperadas y coordinar con el equipo.

## Cuándo aplicar

- El cambio involucra 3+ archivos
- El cambio toca un **archivo de coordinación** (ver `MODULE_MAP.md`)
- El cambio agrega una dependencia nueva
- El cambio modifica el contrato de una cola, BD o API
- No estás seguro de qué módulos se verían afectados

## Proceso

### 1. Identificar el punto de entrada
¿Dónde empieza el cambio? Ej: un nuevo endpoint, un nuevo caso de uso, un nuevo worker.

### 2. Trazar las capas afectadas
Para cada cambio, preguntar:
```
┌─ Presentation ─────────────────────┐
│  ¿Nuevo controlador? ¿Nuevo DTO?   │
│  ¿Nuevo módulo NestJS?             │
├─ Application ──────────────────────┤
│  ¿Nuevo caso de uso? ¿Nuevo DTO?   │
│  ¿Nuevo puerto/interface?          │
├─ Domain ───────────────────────────┤
│  ¿Nueva entidad? ¿Nuevo enum?      │
│  ¿Nuevo repository interface?      │
├─ Infrastructure ───────────────────┤
│  ¿Nueva implementación de repo?    │
│  ¿Nuevo adaptador (cola, AI, etc)? │
└────────────────────────────────────┘
```

### 3. Identificar dependencias entre módulos
```
¿Este cambio afecta a...
  □ Auth/Users?      (coordinar con Darlen)
  □ Courses?         (coordinar con Kevin C)
  □ Challenges?      (coordinar con Sebastian)
  □ Worker/Runner?   (coordinar con Kevin R)
  □ Infra/Docker?    (coordinar con Carlos)
```

### 4. Evaluar riesgo de regresión
- **Alto**: cambios en `app.module.ts`, `docker-compose.yml`, repositorios compartidos
- **Medio**: cambios en entidades de dominio usadas por varios módulos
- **Bajo**: cambios aislados en un controlador o caso de uso nuevo

### 5. Decidir estrategia
| Si el impacto es... | Entonces... |
|--------------------|------------|
| 1-2 archivos, capa aislada | Implementar directamente |
| 3+ archivos, misma capa | Implementar pero agrupar commits |
| 3+ archivos, múltiples capas | Proponer plan antes de codificar |
| Toca archivo de coordinación | Implementar y notificar al equipo |

## Ejemplo aplicado: "Agregar asistente IA"

```
1. Punto de entrada: nuevo módulo AI Advisor
2. Capas afectadas:
   - Domain: nueva interface AiAdvisor (port)
   - Application: nuevo puerto + caso de uso AnalyzeQueryUseCase
   - Infrastructure: OpenAiAdvisorService (implementación)
   - Worker: llamar al advisor después de evaluar
3. Dependencias: Worker + API (dos apps)
4. Riesgo: Medio (nuevo módulo, no toca existentes)
5. Estrategia: Proponer plan → implementar en rama separada
```
