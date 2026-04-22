import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma.service";
import { MetricsService } from "../../common/metrics.service";

type QueueName = "sync-jobs" | "ai-label-jobs" | "report-jobs";

@Injectable()
export class JobsInternalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async updateStatus(
    queue: QueueName,
    queueJobId: string,
    payload: { status: string; progress?: number; errorCode?: string; errorMessage?: string; result?: Record<string, unknown> },
  ) {
    this.metrics.recordTaskTransition(queue, payload.status);
    if (queue === "sync-jobs") {
      return this.prisma.syncJob.update({
        where: { queue_job_id: queueJobId },
        data: {
          status: payload.status,
          started_at: payload.status === "running" ? new Date() : undefined,
          finished_at: payload.status === "success" || payload.status === "failed" ? new Date() : undefined,
          error_code: payload.errorCode,
          error_message: payload.errorMessage,
        },
      });
    }
    if (queue === "ai-label-jobs") {
      return this.prisma.labelTask.update({
        where: { queue_job_id: queueJobId },
        data: {
          status: payload.status,
          progress: payload.progress ?? undefined,
          started_at: payload.status === "running" ? new Date() : undefined,
          finished_at: payload.status === "completed" || payload.status === "failed" ? new Date() : undefined,
          error_code: payload.errorCode,
          error_message: payload.errorMessage,
        },
      });
    }
    if (queue === "report-jobs") {
      return this.prisma.insightReport.update({
        where: { queue_job_id: queueJobId },
        data: {
          status: payload.status,
          started_at: payload.status === "running" ? new Date() : undefined,
          finished_at: payload.status === "ready" || payload.status === "failed" ? new Date() : undefined,
          summary_text: payload.result?.summaryText as string | undefined,
          report_jsonb: payload.result ? (payload.result as Prisma.InputJsonValue) : undefined,
          error_code: payload.errorCode,
          error_message: payload.errorMessage,
        },
      });
    }
    throw new BadRequestException("unsupported queue name");
  }
}
