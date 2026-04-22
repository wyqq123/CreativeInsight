import { Injectable } from "@nestjs/common";
import { AuditLogService } from "../../common/audit-log.service";
import { AuthRepository } from "./auth.repository";

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly audit: AuditLogService,
  ) {}

  async login(email: string, orgName: string, displayName?: string, requestId?: string) {
    const org = await this.repo.findOrCreateOrganization(orgName);
    const user = await this.repo.upsertUser(org.id, email, displayName);
    await this.audit.log({
      orgId: org.id,
      actorUserId: user.id,
      action: "auth.login",
      resourceType: "user",
      resourceId: user.id,
      requestId,
    });
    return {
      token: `dev-token-${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        orgId: user.org_id,
      },
    };
  }

  async me(userId: string) {
    const user = await this.repo.getUserById(userId);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      orgId: user.org_id,
    };
  }
}
