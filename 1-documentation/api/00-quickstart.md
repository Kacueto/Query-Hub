# Quick Start - API Query-Hub

Guía rápida para las primeras pruebas de la plataforma.

---

## 1. Levanta los servicios con Docker

```bash
cd infra
docker compose up --build
```

Espera a que todos los contenedores estén listos. La API estará en `http://localhost:3000`.

---

## 2. Accede al Swagger

Abre en el navegador: **<http://localhost:3000/api/docs>**

Aquí puedes probar todos los endpoints interactivamente.

---

## 3. Crea un usuario ADMIN

**Endpoint:** `POST /api/users`

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

Respuesta:
```json
{
  "id": 1,
  "nombre": "Admin",
  "email": "admin@test.com",
  "role": "ADMIN"
}
```

---

## 4. Crea un usuario PROFESSOR

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Profesor",
    "email": "profesor@test.com",
    "password": "prof123",
    "role": "PROFESSOR"
  }'
```

---

## 5. Login con el profesor

**Endpoint:** `POST /api/auth/login`

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "profesor@test.com",
    "password": "prof123"
  }'
```

Respuesta:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Guarda el token para usarlo en las próximas peticiones.

---

## 6. Crea un curso (con el token del profesor)

**Endpoint:** `POST /api/courses`

```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN>" \
  -d '{
    "name": "Bases de Datos II",
    "code": "BD2-2026",
    "period": "2026-1",
    "professorId": 2
  }'
```

Respuesta:
```json
{
  "id": 1,
  "name": "Bases de Datos II",
  "code": "BD2-2026",
  "period": "2026-1",
  "professorId": 2
}
```

---

## 7. Crea un reto SQL

**Endpoint:** `POST /api/challenges`

```bash
curl -X POST http://localhost:3000/api/challenges \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN>" \
  -d '{
    "title": "Clientes con más de 3 compras",
    "description": "Escribe una consulta que retorne clientes con más de 3 órdenes",
    "difficulty": "MEDIUM",
    "tags": ["SELECT", "JOIN", "GROUP BY"],
    "databaseEngine": "postgresql",
    "timeLimit": 5000,
    "courseId": 1,
    "createdBy": 2
  }'
```

---

## 8. Carga el esquema del reto

**Endpoint:** `POST /api/challenges/:id/schema`

```bash
curl -X POST http://localhost:3000/api/challenges/1/schema \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN>" \
  -d '{
    "schemaSql": "CREATE TABLE customers (id INT PRIMARY KEY, name VARCHAR(100)); CREATE TABLE orders (id INT, customer_id INT, total DECIMAL(10,2));"
  }'
```

---

## 9. Carga datos de prueba

**Endpoint:** `POST /api/challenges/:id/seed`

```bash
curl -X POST http://localhost:3000/api/challenges/1/seed \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TU_TOKEN>" \
  -d '{
    "seedSql": "INSERT INTO customers VALUES (1, '\''Ana'\''); INSERT INTO customers VALUES (2, '\''Carlos'\''); INSERT INTO orders VALUES (1, 1, 150000); INSERT INTO orders VALUES (2, 1, 200000); INSERT INTO orders VALUES (3, 1, 180000); INSERT INTO orders VALUES (4, 2, 90000);"
  }'
```

---

## 10. Publica el reto

**Endpoint:** `PATCH /api/challenges/:id/publish`

```bash
curl -X PATCH http://localhost:3000/api/challenges/1/publish \
  -H "Authorization: Bearer <TU_TOKEN>"
```

---

## 11. Crea un estudiante

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Estudiante",
    "email": "estudiante@test.com",
    "password": "est123",
    "role": "STUDENT"
  }'
```

---

## 12. Login con el estudiante

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "estudiante@test.com",
    "password": "est123"
  }'
```

Guarda el token del estudiante.

---

## 13. Envía una solución SQL

**Endpoint:** `POST /api/submissions`

```bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_ESTUDIANTE>" \
  -d '{
    "studentId": 3,
    "challengeId": 1,
    "code": "SELECT c.name, COUNT(o.id) FROM customers c LEFT JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name HAVING COUNT(o.id) > 3;"
  }'
```

Respuesta:
```json
{
  "id": 1001,
  "studentId": 3,
  "challengeId": 1,
  "status": "QUEUED",
  "createdAt": "2026-05-08T14:30:00Z"
}
```

---

## 14. Consulta el estado de la submission

**Endpoint:** `GET /api/submissions/:id`

```bash
curl -X GET http://localhost:3000/api/submissions/1001 \
  -H "Authorization: Bearer <TOKEN_ESTUDIANTE>"
```

---

## Variables de entorno clave

En `infra/.env`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme
POSTGRES_DB=queryhub
REDIS_HOST=redis
REDIS_PORT=6379
PORT=3000
JWT_SECRET=change_this_secret
```

---

## Documentación detallada de endpoints

- [Autenticación](01-authentication.md)
- [Usuarios](02-users.md)
- [Cursos](03-courses.md)
- [Retos SQL](04-challenges.md)
- [Submissions](05-submissions.md)
