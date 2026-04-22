import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class LabelingRepository {
  constructor(private readonly prisma: PrismaService) {}

  createTask(data: { orgId: string; queueJobId?: string; assetCount: number }) {
    return this.prisma.labelTask.create({
      data: {
        org_id: data.orgId,
        queue_job_id: data.queueJobId,
        status: "queued",
        asset_count: data.assetCount,
        progress: 0,
      },
    });
  }

  getTask(id: string) {
    return this.prisma.labelTask.findUnique({ where: { id } });
  }

  getAsset(orgId: string, assetId: string) {
    return this.prisma.creativeAsset.findFirst({ where: { id: assetId, org_id: orgId } });
  }

  upsertLabel(data: {
    orgId: string;
    assetId: string;
    dimension: string;
    value: string;
    source: string;
    confidence?: number;
    isFinal: boolean;
  }) {
    return this.prisma.assetLabel.upsert({
      where: {
        asset_id_label_dimension_label_value_is_final: {
          asset_id: data.assetId,
          label_dimension: data.dimension,
          label_value: data.value,
          is_final: data.isFinal,
        },
      },
      update: {
        source: data.source,
        confidence: data.confidence,
      },
      create: {
        org_id: data.orgId,
        asset_id: data.assetId,
        label_dimension: data.dimension,
        label_value: data.value,
        source: data.source,
        confidence: data.confidence,
        is_final: data.isFinal,
      },
    });
  }
}
