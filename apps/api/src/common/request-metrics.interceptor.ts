import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { MetricsService } from "./metrics.service";

@Injectable()
export class RequestMetricsInterceptor implements NestInterceptor {
  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest<{ method: string; route?: { path?: string } }>();
    const res = context.switchToHttp().getResponse<{ statusCode: number }>();
    return next.handle().pipe(
      tap(() => {
        this.metrics.recordRequest(
          req.method ?? "UNKNOWN",
          req.route?.path ?? "unknown_route",
          res.statusCode ?? 0,
          Date.now() - now,
        );
      }),
    );
  }
}
