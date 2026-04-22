import { Injectable } from "@nestjs/common";
import { AuditLogService } from "../../common/audit-log.service";
import { IdempotencyService } from "../../common/idempotency.service";
import { QueueGatewayService } from "../../common/queue-gateway.service";
import { InsightsRepository } from "./insights.repository";

@Injectable()
export class InsightsService {
  constructor(
    private readonly idem: IdempotencyService,
    private readonly queue: QueueGatewayService,
    private readonly repo: InsightsRepository,
    private readonly audit: AuditLogService,
  ) {}

  createReport(orgId: string, idempotencyKey: string, body: any, requestId?: string) {
    const scopeKey = JSON.stringify(body.scope ?? {});
    return this.idem.run(orgId, `POST:/insight-reports:${scopeKey}`, idempotencyKey, async () => {
      const existingRunning = await this.repo.findRunningByScope(orgId, body.scope ?? {});
      if (existingRunning) {
        return existingRunning;
      }
      const queueJob = await this.queue.enqueue("report-jobs", "generate-report", { orgId, scope: body.scope });
      const report = await this.repo.createReport({
        orgId,
        queueJobId: queueJob.id,
        scope: body.scope ?? {},
        tier: body.tier ?? "free",
        assetCount: 5,
        summary: "MVP placeholder insight summary",
      });
      await this.audit.log({
        orgId,
        action: "insight_report.created",
        resourceType: "insight_report",
        resourceId: report.id,
        requestId,
        metadata: { queueJobId: queueJob.id },
      });
      return report;
    });
  }

  getReport(id: string) {
    return this.repo.getReport(id);
  }

  exportPdf(orgId: string, idempotencyKey: string, id: string, requestId?: string) {
    return this.idem.run(orgId, `POST:/insight-reports/${id}/export-pdf`, idempotencyKey, async () => {
      const pdfUrl = `https://example.com/reports/${id}.pdf`;
      await this.repo.updatePdf(id, pdfUrl);
      await this.audit.log({
        orgId,
        action: "insight_report.pdf_exported",
        resourceType: "insight_report",
        resourceId: id,
        requestId,
      });
      return {
        reportId: id,
        status: "ready",
        pdfUrl,
      };
    });
  }
}
