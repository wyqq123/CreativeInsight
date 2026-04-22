import { Injectable } from "@nestjs/common";
import { AuditLogService } from "../../common/audit-log.service";
import { IdempotencyService } from "../../common/idempotency.service";
import { QueueGatewayService } from "../../common/queue-gateway.service";
import { LabelingRepository } from "./labeling.repository";

@Injectable()
export class LabelingService {
  constructor(
    private readonly idem: IdempotencyService,
    private readonly queue: QueueGatewayService,
    private readonly repo: LabelingRepository,
    private readonly audit: AuditLogService,
  ) {}

  createTask(orgId: string, idempotencyKey: string, assetIds: string[], requestId?: string) {
    return this.idem.run(orgId, "POST:/label-tasks", idempotencyKey, async () => {
      const queueJob = await this.queue.enqueue("ai-label-jobs", "label-task", { orgId, assetIds });
      const task = await this.repo.createTask({
        orgId,
        queueJobId: queueJob.id,
        assetCount: assetIds.length,
      });
      await this.audit.log({
        orgId,
        action: "label_task.created",
        resourceType: "label_task",
        resourceId: task.id,
        requestId,
        metadata: { queueJobId: queueJob.id, assetCount: assetIds.length },
      });
      return task;
    });
  }

  getTask(id: string) {
    return this.repo.getTask(id);
  }

  confirmBatch(
    orgId: string,
    idempotencyKey: string,
    payload: { items: Array<{ assetId: string; lastKnownVersion: number; labels: unknown[] }> },
  ) {
    return this.idem.run(orgId, "POST:/labels/review/confirm-batch", idempotencyKey, async () => {
      const failures: Array<{ assetId: string; code: string; message: string }> = [];
      let succeeded = 0;
      for (const item of payload.items) {
        const asset = await this.repo.getAsset(orgId, item.assetId);
        if (!asset) {
          failures.push({ assetId: item.assetId, code: "NOT_FOUND", message: "creative not found" });
          continue;
        }
        if (asset.version !== item.lastKnownVersion) {
          failures.push({ assetId: item.assetId, code: "VERSION_CONFLICT", message: "version mismatch" });
          continue;
        }
        for (const label of item.labels as Array<any>) {
          await this.repo.upsertLabel({
            orgId,
            assetId: item.assetId,
            dimension: label.dimension,
            value: label.value,
            source: label.source ?? "human",
            confidence: label.confidence,
            isFinal: Boolean(label.isFinal),
          });
        }
        succeeded += 1;
      }
      await this.audit.log({
        orgId,
        action: "labels.batch_confirmed",
        resourceType: "asset_label",
        metadata: { succeeded, failed: failures.length },
      });
      return {
        succeeded,
        failed: failures.length,
        failures,
      };
    });
  }
}
