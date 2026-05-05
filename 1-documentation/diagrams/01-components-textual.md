# Diagrama Descriptivo de Componentes C4 (Nivel Componente)

*A continuación se muestra una representación estructurada tipo C4 de los flujos principales del sistema Query-Hub, ya que las interacciones se realizan entre componentes bien delimitados.*

## Flujo Principal: Evaluación Asíncrona de un Reto

1. **[SPA / Cliente Web]**  
   ⬇ *Hace un POST (`/api/submissions`)*
<br>

2. **[API NestJS: Submissions Controller]**  
   Recibe el DTO estructurado y orquesta la identidad basándose en los guards (JWT).  
   ⬇ *Llama a ...*
<br>

3. **[API NestJS: Submissions Use Case / Service]**  
   Guarda el intento en la base de datos con un estado `PENDING`.  
   ⬇ *Usa ...*
<br>

4. **[PostgreSQL: typeorm-entities (submissions)]**  
   Almacena el registro (estado pendiente).  
   ⬆ *Retorna ID de submission*
<br>

5. **[API NestJS: BullMQ Queue Producer]**
   La API toma el DTO `SqlEvaluationJobPayload` (y el ID guardado) e inyecta un job a la cola llamada `sql-evaluation`.  
   ⬇ *Llama a ...*
<br>

6. **[Redis]**  
   Persiste y mantiene el encolado (FIFO) a través del broker de BullMQ.  
   ⬇ *Notifica/Es Escuchado por ...*
<br>

7. **[Worker NestJS: EvaluationProcessor]**
   Toma el trabajo de la cola. Se dedica enteramente a leer la SQL (`sqlQuery`), evaluar la veracidad semántica/sintáctica.
   ⬇ *Puede usar ...*
<br>

8. **[Worker: DB Integrator - a implementar]**  
   El Worker reporta su respuesta actualizada (ej. `ACCEPTED` / `FAILED`), persistiendo el cambio de estado de nuevo a la arquitectura. En un flujo futuro, aquí se actualizará de nuevo a **[PostgreSQL]**.
