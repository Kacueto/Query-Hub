# Componentes (API y Worker)

El desarrollo del proyecto está basado en una Arquitectura Limpia organizada en capas.

## Estructura por Capas
Dentro del sistema, el código de los módulos respeta (en su gran mayoría) esta separación lógica:

- **Dominio (`domain/`)**: Contiene las reglas del negocio, entidades e interfaces de propósito global en el proyecto. 
  *Ejemplo:* `User`, `Challenge`, `Course`, `Submission`.
- **Aplicación (`application/`)**: Define los Casos de Uso del sistema, actuando como orquestador de reglas del negocio, usando los adaptadores que vengan inyectados.
- **Presentación (`presentation/`)**: Contiene los Controladores (API HTTP), los DTOs para la comunicación web o los manejadores de colas, los Guards de seguridad, etc.
- **Infraestructura (`infrastructure/`)**: Implementa la persistencia real (TypeORM Entities, PostgreSQL Repositories, configuración de colas, encriptación, etc.).

## Aplicación Principal: API

En `apps/api/src`, estos son los principales módulos de componentes detectados:

- **AuthModule**: Gestiona la seguridad perimetral de la aplicación, el inicio de sesión y la generación de JSON Web Tokens (JWT).
- **UsersModule**: Responsable de la obtención y gestión de perfiles de usuario, roles y su persistencia subyacente de TypeORM.
- **CoursesModule**: Maneja la lógica de dominio en cuanto a la creación, inscripción o revisión de Cursos del sistema.
- **ChallengesModule**: Controla el ciclo de vida de un Reto o Ejercicio SQL, vinculando la definición esperada del Challenge y su esquema.
- **SubmissionsModule**: Maneja los eventos desencadenados cada vez que un estudiante envía su código ("Submission"). Desde aquí se conectará muy probablemente a la cola de BullMQ.
- **SchemasModule**: Lógica auxiliar sobre los esquemas de bases de datos que usarán las resoluciones.

La API se apoya transversalmente en **ConfigModule** para las variables de entorno, y en **TypeOrmModule** para vincular la base de datos principal.

## Aplicación Secundaria: Worker

En `apps/worker/src` tenemos el procesamiento silencioso y desacoplado, sus componentes son:

- **WorkerModule**: Estructura de anidación principal. Es minimalista al no poseer controladores HTTP.
- **EvaluationProcessor**: Es el componente fundamental del worker (actualmente un stub/esbozo). Su rol es el de un *Consumidor* de la cola (marcado con un nombre específico, por ejemplo `'sql-evaluation'`). Escucha los nuevos IDs y sentencias para validarlas contra motores o tests. Tras su ejecución, actualizará el estado respectivo al servicio correspondiente.