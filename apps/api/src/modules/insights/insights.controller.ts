import { BadRequestException, Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
import { ok } from "../../common/response";
import { requireOrgId } from "../../common/tenant";
import { InsightsService } from "./insights.service";

@Controller()
export class InsightsController {
  constructor(private readonly service: InsightsService) {}

  @Post("insight-reports")
  async createReport(
    @Body() body: any,
    @Headers("idempotency-key") idempotencyKey?: string,
    @Headers("x-org-id") xOrgId?: string,
    @Headers("x-request-id") requestId?: string,
  ) {
    if (!idempotencyKey) throw new BadRequestException("Idempotency-Key header is required");
    return ok(
      requestId,
      await this.service.createReport(requireOrgId(xOrgId), idempotencyKey, body, requestId),
    );
  }

  @Get("insight-reports/:id")
  async getReport(@Param("id") id: string, @Headers("x-request-id") requestId?: string) {
    const data = await this.service.getReport(id);
    if (!data) throw new BadRequestException("report not found");
    return ok(requestId, data);
  }

  @Post("insight-reports/:id/export-pdf")
  async exportPdf(
    @Param("id") id: string,
    @Headers("idempotency-key") idempotencyKey?: string,
    @Headers("x-org-id") xOrgId?: string,
    @Headers("x-request-id") requestId?: string,
  ) {
    if (!idempotencyKey) throw new BadRequestException("Idempotency-Key header is required");
    return ok(
      requestId,
      await this.service.exportPdf(requireOrgId(xOrgId), idempotencyKey, id, requestId),
    );
  }
}
