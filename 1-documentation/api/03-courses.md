# Gestión de Cursos - API Query-Hub

---

## Endpoints de cursos

### 1. Crear curso

**Endpoint:** `POST /api/courses`

**Rol requerido:** PROFESSOR

**Request:**
```json
{
  "name": "Bases de Datos II",
  "code": "BD2-2026",
  "period": "2026-1",
  "professorId": 1
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Bases de Datos II",
  "code": "BD2-2026",
  "period": "2026-1",
  "professorId": 1,
  "createdAt": "2026-05-08T12:00:00Z"
}
```

---

### 2. Listar cursos

**Endpoint:** `GET /api/courses`

**Roles soportados:**
- `STUDENT`: Ve solo los cursos en los que está inscrito.
- `PROFESSOR`: Ve todos sus cursos.
- `ADMIN`: Ve todos los cursos.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Bases de Datos II",
    "code": "BD2-2026",
    "period": "2026-1",
    "professorId": 1
  }
]
```

---

### 3. Obtener curso por ID

**Endpoint:** `GET /api/courses/:id`

**Rol requerido:** PROFESSOR o ADMIN

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Bases de Datos II",
  "code": "BD2-2026",
  "period": "2026-1",
  "professorId": 1
}
```

---

### 4. Actualizar curso

**Endpoint:** `PATCH /api/courses/:id`

**Rol requerido:** PROFESSOR

**Request:**
```json
{
  "name": "Bases de Datos II - Ciclo 2",
  "code": "BD2-2026-2"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Bases de Datos II - Ciclo 2",
  "code": "BD2-2026-2",
  "period": "2026-1",
  "professorId": 1
}
```

---

### 5. Eliminar curso

**Endpoint:** `DELETE /api/courses/:id`

**Rol requerido:** PROFESSOR

**Response (200 OK):**
```json
{
  "message": "Curso eliminado",
  "deletedCourseId": 1
}
```

---

## Estructura de un curso

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | ID único del curso. |
| `name` | string | Nombre del curso. |
| `code` | string | Código o NRC del curso. |
| `period` | string | Periodo académico (ej: "2026-1"). |
| `professorId` | number | ID del profesor responsable. |
| `createdAt` | date | Fecha de creación. |
