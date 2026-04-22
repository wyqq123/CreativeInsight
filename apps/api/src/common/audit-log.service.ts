import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    orgId: string;
    actorUserId?: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    requestId?: string;
    metadata?: Record<string, unknown>;
  }) {
    await this.prisma.auditLog.create({
      data: {
        org_id: params.orgId,
        actor_user_id: params.actorUserId,
        action: params.action,
        resource_type: params.resourceType,
        resource_id: params.resourceId,
        request_id: params.requestId,
        metadata: params.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }
}
