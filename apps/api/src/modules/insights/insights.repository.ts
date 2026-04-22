import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class InsightsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findRunningByScope(orgId: string, scope: Record<string, unknown>) {
    return this.prisma.insightReport.findFirst({
      where: {
        org_id: orgId,
        status: { in: ["queued", "running"] },
        scope_jsonb: scope,
      },
      orderBy: { created_at: "desc" },
    });
  }

  createReport(data: {
    orgId: string;
    queueJobId?: string;
    scope: Record<string, unknown>;
    tier: string;
    assetCount: number;
    summary: string;
  }) {
    return this.prisma.insightReport.create({
      data: {
        org_id: data.orgId,
        queue_job_id: data.queueJobId,
        scope_jsonb: data.scope as Prisma.InputJsonValue,
        asset_count: data.assetCount,
        report_tier: data.tier,
        status: "queued",
        summary_text: data.summary,
      },
    });
  }

  getReport(id: string) {
    return this.prisma.insightReport.findUnique({ where: { id } });
  }

  updatePdf(id: string, pdfUrl: string) {
    return this.prisma.insightReport.update({
      where: { id },
      data: { pdf_url: pdfUrl },
    });
  }
}
