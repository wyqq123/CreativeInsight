import { Module } from "@nestjs/common";
import { InsightsController } from "./insights.controller";
import { InsightsRepository } from "./insights.repository";
import { InsightsService } from "./insights.service";

@Module({
  controllers: [InsightsController],
  providers: [InsightsService, InsightsRepository],
})
export class InsightsModule {}
