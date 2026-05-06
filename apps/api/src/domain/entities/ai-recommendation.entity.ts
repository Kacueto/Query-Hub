export class AiRecommendation {
  constructor(
    public readonly id: number,
    public readonly submissionId: number,
    public readonly explanation: string,
    public readonly suggestedQuery: string,
    public readonly createdAt: Date,
  ) {}
}
