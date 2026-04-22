import { BadRequestException, Body, Controller, Headers, Post } from "@nestjs/common";
import { ok } from "../../common/response";
import { requireOrgId } from "../../common/tenant";
import { ExperimentsService } from "./experiments.service";

@Controller()
export class ExperimentsController {
  constructor(private readonly service: ExperimentsService) {}

  @Post("calculator/estimate")
  estimate(@Body() body: any, @Headers("x-request-id") requestId?: string) {
    return ok(requestId, this.service.estimate(body));
  }

  @Post("experiment-configs")
  async createConfig(
    @Body() body: any,
    @Headers("x-org-id") xOrgId?: string,
    @Headers("idempotency-key") idempotencyKey?: string,
    @Headers("x-request-id") requestId?: string,
  ) {
    if (!idempotencyKey) throw new BadRequestException("Idempotency-Key header is required");
    const orgId = requireOrgId(xOrgId);
    return ok(requestId, await this.service.createExperimentConfig(orgId, idempotencyKey, body, requestId));
  }
}
