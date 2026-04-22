import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { BillingModule } from "./modules/billing/billing.module";
import { CommonModule } from "./common/common.module";
import { CreativesModule } from "./modules/creatives/creatives.module";
import { ExperimentsModule } from "./modules/experiments/experiments.module";
import { InsightsModule } from "./modules/insights/insights.module";
import { IntegrationsModule } from "./modules/integrations/integrations.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { LabelingModule } from "./modules/labeling/labeling.module";

@Module({
  imports: [
    CommonModule,
    AuthModule,
    BillingModule,
    ExperimentsModule,
    IntegrationsModule,
    CreativesModule,
    LabelingModule,
    InsightsModule,
    JobsModule,
  ],
})
export class AppModule {}
