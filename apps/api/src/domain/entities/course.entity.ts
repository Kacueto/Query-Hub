export class Course {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly codigoNrc: string,
    public readonly periodoAcademico: string,
    public readonly profesorResponsableId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
