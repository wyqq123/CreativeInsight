import { ConflictException, Injectable } from "@nestjs/common";
import { AuditLogService } from "../../common/audit-log.service";
import { IdempotencyService } from "../../common/idempotency.service";
import { QueueGatewayService } from "../../common/queue-gateway.service";
import { IntegrationsRepository } from "./integrations.repository";

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly idem: IdempotencyService,
    private readonly queue: QueueGatewayService,
    private readonly repo: IntegrationsRepository,
    private readonly audit: AuditLogService,
  ) {}

  async oauthCallback(orgId: string, platform: string, body: { code: string; state?: string }, requestId?: string) {
    const data = await this.repo.upsertPlatformAccount({
      orgId,
      platform,
      externalAccountId: `ext_${body.code.slice(0, 8)}`,
      oauthStatus: "connected",
      tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
    await this.audit.log({
      orgId,
      action: "integration.oauth_callback",
      resourceType: "platform_account",
      resourceId: data.id,
      requestId,
      metadata: { platform },
    });
    return data;
  }

  async createSyncJob(
    orgId: string,
    idempotencyKey: string,
    body: { platformAccountId: string; jobType?: string },
    requestId?: string,
  ) {
    return this.idem.run(orgId, "POST:/sync-jobs", idempotencyKey, async () => {
      const running = await this.repo.findRunningSync(orgId, body.platformAccountId);
      if (running) {
        throw new ConflictException({
          code: "SYNC_ALREADY_RUNNING",
          message: "sync already running for account",
          data: { runningJobId: running.id },
        });
      }
      const queueJob = await this.queue.enqueue("sync-jobs", "manual-sync", {
        orgId,
        platformAccountId: body.platformAccountId,
      });
      const data = await this.repo.createSyncJob({
        orgId,
        platformAccountId: body.platformAccountId,
        queueJobId: queueJob.id,
        jobType: body.jobType ?? "manual",
      });
      await this.audit.log({
        orgId,
        action: "sync_job.created",
        resourceType: "sync_job",
        resourceId: data.id,
        requestId,
        metadata: { queueJobId: queueJob.id },
      });
      return data;
    });
  }

  getSyncJob(id: string) {
    return this.repo.getSyncJob(id);
  }
}
