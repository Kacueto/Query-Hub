export class Test {
  constructor(
    public readonly id: number,
    public readonly assessmentId: number,
    public readonly nombre: string,
    public readonly status: string, // 'OK' | 'FAIL'
    public readonly mensaje: string,
    public readonly peso: number, // peso relativo del caso de prueba
  ) {}

  passed(): boolean {
    return this.status === "OK";
  }
}
