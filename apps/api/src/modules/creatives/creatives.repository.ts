import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class CreativesRepository {
  constructor(private readonly prisma: PrismaService) {}

  list(orgId: string, brandId: string | undefined, page: number, pageSize: number) {
    return this.prisma.$transaction(async (tx) => {
      const where = { org_id: orgId, ...(brandId ? { brand_id: brandId } : {}) };
      const [items, total] = await Promise.all([
        tx.creativeAsset.findMany({
          where,
          orderBy: { created_at: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        tx.creativeAsset.count({ where }),
      ]);
      return { items, total };
    });
  }

  getForUpdate(orgId: string, id: string) {
    return this.prisma.creativeAsset.findFirst({ where: { id, org_id: orgId } });
  }

  updateWinnerStatus(orgId: string, id: string, lastKnownVersion: number, winnerStatus: string) {
    return this.prisma.creativeAsset.updateMany({
      where: { id, org_id: orgId, version: lastKnownVersion },
      data: { winner_status: winnerStatus, version: { increment: 1 } },
    });
  }
}
