import { Injectable } from "@nestjs/common";
import { metrics } from "@opentelemetry/api";

@Injectable()
export class MetricsService {
  private readonly meter = metrics.getMeter("creativeinsight-api", "0.1.0");
  private readonly requestCounter = this.meter.createCounter("api_requests_total");
  private readonly requestDuration = this.meter.createHistogram("api_request_duration_ms");
  private readonly taskCounter = this.meter.createCounter("task_state_transitions_total");

  recordRequest(method: string, route: string, statusCode: number, durationMs: number) {
    this.requestCounter.add(1, { method, route, status_code: String(statusCode) });
    this.requestDuration.record(durationMs, { method, route, status_code: String(statusCode) });
  }

  recordTaskTransition(queue: string, status: string) {
    this.taskCounter.add(1, { queue, status });
  }
}
