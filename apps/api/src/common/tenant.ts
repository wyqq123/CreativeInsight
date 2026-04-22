import { BadRequestException } from "@nestjs/common";

export function requireOrgId(orgId?: string) {
  if (!orgId) {
    throw new BadRequestException("X-Org-Id header is required");
  }
  return orgId;
}
