import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "./prisma.service";

@Injectable()
export class IdempotencyService {
  private readonly ttlMs = 24 * 60 * 60 * 1000;
  constructor(private readonly prisma: PrismaService) {}

  async run<T>(
    orgId: string,
    endpoint: string,
    idempotencyKey: string,
    producer: () => Promise<T> | T,
  ): Promise<T> {
    await this.prisma.idempotencyRecord.deleteMany({ where: { expires_at: { lte: new Date() } } });
    const found = await this.prisma.idempotencyRecord.findUnique({
      where: {
        org_id_endpoint_idempotency_key: {
          org_id: orgId,
          endpoint,
          idempotency_key: idempotencyKey,
        },
      },
    });
    if (found && found.expires_at > new Date()) {
      return found.response_jsonb as T;
    }
    const payload = await producer();
    const asJson = JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue;
    await this.prisma.idempotencyRecord.upsert({
      where: {
        org_id_endpoint_idempotency_key: {
          org_id: orgId,
          endpoint,
          idempotency_key: idempotencyKey,
        },
      },
      update: {
        response_jsonb: asJson,
        expires_at: new Date(Date.now() + this.ttlMs),
      },
      create: {
        org_id: orgId,
        endpoint,
        idempotency_key: idempotencyKey,
        response_jsonb: asJson,
        expires_at: new Date(Date.now() + this.ttlMs),
      },
    });
    return payload;
  }
}
