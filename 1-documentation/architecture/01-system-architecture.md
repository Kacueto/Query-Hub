# Arquitectura del Sistema (Query-Hub)

Query-Hub sigue una arquitectura orientada a servicios estructurada en microservicios asíncronos para distribuir la carga de trabajo entre peticiones HTTP y tareas pesadas en segundo plano.

## Contenedores y Servicios Principales

1. **API (NestJS)**
   - **Responsabilidad principal:**  Es el punto de entrada de los usuarios. Expone endpoints REST, maneja autenticación, autorización, validación de reglas de negocio sobre usuarios, retos, cursos, etc. Encola tareas asíncronas pesadas (como validaciones de consultas SQL).
   - **Conectividad:** Se conecta a PostgreSQL y a Redis.

2. **PostgreSQL (RDBMS)**
   - **Responsabilidad principal:** Motor de almacenamiento persistente. Almacena las entidades del dominio: usuarios, cursos, evaluaciones, envíos, etc.

3. **Worker (NestJS)**
   - **Responsabilidad principal:** Sistema en segundo plano dedicado a consumir eventos de colas. No expone puertos HTTP y se enfoca 100% en procesar evaluaciones de consultas SQL con tests específicos, evitando bloquear a la API principal.
   - **Conectividad:** Se conecta primariamente a Redis para extraer tareas. (Eventualmente puede requerir conectarse a una DB si el resultado se persiste directo o emitir a otra cola).

4. **Redis**
   - **Responsabilidad principal:** Servidor en memoria que actúa principalmente como Message Broker (intermediario) utilizando la biblioteca [BullMQ](https://docs.nestjs.com/techniques/queues). Mantiene en el orden correcto los envíos de código que los alumnos realizan antes de que el Worker las evalúe.

## Relaciones

- **API ↔ Postgres:** La API se apoya en TypeORM para gestionar esquemas, realizar persistencia de información y realizar consultas síncronas para retornar datos al usuario.
- **API ↔ Redis:** La API es **Productora** de eventos; inserta trabajos (jobs) con un payload a evaluar en las colas gestionadas por Redis.
- **Worker ↔ Redis:** El Worker es **Consumidor** de eventos; escucha continuamente las colas administradas por Redis para procesar los trabajos a medida que entran.
