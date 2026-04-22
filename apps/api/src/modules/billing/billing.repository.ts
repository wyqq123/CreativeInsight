import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class BillingRepository {
  constructor(private readonly prisma: PrismaService) {}

  getOrganization(orgId: string) {
    return this.prisma.organization.findUnique({ where: { id: orgId } });
  }

  updatePlan(orgId: string, planType: "free" | "pro") {
    return this.prisma.organization.update({
      where: { id: orgId },
      data: { plan_type: planType },
    });
  }
}
