export interface TableConfig {
  tabla: string;
  rows: number;
  fields: Record<string, unknown>;
}

export class RandomDataGeneration {
  constructor(
    public readonly id: number,
    public readonly challengeId: number,
    public readonly registrosPorTabla: TableConfig[],
    public readonly rangoFechas: Record<string, unknown>,
    public readonly minNumeric: number,
    public readonly maxNumeric: number,
    public readonly textValueLists: Record<string, unknown>,
    public readonly nullPercentage: number,
    public readonly edgeCases: Record<string, unknown>,
    public readonly createdAt: Date,
  ) {}
}
