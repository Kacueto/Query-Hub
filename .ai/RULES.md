# Reglas de comportamiento para IAs — Query-Hub

## Idioma
- **Conversación**: español
- **Código**: inglés (variables, funciones, clases, types)
- **Commits**: español o inglés consistente, formato convencional `tipo: mensaje`
- **Documentación nueva**: español (el proyecto está en español)

## Stack principal (ver `.ai/TECH_STACK.md` para versiones exactas)
- NestJS + TypeScript + TypeORM + PostgreSQL + Redis + BullMQ + Docker
- Cada app tiene su propio `package.json`: `apps/api/` y `apps/worker/`

## Antes de generar código

1. **Lee `.ai/MODULE_MAP.md`** — entiende qué módulos existen, quién es responsable, qué entregables faltan.
2. **Revisa `.ai/ARCHITECTURE.md`** — entender las capas es obligatorio antes de tocar cualquier archivo.
3. **Consulta `.ai/FINAL_DELIVERY.md`** — si el cambio aporta a un entregable de la entrega final, priorízalo.
4. **Busca en `1-documentation/`** — si ya hay documentación de lo que se pide, úsala como referencia.

## Al generar código

- **Respeta Clean Architecture** (ver `.ai/skills/clean-architecture.md`):
  - `domain/` → nunca importa de `infrastructure` o `presentation`
  - `application/` → depende de `domain/` y puertos (interfaces), nunca de `infrastructure/`
  - `infrastructure/` → implementa puertos definidos en `application/`
  - `presentation/` → solo HTTP, delega en use-cases
- **Un archivo = una responsabilidad principal**. No mezclar entidades con controladores, ni use-cases con lógica HTTP.
- **Casos de uso NO conocen Express/NestJS**. Reciben DTOs, no `Request`/`Response`.
- **Usar inyección de dependencias** (constructor `private readonly`) sobre `new` manual.
- **Seguir el naming del proyecto**: `*.use-case.ts`, `*.repository.ts`, `*.controller.ts`, `*.module.ts`.
- **Tests**: ubicar junto al archivo fuente con sufijo `.spec.ts`.

## Sobre el alcance del cambio

- Si el cambio toca **más de 3 archivos**, proponer un plan antes de escribir código.
- Si el cambio afecta **archivos de coordinación** (ver `MODULE_MAP.md`), mencionarlo explícitamente.
- Si hay duda sobre una decisión arquitectónica, **preguntar antes de implementar**.

## Lo que NO debe hacer la IA

- No modificar `infra/.env` (solo `infra/.env.example`)
- No regenerar `package-lock.json` sin necesidad
- No borrar archivos sin confirmación explícita
- No asumir puertos/rutas que no estén documentados en `1-documentation/` o el README
- No instalar dependencias sin avisar (pueden romper Docker builds)
- No modificar `docker-compose.yml` sin coordinación (afecta a todo el equipo)
