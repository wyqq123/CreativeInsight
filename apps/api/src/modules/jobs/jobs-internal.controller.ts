import { BadRequestException, Body, Controller, Headers, Param, Post } from "@nestjs/common";
import { ok } from "../../common/response";
import { JobsInternalService } from "./jobs-internal.service";

@Controller("internal/jobs")
export class JobsInternalController {
  constructor(private readonly service: JobsInternalService) {}

  @Post(":queue/:queueJobId/status")
  async updateStatus(
    @Param("queue") queue: "sync-jobs" | "ai-label-jobs" | "report-jobs",
    @Param("queueJobId") queueJobId: string,
    @Body() body: { status: string; progress?: number; errorCode?: string; errorMessage?: string; result?: Record<string, unknown> },
    @Headers("x-internal-token") internalToken?: string,
    @Headers("x-request-id") requestId?: string,
  ) {
    if (!internalToken || internalToken !== (process.env.INTERNAL_WORKER_TOKEN ?? "dev-internal-token")) {
      throw new BadRequestException("invalid internal token");
    }
    const data = await this.service.updateStatus(queue, queueJobId, body);
    return ok(requestId, data);
  }
}
