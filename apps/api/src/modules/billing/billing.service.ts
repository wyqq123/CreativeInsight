import { Injectable } from "@nestjs/common";
import { AuditLogService } from "../../common/audit-log.service";
import { IdempotencyService } from "../../common/idempotency.service";
import { BillingRepository } from "./billing.repository";

@Injectable()
export class BillingService {
  constructor(
    private readonly repo: BillingRepository,
    private readonly idem: IdempotencyService,
    private readonly audit: AuditLogService,
  ) {}

  getPlan(orgId: string) {
    return this.repo.getOrganization(orgId);
  }

  upgradePlan(orgId: string, planType: "free" | "pro", idempotencyKey: string, requestId?: string) {
    return this.idem.run(orgId, "POST:/billing/upgrade", idempotencyKey, async () => {
      const updated = await this.repo.updatePlan(orgId, planType);
      await this.audit.log({
        orgId,
        action: "billing.plan_updated",
        resourceType: "organization",
        resourceId: orgId,
        requestId,
        metadata: { planType },
      });
      return { orgId: updated.id, planType: updated.plan_type };
    });
  }
}
