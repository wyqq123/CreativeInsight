import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { JobsOptions, Queue } from "bullmq";
import IORedis from "ioredis";

export type QueueJob = {
  id: string | undefined;
  queue: "sync-jobs" | "ai-label-jobs" | "report-jobs";
  name: string;
  payload: Record<string, unknown>;
  status: "queued";
  createdAt: string;
};

@Injectable()
export class QueueGatewayService implements OnModuleDestroy {
  private readonly connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: null,
  });

  private readonly syncQueue = new Queue("sync-jobs", { connection: this.connection });
  private readonly aiLabelQueue = new Queue("ai-label-jobs", { connection: this.connection });
  private readonly reportQueue = new Queue("report-jobs", { connection: this.connection });

  private readonly defaultOptions: JobsOptions = {
    attempts: 4,
    backoff: { type: "exponential", delay: 500 },
    removeOnComplete: 1000,
    removeOnFail: 1000,
  };

  async enqueue(queue: QueueJob["queue"], name: string, payload: Record<string, unknown>, jobId?: string) {
    const target = queue === "sync-jobs" ? this.syncQueue : queue === "ai-label-jobs" ? this.aiLabelQueue : this.reportQueue;
    const job = await target.add(name, payload, { ...this.defaultOptions, jobId });
    return job;
  }

  async onModuleDestroy() {
    await Promise.all([this.syncQueue.close(), this.aiLabelQueue.close(), this.reportQueue.close()]);
    await this.connection.quit();
  }
}
