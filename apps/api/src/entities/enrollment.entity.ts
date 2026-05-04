export class Enrollment {
  constructor(
    public readonly studentId: number,
    public readonly courseId: number,
    public readonly enrolledAt: Date,
  ) {}
}
