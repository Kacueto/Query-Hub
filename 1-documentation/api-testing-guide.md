# Guía de Pruebas de la API (Swagger)

Esta guía define el paso a paso para levantar la infraestructura local y probar el flujo completo de la plataforma desde la interfaz interactiva de Swagger.

## Fase 1: Levantar el proyecto (Despliegue local)

Al contar con configuración mediante Docker, puedes levantar todos los servicios de una vez:

1. Abre una terminal en la ruta principal del proyecto.
2. Entra a la carpeta de infraestructura:
   ```bash
   cd infra
   ```
3. Levanta los servicios (Postgres, Redis, API y Worker):
   ```bash
   docker-compose up -d
   ```
   *(Si realizas cambios en el código de la API o Worker, añade `--build` para regenerar la imagen: `docker-compose up -d --build`)*

**Acceso a Swagger:** Abre tu navegador y dirígete a `http://localhost:3000/api/docs`.

---

## Fase 2: Entorno Administrativo (Rol `ADMIN`)

El administrador se encarga de crear las cuentas del personal docente y los estudiantes.

1. **Obtener el token (Login)**
   - En Swagger, dirígete a `POST /api/auth/login`.
   - Haz clic en **Try it out** y envía las credenciales maestras:
     ```json
     {
       "email": "admin@ai.com",
       "password": "password123"
     }
     ```
   - Copia el texto devuelto en el campo `accessToken`.
   - Sube al botón superior verde **Authorize**, pega tu token y dale a "Authorize".

2. **Crear Profesor**
   - Dirígete a `POST /api/users`.
   - Envía el siguiente JSON:
     ```json
     {
       "nombre": "Profesor de BD",
       "email": "profe@ai.com",
       "password": "password123",
       "role": "PROFESSOR"
     }
     ```
   - Anota el `id` asignado al profesor en la respuesta (por ejemplo, `3`).

3. **Crear Estudiante**
   - En el mismo endpoint `POST /api/users`, envía:
     ```json
     {
       "nombre": "Estudiante",
       "email": "estudiante@ai.com",
       "password": "password123",
       "role": "STUDENT"
     }
     ```
   - Anota el `id` derivado del estudiante (por ejemplo, `4`).

---

## Fase 3: Entorno Docente (Rol `PROFESSOR`)

Los profesores gestionan sus Cursos y publican Retos (Challenges) con esquemas y seeds (datos de prueba).

1. **Cambio de Sesión**
   - Ve al botón superior "Authorize", haz **Logout** y genera un nuevo token en `POST /api/auth/login` con:
     ```json
     {
       "email": "profe@ai.com",
       "password": "password123"
     }
     ```
   - Coloca el nuevo token del profesor en el candado de "Authorize".

2. **Crear Curso (`POST /api/courses`)**
   - Rellena el ID del profesor (`profesorResponsableId`) obtenido en la Fase 2:
     ```json
     {
       "nombre": "Bases de Datos I",
       "descripcion": "Consultas avanzadas",
       "codigoNrc": "BD-101",
       "periodoAcademico": "2026-1",
       "profesorResponsableId": 3
     }
     ```

3. **Crear Reto (`POST /api/challenges`)**
   - Crea un ejercicio de prueba asignado al curso:
     ```json
     {
       "title": "Crear tabla de Mascotas",
       "description": "Debes crear una tabla Pets con columnas id y nombre.",
       "difficulty": "EASY",
       "timeLimitMinutes": 10,
       "courseId": 1
     }
     ```
   - Obtendrás un reto en estado `DRAFT`. Anota su `id` (por ejemplo, `1`).

4. **Definir Entorno del Reto (`POST /api/challenges/{id}/schema` y `{id}/seed`)**
   - En el endpoint `/schema`, especifica el `id` del reto (ej. 1) y define qué SQL prepara el ejercicio:
     ```json
     { "sqlScript": "CREATE TABLE Pets (id INT, nombre VARCHAR(50));" }
     ```

5. **Publicar el Reto (`PATCH /api/challenges/{id}/publish`)**
   - Haz ejecutar sobre el id de tu reto para publicarlo a los estudiantes. Su estado pasará a `PUBLISHED`.

---

## Fase 4: Entorno del Alumno (Rol `STUDENT`)

Por último, el alumno consulta sus obligaciones y envía su solución.

1. **Cambio de Sesión**
   - Haz "Logout" y obtén un token ahora para el estudiante en `POST /api/auth/login`:
     ```json
     {
       "email": "estudiante@ai.com",
       "password": "password123"
     }
     ```
   - Autoriza tu sesión en Swagger con este token.

2. **Listar Retos Activos (`GET /api/challenges`)**
   - Pulsa "Execute" para obtener los detalles de los retos disponibles y leer las instrucciones.

3. **Resolver el Reto (`POST /api/submissions`)**
   - Envía tu tarea usando el `challengeId` del profesor y tu `userId` (por ejemplo, el 4 obtenido en la Fase 2):
     ```json
     {
       "challengeId": 1,
       "userId": 4,
       "sqlQuery": "CREATE TABLE Pets (id INT, nombre VARCHAR(50));"
     }
     ```
   - El Worker interceptará esta petición para ser procesada en la cola de RabbitMQ/Redis.