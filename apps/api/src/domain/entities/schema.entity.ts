export class Schema {
  constructor(
    public readonly id: number,
    public readonly challengeId: number,
    public readonly nombre: string,
    public readonly ddlSql: string, // el CREATE TABLE que carga el profesor
    public readonly createdAt: Date,
  ) {}
}
