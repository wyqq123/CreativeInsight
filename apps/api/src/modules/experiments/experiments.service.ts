import { Injectable } from "@nestjs/common";
import { AuditLogService } from "../../common/audit-log.service";
import { IdempotencyService } from "../../common/idempotency.service";
import { ExperimentsRepository } from "./experiments.repository";

@Injectable()
export class ExperimentsService {
  constructor(
    private readonly idem: IdempotencyService,
    private readonly repo: ExperimentsRepository,
    private readonly audit: AuditLogService,
  ) {}

  estimate(body: any) {
    const sampleSizeEach = Math.ceil((16 * Math.max(0.001, body.baseline ?? 0.01)) / Math.max(0.001, body.mde ?? 0.01));
    const recommendedDays = Math.max(
      1,
      Math.ceil((sampleSizeEach * 2) / Math.max(1, Number(body.trafficDaily ?? 1))),
    );
    const diagnosis = recommendedDays <= 14 ? "ready" : "traffic_insufficient";
    return {
      sampleSizeEach,
      recommendedDays,
      diagnosis,
      notes: ["MVP estimator placeholder; replace with production statistics engine."],
    };
  }

  async createExperimentConfig(orgId: string, idempotencyKey: string, body: any, requestId?: string) {
    return this.idem.run(orgId, "POST:/experiment-configs", idempotencyKey, async () => {
      const estimate = this.estimate(body);
      const payload = await this.repo.createConfig({
        orgId,
        platform: body.platform,
        randomizationUnit: body.randomizationUnit,
        coreMetric: body.coreMetric,
        guardMetric: body.guardMetric,
        baseline: body.baseline,
        mde: body.mde,
        alpha: body.alpha,
        power: body.power,
        trafficDaily: body.trafficDaily,
        attritionRate: body.attritionRate,
        sampleSizeEach: estimate.sampleSizeEach,
        recommendedDays: estimate.recommendedDays,
        diagnosis: estimate.diagnosis,
      });
      await this.audit.log({
        orgId,
        action: "experiment_config.created",
        resourceType: "experiment_config",
        resourceId: payload.id,
        requestId,
      });
      return payload;
    });
  }
}
