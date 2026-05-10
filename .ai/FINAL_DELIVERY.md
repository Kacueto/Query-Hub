# Checklist de Entrega Final — Semana 5

## 📋 Estado general

| # | Entregable | Peso | Estado | Depende de | Prioridad |
|---|-----------|------|--------|-----------|-----------|
| 1 | Evaluador SQL funcional | 20% | ❌ No iniciado | 4, 5 | 🔴 Alta |
| 2 | Worker SQL funcional | — | ⚠️ Stub | 4 | 🔴 Alta |
| 3 | Procesamiento con Redis | — | ✅ Listo | — | 🔴 Alta |
| 4 | Runner SQL con Docker | 15% | ❌ No iniciado | — | 🔴 Alta |
| 5 | Envío de submissions | — | ✅ Listo | — | 🔴 Alta |
| 6 | Asistente inteligente | 10% | ❌ No iniciado | — | 🔴 Alta (obligatorio) |
| 7 | Generador datos aleatorios | 10% | ❌ No iniciado | — | 🟡 Media |
| 8 | Evaluaciones/parciales | 15% | ❌ No iniciado | — | 🟡 Media |
| 9 | Reportes (est, reto, curso) | 10% | ❌ No iniciado | 1, 8 | 🟡 Media |
| 10 | README completo | — | ❌ No iniciado | todos | 🟢 Baja |
| 11 | Video demostrativo | — | ❌ No iniciado | todos | 🟢 Baja |
| 12 | Evidencia Docker Compose | — | ❌ No iniciado | todos | 🟢 Baja |

## 🔥 Orden de construcción recomendado

```
Semana 3                        Semana 4                         Semana 5
┌──────────────┐               ┌──────────────────┐            ┌──────────────────┐
│ Runner Docker │──────▶       │ Evaluador SQL     │───▶       │ Asistente IA      │
│ (4)           │               │ (1 + 2)           │           │ (6)               │
└──────────────┘               └──────────────────┘            └──────────────────┘
      │                              │                               │
      ▼                              ▼                               ▼
┌──────────────┐               ┌──────────────────┐            ┌──────────────────┐
│ Generador    │──────▶        │ Evaluaciones     │───▶        │ Reportes         │
│ datos (7)    │               │ (8)              │            │ (9)              │
└──────────────┘               └──────────────────┘            └──────────────────┘
                                                                      │
                                                                      ▼
                                                               ┌──────────────────┐
                                                               │ README + Video   │
                                                               │ (10 + 11 + 12)   │
                                                               └──────────────────┘
```

## 📌 Detalle por entregable

### Evaluador SQL funcional (20%)
- [ ] Worker consume jobs de Redis y ejecuta evaluación real
- [ ] Ejecutar query del estudiante contra el schema del reto
- [ ] Comparar resultado con query esperada (EXCEPT / diff)
- [ ] Calcular puntaje según criterios (60% correctitud, 15% tiempo, etc.)
- [ ] Actualizar SubmissionStatus (ACCEPTED, WRONG_ANSWER, SYNTAX_ERROR, etc.)
- [ ] Guardar Evaluation con score, executionTimeMs, feedback

### Runner SQL con Docker (15%)
- [ ] Servicio que crea contenedor PostgreSQL efímero por evaluación
- [ ] Aplica schema.sql del reto
- [ ] Carga seed.sql del reto
- [ ] Ejecuta query del estudiante y query esperada
- [ ] Mide tiempo de ejecución
- [ ] Aplica límites: memoria 256m, CPU 0.5, timeout configurable
- [ ] Destruye contenedor al finalizar (finally block)
- [ ] Manejo de errores: SYNTAX_ERROR, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED

### Asistente inteligente (10%) — OBLIGATORIO
- [ ] Puerto/interface `AiAdvisor` en application/ports
- [ ] Implementación con OpenAI, Claude, o reglas locales
- [ ] Prompt que analiza: query + schema DDL + executionTimeMs
- [ ] Genera: explicación, recomendaciones, índices sugeridos, reescritura
- [ ] Se integra con el worker (post-evaluación)
- [ ] Persiste AI Recommendation en DB

### Generador de datos aleatorios (10%)
- [ ] Endpoint para configurar generación por reto
- [ ] Soporta: cantidad de registros, rangos de fechas, min/max numéricos, listas de texto, % nulos
- [ ] Respeta relaciones entre tablas (foreign keys)
- [ ] Genera casos borde

### Evaluaciones/parciales (15%)
- [ ] CRUD de Assessment (nombre, fechas, duración, intentos máximos)
- [ ] Asociar challenges a un assessment (EvaluationChallenge)
- [ ] Visibility de resultados (inmediato vs después del cierre)

### Reportes (10%)
- [ ] Reporte por estudiante (submissions, scores, evolución)
- [ ] Reporte por reto (estadísticas, tasa de acierto, tiempo promedio)
- [ ] Reporte por curso (progreso general)

## ⚠️ Recordatorios importantes

- **El asistente IA es obligatorio** — no es opcional, está en la rúbrica
- **Evidencia de Docker Compose** — capturar pantallazos de los contenedores corriendo
- **Video demostrativo** — mostrar el flujo completo: profesor crea reto → estudiante envía → worker evalúa → IA recomienda
- **Commits individuales** — la rúbrica evalúa commits por persona, no commits colectivos
