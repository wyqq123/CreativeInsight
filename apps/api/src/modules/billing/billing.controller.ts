import { BadRequestException, Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { ok } from "../../common/response";
import { requireOrgId } from "../../common/tenant";
import { BillingService } from "./billing.service";

@Controller("billing")
export class BillingController {
  constructor(private readonly service: BillingService) {}

  @Get("plan")
  async getPlan(@Headers("x-org-id") xOrgId?: string, @Headers("x-request-id") requestId?: string) {
    const orgId = requireOrgId(xOrgId);
    const org = await this.service.getPlan(orgId);
    if (!org) throw new BadRequestException("organization not found");
    return ok(requestId, { orgId: org.id, planType: org.plan_type, status: org.status });
  }

  @Post("upgrade")
  async upgrade(
    @Body() body: { planType: "free" | "pro" },
    @Headers("x-org-id") xOrgId?: string,
    @Headers("idempotency-key") idempotencyKey?: string,
    @Headers("x-request-id") requestId?: string,
  ) {
    if (!idempotencyKey) throw new BadRequestException("Idempotency-Key header is required");
    if (!body?.planType) throw new BadRequestException("planType is required");
    return ok(
      requestId,
      await this.service.upgradePlan(requireOrgId(xOrgId), body.planType, idempotencyKey, requestId),
    );
  }
}
