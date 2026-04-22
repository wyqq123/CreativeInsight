import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { AuditLogService } from "../../common/audit-log.service";
import { IdempotencyService } from "../../common/idempotency.service";
import { QueueGatewayService } from "../../common/queue-gateway.service";
import { CreativesRepository } from "./creatives.repository";

type WinnerStatus = "unknown" | "candidate" | "confirmed" | "excluded";

@Injectable()
export class CreativesService {
  constructor(
    private readonly idem: IdempotencyService,
    private readonly queue: QueueGatewayService,
    private readonly repo: CreativesRepository,
    private readonly audit: AuditLogService,
  ) {}

  async listCreatives(orgId: string, brandId?: string, page = 1, pageSize = 20) {
    const { items, total } = await this.repo.list(orgId, brandId, page, pageSize);
    return {
      items,
      pageInfo: { page, pageSize, total },
    };
  }

  updateWinnerStatus(
    orgId: string,
    idempotencyKey: string,
    id: string,
    payload: { winnerStatus: WinnerStatus; lastKnownVersion: number },
    requestId?: string,
  ) {
    return this.idem.run(orgId, `PATCH:/creatives/${id}/winner-status`, idempotencyKey, async () => {
      const current = await this.repo.getForUpdate(orgId, id);
      if (!current) throw new BadRequestException("creative not found");
      if (current.version !== payload.lastKnownVersion) {
        throw new ConflictException({
          code: "VERSION_CONFLICT",
          message: "resource version mismatch",
          data: { latestVersion: current.version },
        });
      }
      await this.repo.updateWinnerStatus(orgId, id, payload.lastKnownVersion, payload.winnerStatus);
      const updated = await this.repo.getForUpdate(orgId, id);
      if (!updated) {
        throw new BadRequestException("creative not found");
      }
      await this.audit.log({
        orgId,
        action: "creative.winner_status_updated",
        resourceType: "creative_asset",
        resourceId: id,
        requestId,
        metadata: { winnerStatus: payload.winnerStatus },
      });
      return updated;
    });
  }

  queueForLabeling(orgId: string, idempotencyKey: string, creativeAssetIds: string[], requestId?: string) {
    return this.idem.run(orgId, "POST:/creatives/batch/queue-labeling", idempotencyKey, async () => {
      const queueJob = await this.queue.enqueue("ai-label-jobs", "queue-labeling", { orgId, creativeAssetIds });
      await this.audit.log({
        orgId,
        action: "creative.batch_queue_labeling",
        resourceType: "creative_asset",
        requestId,
        metadata: { acceptedCount: creativeAssetIds.length, queueJobId: queueJob.id },
      });
      return {
        acceptedCount: creativeAssetIds.length,
        duplicateCount: 0,
        labelTaskId: queueJob.id,
      };
    });
  }
}
