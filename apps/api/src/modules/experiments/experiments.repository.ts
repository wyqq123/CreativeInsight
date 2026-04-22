import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class ExperimentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createConfig(data: {
    orgId: string;
    platform: string;
    randomizationUnit?: string;
    coreMetric: string;
    guardMetric?: string;
    baseline: number;
    mde: number;
    alpha?: number;
    power?: number;
    trafficDaily?: number;
    attritionRate?: number;
    sampleSizeEach: number;
    recommendedDays: number;
    diagnosis: string;
  }) {
    return this.prisma.experimentConfig.create({
      data: {
        org_id: data.orgId,
        platform: data.platform,
        randomization_unit: data.randomizationUnit,
        core_metric: data.coreMetric,
        guard_metric: data.guardMetric,
        baseline: data.baseline,
        mde: data.mde,
        alpha: data.alpha,
        power: data.power,
        traffic_daily: data.trafficDaily,
        attrition_rate: data.attritionRate,
        sample_size_each: data.sampleSizeEach,
        recommended_days: data.recommendedDays,
        diagnosis: data.diagnosis,
      },
    });
  }
}
