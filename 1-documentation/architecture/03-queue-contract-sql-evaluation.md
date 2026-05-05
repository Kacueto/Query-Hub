# Contrato de Cola: SQL Evaluation (`sql-evaluation`)

Este documento define la estructura y el comportamiento esperado para la comunicación asíncrona a través de Redis utilizando BullMQ entre la API Productora y el Worker Consumidor.

## 1. Definición del Job
- **Nombre de la cola:** `sql-evaluation`
- **Productor:** API (ej. desde `SubmissionsModule`)
- **Consumidor:** Worker (`EvaluationProcessor`)

## 2. Contrato del Mensaje (Payload)

El payload debe ser agnóstico del estado interno de la API, ofreciendo todos los datos mínimos necesarios para que el Worker pueda evaluar la consulta enviada.

```typescript
export interface SqlEvaluationJobPayload {
  /**
   * El ID interno del envío/submission (necesario por si el worker actualiza 
   * directo la DB o para eventos de emit).
   */
  submissionId: string;
  
  /**
   * ID del usuario que envió esta query.
   */
  userId: string;
  
  /**
   * ID del reto que se está intentando responder.
   */
  challengeId: string;
  
  /**
   * La consulta string cruda enviada por el estudiante.
   */
  sqlQuery: string;
  
  /**
   * (Opcional) Timestamp de creación para métricas y timeout de colas.
   */
  createdAt: Date | string;
}
```

## 3. Expectativas del Worker (Ciclo de Vida)

A alto nivel (sin implementación detallada aún), el Worker se espera que:

1. **Reciba** este `payload`.
2. **Obtenga** el comportamiento deseado y esquema del reto (consultando la DB, o recibiendo el schemaId dentro del propio payload si se llegara a expandir).
3. **Ejecute** en un entorno aislado la `sqlQuery` o verifique su AST.
4. **Resuelva** el resultado en un booleano (Aprobado/Fallido) o en metadatos de cobertura.
5. **Cierre** el trabajo en BullMQ. Puede comunicar el resultado de vuelta emitiendo a otra cola o actualizando directamente la base de datos (por ejemplo, cambiando el estado en la tabla `submissions`).
