# Decisiones Arquitectónicas (ADR lite) — Query-Hub

## ADR-001: Clean Architecture con 4 capas

**Contexto:** Necesitamos una arquitectura que permita cambiar detalles técnicos (BD, framework, cola) sin afectar reglas de negocio.  
**Decisión:** Domain → Application → Infrastructure → Presentation.  
**Consecuencias:**
- Las entidades de dominio no dependen de NestJS ni TypeORM
- Los casos de uso son testeables sin infraestructura real
- Mayor cantidad de archivos (aprox. +30% vs estructura plana)
- **Regla estricta:** domain/ nunca importa de infrastructure/ o presentation/

## ADR-002: BullMQ sobre Redis vs RabbitMQ

**Contexto:** Necesitamos una cola de trabajos para procesamiento asíncrono de submissions.  
**Decisión:** BullMQ sobre Redis, en lugar de RabbitMQ o Kafka.  
**Razones:**
- Redis ya está en el stack (simplicidad operativa)
- BullMQ se integra nativamente con NestJS (`@nestjs/bullmq`)
- Menor overhead operativo que RabbitMQ
- Suficiente para el volumen esperado (MVP)
- **Riesgo:** Si el volumen crece mucho, BullMQ no escala tanto como Kafka

## ADR-003: Runner SQL con contenedores efímeros Docker

**Contexto:** Las consultas SQL de estudiantes no deben ejecutarse en la base de datos principal.  
**Decisión:** Cada evaluación crea un contenedor PostgreSQL temporal con `docker run --rm`.  
**Razones:**
- Aislamiento total: no puede contaminar datos reales
- Límites de recursos controlables (--memory, --cpus)
- Entorno reproducible: mismo schema + seed cada vez
- Se destruye automáticamente al terminar
- **Riesgo:** Latencia de ~1-2s por inicio de contenedor

## ADR-004: JWT con Passport vs sesiones

**Contexto:** Necesitamos autenticación stateless para la API REST.  
**Decisión:** JWT con estrategia Passport, no sesiones.  
**Razones:**
- Stateless: no requiere almacenamiento de sesión
- Fácil de consumir desde cualquier cliente
- Integración nativa con NestJS
- El guard `JwtAuthGuard` + `RolesGuard` proporciona control granular

## ADR-005: Cada app con su propio package.json (monorepo sin Nx)

**Contexto:** Tenemos API + Worker como apps separadas.  
**Decisión:** Monorepo plano sin Nx/Turborepo, cada app con su propio `package.json`.  
**Razones:**
- Simplicidad: no agregar otra herramienta al stack
- Cada app puede tener dependencias diferentes
- Workers no necesita dependencias HTTP
- Docker build separado por app
- **Riesgo:** Duplicación de dependencias compartidas (TypeScript, NestJS comunes)

## ADR-006: Asistente IA mediante puerto/adaptador

**Contexto:** El asistente inteligente debe ser obligatorio pero no queremos acoplarnos a un proveedor específico (OpenAI, Claude, etc.).  
**Decisión:** Definir una interfaz `AiAdvisor` como puerto en application/ports e implementarla en infrastructure/ai/.  
**Razones:**
- Podemos cambiar de proveedor sin tocar casos de uso
- Podemos tener múltiples implementaciones (OpenAI, Claude, reglas locales)
- Testeable: podemos mockear el advisor en tests
- El worker llama al advisor a través de la misma interfaz
