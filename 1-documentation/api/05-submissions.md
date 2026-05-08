# Envío y Evaluación de Soluciones - API Query-Hub

---

## Endpoints de submissions

### 1. Enviar solución SQL

**Endpoint:** `POST /api/submissions`

**Rol requerido:** STUDENT (implícito, usa el token JWT)

**Request:**
```json
{
  "studentId": 5,
  "challengeId": 1,
  "code": "SELECT c.name, COUNT(o.id) AS total_orders FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.name HAVING COUNT(o.id) > 3;"
}
```

**Response (201 Created):**
```json
{
  "id": 1001,
  "studentId": 5,
  "challengeId": 1,
  "status": "QUEUED",
  "createdAt": "2026-05-08T14:30:00Z"
}
```

**Errores:**
- `400 Bad Request`: Código SQL inválido.
- `404 Not Found`: Reto no encontrado.

---

### 2. Consultar estado de una submission

**Endpoint:** `GET /api/submissions/:id`

**Response (200 OK) - Pendiente:**
```json
{
  "id": 1001,
  "studentId": 5,
  "challengeId": 1,
  "status": "QUEUED",
  "createdAt": "2026-05-08T14:30:00Z"
}
```

**Response (200 OK) - Completada:**
```json
{
  "id": 1001,
  "studentId": 5,
  "challengeId": 1,
  "status": "ACCEPTED",
  "executionTimeMs": 120,
  "score": 100,
  "result": "5 rows returned",
  "feedback": "Consulta correcta. Considera usar un índice en customers.city para mejorar rendimiento.",
  "createdAt": "2026-05-08T14:30:00Z"
}
```

---

### 3. Listar submissions de un estudiante

**Endpoint:** `GET /api/submissions/student/:studentId`

**Response (200 OK):**
```json
[
  {
    "id": 1001,
    "studentId": 5,
    "challengeId": 1,
    "status": "ACCEPTED",
    "score": 100
  },
  {
    "id": 1002,
    "studentId": 5,
    "challengeId": 2,
    "status": "QUEUED"
  }
]
```

---

### 4. Listar submissions de un reto

**Endpoint:** `GET /api/submissions/challenge/:challengeId`

**Rol requerido:** PROFESSOR (para ver todas las submissions del reto)

**Response (200 OK):**
```json
[
  {
    "id": 1001,
    "studentId": 5,
    "challengeId": 1,
    "status": "ACCEPTED",
    "score": 100
  },
  {
    "id": 1003,
    "studentId": 7,
    "challengeId": 1,
    "status": "WRONG_ANSWER",
    "score": 0
  }
]
```

---

## Estados de submission

| Estado | Significado |
|--------|------------|
| `QUEUED` | En espera de evaluación. |
| `RUNNING` | Evaluándose en el worker. |
| `ACCEPTED` | Resultado correcto. |
| `WRONG_ANSWER` | Resultado no coincide. |
| `SYNTAX_ERROR` | Error en la sintaxis SQL. |
| `TIME_LIMIT_EXCEEDED` | Superó el tiempo máximo. |
| `RUNTIME_ERROR` | Error durante la ejecución. |

---

## Estructura de evaluación result

```json
{
  "status": "ACCEPTED",
  "executionTimeMs": 120,
  "score": 100,
  "result": "5 rows returned",
  "feedback": "Consulta correcta con buen rendimiento.",
  "testsPassed": 2,
  "testsFailed": 0
}
```

---

## Flujo de evaluación

1. Estudiante envía `POST /api/submissions` con el código SQL.
2. API crea submission con estado `QUEUED`.
3. API encola el trabajo en Redis.
4. Worker consume el trabajo.
5. Runner prepara ambiente temporal con esquema y datos.
6. Runner ejecuta la consulta del estudiante.
7. Se comparan resultados.
8. Se calcula el puntaje.
9. Se actualiza el status de la submission.
10. Estudiante consulta `GET /api/submissions/:id` para ver resultados.
