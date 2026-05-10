# Convención de Commits — Query-Hub

## Formato

```
tipo(alcance): mensaje en español o inglés

Ejemplos:
feat(submissions): agregar worker de evaluación SQL real
fix(auth): validar token expirado en JwtAuthGuard
refactor(challenges): extraer validación de schema a helper
test(courses): agregar tests de UpdateCourseUseCase
docs(api): documentar endpoint de submissions
chore(deps): actualizar bullmq a v5
```

## Tipos permitidos

| Tipo | Cuándo usarlo |
|------|--------------|
| `feat` | Nueva funcionalidad para el usuario final |
| `fix` | Corrección de bug |
| `refactor` | Cambio que no agrega feature ni corrige bug (mejora interna) |
| `test` | Agregar o modificar tests |
| `docs` | Documentación (README, API docs, .ai/) |
| `chore` | Mantenimiento (deps, configs, CI, Docker) |
| `style` | Formato, linting (sin cambio lógico) |

## Alcances usados en el proyecto

| Alcance | Carpeta que afecta |
|---------|-------------------|
| `auth` | Módulo de autenticación |
| `users` | Gestión de usuarios |
| `courses` | CRUD de cursos |
| `challenges` | CRUD de retos SQL |
| `submissions` | Envío y evaluación |
| `worker` | Worker de procesamiento |
| `runner` | Runner Docker (nuevo) |
| `ai` | Asistente inteligente (nuevo) |
| `api` | Varios módulos de la API |
| `infra` | Docker Compose, .env |
| `deps` | Dependencias/package.json |
| `docs` | Documentación |

## Reglas

- Commits pequeños y atómicos (un cambio lógico = un commit)
- No commits de 5 archivos no relacionados
- Un commit por feature, no 5 commits para un CRUD
- Los mensajes deben describir **qué** y **por qué**, no **cómo**
- Usar presente imperativo: "add" no "added" / "adds"
