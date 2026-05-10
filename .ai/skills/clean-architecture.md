# Skill: Mantener Clean Architecture al generar código

## Propósito

Garantizar que todo código nuevo respete la separación de capas del proyecto, evitando acoplamientos que degraden la arquitectura.

## El principio fundamental

```
Domain → independiente (no sabe nada del mundo exterior)
Application → solo conoce Domain y puertos (interfaces)
Infrastructure → implementa puertos, conoce Domain
Presentation → solo HTTP, delega en Application
```

## Checklist por capa

### Domain (`apps/api/src/domain/`)

¿Esto va en domain? Solo si:
- [ ] Representa una **regla de negocio** o **concepto del dominio**
- [ ] No importa nada de NestJS (`@nestjs/*`)
- [ ] No importa nada de TypeORM (`typeorm/*`, `@JoinColumn`, etc.)
- [ ] No sabe de HTTP, colas, ni infraestructura
- [ ] Es testeable sin base de datos ni servidor

✅ **Van en domain:** entidades, enums, value objects, interfaces de repositorio  
❌ **NO van en domain:** DTOs de entrada/salida, controladores, servicios de infraestructura

### Application (`apps/api/src/application/`)

¿Esto va en application? Solo si:
- [ ] Orquesta una **acción del sistema** (caso de uso)
- [ ] Depende de interfaces (puertos), no de implementaciones concretas
- [ ] Define DTOs específicos del caso de uso
- [ ] NO importa directamente de `infrastructure/`

✅ **Van en application:** use-cases, application DTOs, puertos (interfaces que implementa infra)  
❌ **NO van en application:** lógica HTTP, TypeORM queries, llamadas directas a Redis

### Infrastructure (`apps/api/src/infrastructure/`)

¿Esto va en infrastructure? Solo si:
- [ ] Implementa una interfaz definida en `domain/` o `application/`
- [ ] Contiene detalles técnicos (TypeORM, JWT, Redis, Docker, APIs externas)
- [ ] Puede cambiarse sin modificar reglas de negocio

✅ **Van en infrastructure:** TypeORM entities, Postgres repositories, JWT strategy, BullMQ adapter, AI service  
❌ **NO van en infrastructure:** reglas de negocio, lógica de validación de dominio

### Presentation (`apps/api/src/presentation/`)

¿Esto va en presentation? Solo si:
- [ ] Maneja HTTP (controladores, guards, decoradores, módulos NestJS)
- [ ] Convierte requests HTTP en llamadas a casos de uso
- [ ] NO contiene lógica de negocio

✅ **Van en presentation:** controllers, guards, decorators, NestJS modules, HTTP DTOs  
❌ **NO van en presentation:** implementaciones de repositorios, lógica de evaluación SQL

## Patrón de referencia: Crear un endpoint completo

```
1. Presentation: controller recibe HTTP request, llama al use-case
2. Application: use-case orquesta la acción, usa puertos
3. Domain: entidades si se necesitan nuevas reglas de negocio
4. Infrastructure: implementa puertos (persistencia, colas, etc.)
```

## Anti-patrones comunes (detectar y corregir)

| Anti-patrón | Problema | Solución |
|-------------|----------|----------|
| Controller llama a repositorio directo | Salta caso de uso, lógica duplicada | Mover a use-case |
| Use-case importa TypeORM | Acopla aplicación a infraestructura | Inyectar repositorio (interface) |
| Entidad de dominio decorada con @Entity() | Acopla dominio a TypeORM | Separar: dominio entity + TypeORM entity |
| DTO de infraestructura en controlador | Fuga de abstracción | Crear DTO específico para presentación |
| Lógica de negocio en el controlador | No testeable, difícil de mantener | Mover a use-case en application |
