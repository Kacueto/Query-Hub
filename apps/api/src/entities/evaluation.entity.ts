export class Evaluation {
  constructor(
    public readonly id: number,
    public readonly courseId: number,
    public readonly nombre: string,
    public readonly descripcion: string,
    public readonly fechaApertura: Date,
    public readonly fechaCierre: Date,
    public readonly createdAt: Date,
  ) {}

  isOpen(): boolean {
    const now = new Date();
    return now >= this.fechaApertura && now <= this.fechaCierre;
  }

  isClosed(): boolean {
    return new Date() > this.fechaCierre;
  }
}
