# Autenticación - API Query-Hub

## Descripción general

La plataforma usa **JWT (JSON Web Tokens)** para autenticación. El usuario se autentica con email y contraseña, recibe un token JWT y lo envía en cada petición protegida.

---

## Endpoints de autenticación

### 1. Login

**Endpoint:** `POST /api/auth/login`

**Descripción:** Autenticar usuario y obtener token JWT.

**Request:**
```json
{
  "email": "profesor@universidad.edu",
  "password": "contraseña123"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `401 Unauthorized`: Email o contraseña inválidos.

---

## Uso del token

**Header requerido:**
```
Authorization: Bearer <accessToken>
```

**Ejemplo con curl:**
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Roles y permisos

La plataforma tiene tres roles principales:

| Rol | Permisos |
|-----|----------|
| **ADMIN** | Gestionar usuarios, profesores, cursos. |
| **PROFESSOR** | Crear cursos, retos, evaluaciones. Revisar resultados. |
| **STUDENT** | Ver cursos inscritos, consultar retos, enviar soluciones. |

Cada endpoint puede estar protegido por rol. Se usará el decorador `@Roles(Role.PROFESSOR)` para indicar qué rol es requerido.

---

## Notas de seguridad

- El token expira después de 24 horas (configurable).
- Siempre envía el token en HTTPS en producción.
- No almacenes el token en localStorage sin encriptación.
- El token contiene información del usuario (id, rol, email).
