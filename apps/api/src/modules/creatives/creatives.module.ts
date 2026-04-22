import { Module } from "@nestjs/common";
import { CreativesController } from "./creatives.controller";
import { CreativesRepository } from "./creatives.repository";
import { CreativesService } from "./creatives.service";

@Module({
  controllers: [CreativesController],
  providers: [CreativesService, CreativesRepository],
})
export class CreativesModule {}
