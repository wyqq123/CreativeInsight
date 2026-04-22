import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateOrganization(name: string) {
    const found = await this.prisma.organization.findFirst({ where: { name } });
    if (found) return found;
    return this.prisma.organization.create({
      data: { name, plan_type: "free", status: "active" },
    });
  }

  upsertUser(orgId: string, email: string, displayName?: string) {
    return this.prisma.user.upsert({
      where: { email },
      update: { org_id: orgId, display_name: displayName },
      create: { org_id: orgId, email, display_name: displayName, auth_provider: "email" },
    });
  }

  getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
