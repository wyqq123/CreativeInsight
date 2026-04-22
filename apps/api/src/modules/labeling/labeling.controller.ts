import { BadRequestException, Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
import { ok } from "../../common/response";
import { requireOrgId } from "../../common/tenant";
import { LabelingService } from "./labeling.service";

@Controller()
export class LabelingController {
  constructor(private readonly service: LabelingService) {}

  @Post("label-tasks")
  async createLabelTask(
    @Body() body: { assetIds: string[] },
    @Headers("idempotency-key") idempotencyKey?: string,
    @Headers("x-org-id") xOrgId?: string,
    @Headers("x-request-id") requestId?: string,
  ) {
    if (!idempotencyKey) throw new BadRequestException("Idempotency-Key header is required");
    return ok(
      requestId,
      await this.service.createTask(requireOrgId(xOrgId), idempotencyKey, body.assetIds, requestId),
    );
  }

  @Get("label-tasks/:id")
  async getLabelTask(@Param("id") id: string, @Headers("x-request-id") requestId?: string) {
    const data = await this.service.getTask(id);
    if (!data) throw new BadRequestException("label task not found");
    return ok(requestId, data);
  }

  @Post("labels/review/confirm-batch")
  async confirmLabels(
    @Body() body: { items: Array<{ assetId: string; lastKnownVersion: number; labels: unknown[] }> },
    @Headers("idempotency-key") idempotencyKey?: string,
    @Headers("x-org-id") xOrgId?: string,
    @Headers("x-request-id") requestId?: string,
  ) {
    if (!idempotencyKey) throw new BadRequestException("Idempotency-Key header is required");
    return ok(requestId, await this.service.confirmBatch(requireOrgId(xOrgId), idempotencyKey, body));
  }
}
