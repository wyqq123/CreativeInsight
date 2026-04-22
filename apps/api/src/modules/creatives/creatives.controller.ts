import { BadRequestException, Body, Controller, Get, Headers, Param, Patch, Post, Query } from "@nestjs/common";
import { ok } from "../../common/response";
import { requireOrgId } from "../../common/tenant";
import { CreativesService } from "./creatives.service";

@Controller()
export class CreativesController {
  constructor(private readonly service: CreativesService) {}

  @Get("creatives")
  async listCreatives(
    @Query("brandId") brandId?: string,
    @Query("page") page = "1",
    @Query("pageSize") pageSize = "20",
    @Headers("x-org-id") xOrgId?: string,
    @Headers("x-request-id") requestId?: string,
  ) {
    return ok(
      requestId,
      await this.service.listCreatives(requireOrgId(xOrgId), brandId, Number(page), Number(pageSize)),
    );
  }

  @Patch("creatives/:id/winner-status")
  async updateWinner(
    @Param("id") id: string,
    @Body() body: { winnerStatus: "unknown" | "candidate" | "confirmed" | "excluded"; lastKnownVersion: number },
    @Headers("idempotency-key") idempotencyKey?: string,
    @Headers("x-org-id") xOrgId?: string,
    @Headers("x-request-id") requestId?: string,
  ) {
    if (!idempotencyKey) throw new BadRequestException("Idempotency-Key header is required");
    return ok(
      requestId,
      await this.service.updateWinnerStatus(requireOrgId(xOrgId), idempotencyKey, id, body, requestId),
    );
  }

  @Post("creatives/batch/queue-labeling")
  async queueLabeling(
    @Body() body: { creativeAssetIds: string[] },
    @Headers("idempotency-key") idempotencyKey?: string,
    @Headers("x-org-id") xOrgId?: string,
    @Headers("x-request-id") requestId?: string,
  ) {
    if (!idempotencyKey) throw new BadRequestException("Idempotency-Key header is required");
    return ok(
      requestId,
      await this.service.queueForLabeling(requireOrgId(xOrgId), idempotencyKey, body.creativeAssetIds, requestId),
    );
  }
}
