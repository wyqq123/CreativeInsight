import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class IntegrationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsertPlatformAccount(data: {
    orgId: string;
    platform: string;
    externalAccountId: string;
    oauthStatus: string;
    tokenExpiresAt?: Date;
  }) {
    return this.prisma.platformAccount.upsert({
      where: {
        org_id_platform_external_account_id: {
          org_id: data.orgId,
          platform: data.platform,
          external_account_id: data.externalAccountId,
        },
      },
      update: {
        oauth_status: data.oauthStatus,
        token_expires_at: data.tokenExpiresAt,
      },
      create: {
        org_id: data.orgId,
        platform: data.platform,
        external_account_id: data.externalAccountId,
        oauth_status: data.oauthStatus,
        token_expires_at: data.tokenExpiresAt,
      },
    });
  }

  findRunningSync(orgId: string, platformAccountId: string) {
    return this.prisma.syncJob.findFirst({
      where: { org_id: orgId, platform_account_id: platformAccountId, status: "running" },
      orderBy: { created_at: "desc" },
    });
  }

  createSyncJob(data: {
    orgId: string;
    platformAccountId: string;
    queueJobId?: string;
    jobType: string;
  }) {
    return this.prisma.syncJob.create({
      data: {
        org_id: data.orgId,
        platform_account_id: data.platformAccountId,
        queue_job_id: data.queueJobId,
        status: "queued",
        job_type: data.jobType,
      },
    });
  }

  getSyncJob(id: string) {
    return this.prisma.syncJob.findUnique({ where: { id } });
  }
}
