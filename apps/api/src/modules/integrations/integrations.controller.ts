import { BadRequestException, Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
import { ok } from "../../common/response";
import { requireOrgId } from "../../common/tenant";
import { IntegrationsService } from "./integrations.service";

@Controller()
export class IntegrationsController {
  constructor(private readonly service: IntegrationsService) {}

  @Post("integrations/oauth/:platform/callback")
  async oauthCallback(
    @Param("platform") platform: string,
    @Body() body: { code: string; state?: string },
    @Headers("x-org-id") xOrgId?: string,
    @Headers("x-request-id") requestId?: string,
  ) {
    return ok(requestId, await this.service.oauthCallback(requireOrgId(xOrgId), platform, body, requestId));
  }

  @Post("sync-jobs")
  async createSync(
    @Body() body: { platformAccountId: string; jobType?: string },
    @Headers("x-org-id") xOrgId?: string,
    @Headers("idempotency-key") idempotencyKey?: string,
    @Headers("x-request-id") requestId?: string,
  ) {
    if (!idempotencyKey) throw new BadRequestException("Idempotency-Key header is required");
    return ok(
      requestId,
      await this.service.createSyncJob(requireOrgId(xOrgId), idempotencyKey, body, requestId),
    );
  }

  @Get("sync-jobs/:id")
  async getSync(@Param("id") id: string, @Headers("x-request-id") requestId?: string) {
    const data = await this.service.getSyncJob(id);
    if (!data) throw new BadRequestException("sync job not found");
    return ok(requestId, data);
  }
}
