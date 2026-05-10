import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { SubmissionQueue } from "../../application/ports/submission-queue.port";

@Injectable()
export class BullSubmissionQueueAdapter implements SubmissionQueue {
  constructor(@InjectQueue('sql-evaluation') private readonly sqlQueue: Queue) {}

  async enqueue(submissionId: number, sql: string): Promise<void> {
    await this.sqlQueue.add('execute-sql', { submissionId, sql });
  }
}
