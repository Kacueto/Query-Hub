# Stack Tecnológico — Query-Hub

## Lenguaje y runtime
| Herramienta | Versión | Notas |
|------------|---------|-------|
| Node.js | 18+ (LTS) | Usar 18 o 20 |
| TypeScript | 5.x | Strict mode habilitado |
| npm | 9+ | Cada app tiene su propio `package.json` |

## Backend
| Herramienta | Versión | Propósito |
|------------|---------|-----------|
| NestJS | ~10.x | Framework principal de API y Worker |
| TypeORM | ~0.3.x | ORM para PostgreSQL |
| class-validator | ~0.14.x | Validación de DTOs |
| class-transformer | ~0.5.x | Transformación de DTOs |
| @nestjs/swagger | ~7.x | Documentación OpenAPI/Swagger |

## Base de datos
| Herramienta | Versión | Propósito |
|------------|---------|-----------|
| PostgreSQL | 16 | Base de datos principal |
| pg (node-postgres) | ~8.x | Driver nativo (runner SQL) |

## Cola y procesamiento asíncrono
| Herramienta | Versión | Propósito |
|------------|---------|-----------|
| Redis | 7.x | Message broker |
| BullMQ | ~5.x | Cola de trabajos sobre Redis |
| @nestjs/bullmq | ~10.x | Integración NestJS + BullMQ |

## Autenticación
| Herramienta | Versión | Propósito |
|------------|---------|-----------|
| @nestjs/jwt | ~10.x | Generación y validación de JWT |
| @nestjs/passport | ~10.x | Estrategia de autenticación |
| passport-jwt | ~4.x | Validación de tokens JWT |
| bcrypt | ~2.x | Hash de contraseñas |

## Docker y runner
| Herramienta | Versión | Propósito |
|------------|---------|-----------|
| Docker | 24+ | Contenedores de servicios y runner SQL |
| dockerode | ~4.x | SDK Node.js para controlar Docker (runner) |
| postgres:16 | imagen | Imagen base para runner SQL efímero |

## Testing
| Herramienta | Versión | Propósito |
|------------|---------|-----------|
| Jest | ~29.x | Framework de tests |
| @nestjs/testing | ~10.x | Testing utilities de NestJS |

## Apps del proyecto
| App | Carpeta | Puerto | Dependencias externas |
|-----|---------|--------|----------------------|
| API | `apps/api/` | 3000 | PostgreSQL, Redis |
| Worker | `apps/worker/` | — | Redis, PostgreSQL (para escritura de resultados) |

## Versiones de Node en Docker
- API: `node:18-alpine`
- Worker: `node:18-alpine`
- Runner SQL (efímero): `postgres:16-alpine`
