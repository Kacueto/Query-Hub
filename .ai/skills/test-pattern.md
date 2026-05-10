# Skill: Escribir tests consistentes

## Propósito

Estructurar tests de manera uniforme en todo el proyecto, asegurando cobertura adecuada por capa.

## Herramientas

- **Jest** (~29.x) como framework de testing
- **@nestjs/testing** para crear módulos de prueba
- Tests ubicados junto al archivo fuente con sufijo `.spec.ts`

## Estructura general de un test

```typescript
import { ... } from '...';

describe('CreateUserUseCase', () => {
  // 1. Arrange: preparar mocks y SUT (system under test)
  // 2. Act: ejecutar la acción
  // 3. Assert: verificar resultados

  let useCase: CreateUserUseCase;
  let userRepository: MockType<UserRepository>;

  beforeEach(async () => {
    // Configurar módulo de testing
    const module = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        { provide: UserRepository, useFactory: mockRepository },
      ],
    }).compile();

    useCase = module.get(CreateUserUseCase);
    userRepository = module.get(UserRepository);
  });

  it('should create a user successfully', async () => {
    // Arrange
    const dto = { nombre: 'Test', email: 'test@test.com', password: '123', role: Role.STUDENT };
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.save.mockResolvedValue({ id: 1, ...dto });

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(result).toBeDefined();
    expect(result.email).toBe('test@test.com');
    expect(userRepository.save).toHaveBeenCalledTimes(1);
  });
});
```

## Qué testear por capa

### Domain (entidades, enums)
```typescript
// Probar: creación, validación de estados, transiciones
it('should create a challenge with DRAFT status')
it('should prevent publishing an already published challenge')
```

### Application (use-cases)
```typescript
// Probar: flujo feliz, casos borde, errores
it('should create a submission and enqueue it')
it('should throw NotFoundException when challenge does not exist')
it('should throw ConflictException when email already exists')
```

### Infrastructure (repositorios, adaptadores)
```typescript
// Probar: integración con DB real o container de test
// Para adaptadores externos (IA, Docker), mockear o usar testcontainers
it('should save and retrieve user from PostgreSQL')
it('should publish job to Redis queue')
```

### Presentation (controladores)
```typescript
// Probar: HTTP status codes, transformación de respuestas
it('should return 201 when course is created')
it('should return 401 when no JWT token provided')
it('should return 403 when role is not PROFESSOR')
```

## Mocking

- Usar `jest.fn()` o `jest.spyOn()` para mocks simples
- Crear helpers `MockType<T>` para repositorios:

```typescript
type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

const mockRepository = <T>(): MockType<T> => ({
  findById: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  // ...
});
```

- Para módulos NestJS, usar `Test.createTestingModule` con `useFactory` para mocks

## Cobertura esperada

| Capa | Cobertura mínima | Prioridad |
|------|-----------------|-----------|
| Domain | 100% (lógica pura, fácil de testear) | Alta |
| Application | 90%+ (casos de uso principales + errores) | Alta |
| Infrastructure | 70%+ (repositorios críticos, adaptadores) | Media |
| Presentation | 80%+ (códigos HTTP, guards, transformación) | Alta |
