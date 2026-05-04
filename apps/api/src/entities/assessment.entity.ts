export class Assessment {
  constructor(
    public readonly id: number,
    public readonly submissionId: number,
    public readonly status: string,
    public readonly score: number, // 0-100
    public readonly executionTimeMs: number,
    public readonly resultadoCorrectoPct: number, // 60% máx
    public readonly tiempoEjecucionPct: number, // 15% máx
    public readonly usoSqlPct: number, // 10% máx
    public readonly claridadPct: number, // 5% máx
    public readonly mejoraPosteriorPct: number, // 10% máx — se actualiza en reintento
    public readonly createdAt: Date,
  ) {}

  static calculateScore(params: {
    resultadoCorrectoPct: number;
    tiempoEjecucionPct: number;
    usoSqlPct: number;
    claridadPct: number;
    mejoraPosteriorPct: number;
  }): number {
    return (
      params.resultadoCorrectoPct +
      params.tiempoEjecucionPct +
      params.usoSqlPct +
      params.claridadPct +
      params.mejoraPosteriorPct
    );
  }
}
