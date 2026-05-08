# Gestión de Retos SQL - API Query-Hub

---

## Endpoints de retos

### 1. Crear reto

**Endpoint:** `POST /api/challenges`

**Rol requerido:** PROFESSOR

**Request:**
```json
{
  "title": "Clientes con más de 3 compras",
  "description": "Escribe una consulta que retorne los clientes con más de 3 compras",
  "difficulty": "MEDIUM",
  "tags": ["SELECT", "JOIN", "GROUP BY"],
  "databaseEngine": "postgresql",
  "timeLimit": 5000,
  "courseId": 1,
  "createdBy": 1
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Clientes con más de 3 compras",
  "status": "DRAFT",
  "courseId": 1,
  "createdAt": "2026-05-08T12:00:00Z"
}
```

---

### 2. Listar retos

**Endpoint:** `GET /api/challenges?courseId=1&status=PUBLISHED`

**Query parameters:**
- `courseId`: Filtrar por curso (opcional).
- `status`: Filtrar por estado (DRAFT, PUBLISHED, ARCHIVED).
- `difficulty`: Filtrar por dificultad (EASY, MEDIUM, HARD).

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Clientes con más de 3 compras",
    "difficulty": "MEDIUM",
    "status": "PUBLISHED",
    "courseId": 1
  }
]
```

---

### 3. Obtener reto por ID

**Endpoint:** `GET /api/challenges/:id`

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Clientes con más de 3 compras",
  "description": "Escribe una consulta...",
  "difficulty": "MEDIUM",
  "status": "PUBLISHED",
  "databaseEngine": "postgresql",
  "timeLimit": 5000,
  "courseId": 1,
  "createdBy": 1
}
```

---

### 4. Actualizar reto

**Endpoint:** `PATCH /api/challenges/:id`

**Rol requerido:** PROFESSOR

**Request:**
```json
{
  "title": "Clientes con más de 3 compras (actualizado)",
  "description": "Nueva descripción"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Clientes con más de 3 compras (actualizado)",
  "status": "DRAFT"
}
```

---

### 5. Publicar reto

**Endpoint:** `PATCH /api/challenges/:id/publish`

**Rol requerido:** PROFESSOR

**Descripción:** Cambia estado de DRAFT a PUBLISHED.

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "PUBLISHED"
}
```

---

### 6. Cargar esquema SQL

**Endpoint:** `POST /api/challenges/:id/schema`

**Rol requerido:** PROFESSOR

**Request:**
```json
{
  "schemaSql": "CREATE TABLE customers (id INT PRIMARY KEY, name VARCHAR(100)); CREATE TABLE orders (id INT, customer_id INT, total DECIMAL(10,2));"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "schemaId": 5
}
```

---

### 7. Cargar datos semilla

**Endpoint:** `POST /api/challenges/:id/seed`

**Rol requerido:** PROFESSOR

**Request:**
```json
{
  "seedSql": "INSERT INTO customers VALUES (1, 'Ana'); INSERT INTO orders VALUES (1, 1, 150000);"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "seedId": 3
}
```

---

### 8. Eliminar reto

**Endpoint:** `DELETE /api/challenges/:id`

**Rol requerido:** PROFESSOR

**Response (200 OK):**
```json
{
  "message": "Reto eliminado",
  "deletedChallengeId": 1
}
```

---

## Estados de reto

| Estado | Significado |
|--------|------------|
| `DRAFT` | En construcción, no visible para estudiantes. |
| `PUBLISHED` | Disponible para estudiantes. |
| `ARCHIVED` | Ya no está disponible. |

## Dificultades

- `EASY`
- `MEDIUM`
- `HARD`
