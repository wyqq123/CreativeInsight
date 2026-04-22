import { Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AuditLogService } from "./audit-log.service";
import { IdempotencyService } from "./idempotency.service";
import { MetricsService } from "./metrics.service";
import { PrismaService } from "./prisma.service";
import { QueueGatewayService } from "./queue-gateway.service";
import { RequestMetricsInterceptor } from "./request-metrics.interceptor";

@Global()
@Module({
  providers: [
    PrismaService,
    IdempotencyService,
    QueueGatewayService,
    AuditLogService,
    MetricsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestMetricsInterceptor,
    },
  ],
  exports: [PrismaService, IdempotencyService, QueueGatewayService, AuditLogService, MetricsService],
})
export class CommonModule {}
