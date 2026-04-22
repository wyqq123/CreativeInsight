import { Module } from "@nestjs/common";
import { JobsInternalController } from "./jobs-internal.controller";
import { JobsInternalService } from "./jobs-internal.service";

@Module({
  controllers: [JobsInternalController],
  providers: [JobsInternalService],
})
export class JobsModule {}
