# Gestión de Usuarios - API Query-Hub

---

## Endpoints de usuarios

### 1. Crear usuario

**Endpoint:** `POST /api/users`

**Rol requerido:** ADMIN

**Request:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@universidad.edu",
  "password": "contraseña123",
  "role": "STUDENT"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@universidad.edu",
  "role": "STUDENT"
}
```

**Errores:**
- `400 Bad Request`: Datos inválidos.
- `403 Forbidden`: No tienes permiso.

---

### 2. Listar usuarios

**Endpoint:** `GET /api/users`

**Rol requerido:** ADMIN

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@universidad.edu",
    "role": "STUDENT"
  },
  {
    "id": 2,
    "nombre": "María García",
    "email": "maria@universidad.edu",
    "role": "PROFESSOR"
  }
]
```

---

### 3. Obtener usuario por ID

**Endpoint:** `GET /api/users/:id`

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@universidad.edu",
  "role": "STUDENT"
}
```

**Errores:**
- `404 Not Found`: Usuario no encontrado.

---

### 4. Eliminar usuario

**Endpoint:** `DELETE /api/users/:id`

**Rol requerido:** ADMIN

**Response (200 OK):**
```json
{
  "message": "Usuario eliminado exitosamente",
  "deletedUserId": 1
}
```

**Errores:**
- `403 Forbidden`: No tienes permiso.
- `404 Not Found`: Usuario no encontrado.

---

## Roles disponibles

- `ADMIN`: Administrador del sistema.
- `PROFESSOR`: Profesor / Instructor.
- `STUDENT`: Estudiante.
