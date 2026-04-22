import { Module } from "@nestjs/common";
import { LabelingController } from "./labeling.controller";
import { LabelingRepository } from "./labeling.repository";
import { LabelingService } from "./labeling.service";

@Module({
  controllers: [LabelingController],
  providers: [LabelingService, LabelingRepository],
})
export class LabelingModule {}
