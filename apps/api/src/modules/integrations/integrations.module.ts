import { Module } from "@nestjs/common";
import { IntegrationsController } from "./integrations.controller";
import { IntegrationsRepository } from "./integrations.repository";
import { IntegrationsService } from "./integrations.service";

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, IntegrationsRepository],
})
export class IntegrationsModule {}
