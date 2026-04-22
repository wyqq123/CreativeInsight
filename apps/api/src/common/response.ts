import { randomUUID } from "crypto";

export type Envelope<T> = { requestId: string; code: string; message: string; data: T };

export function getRequestId(requestId?: string) {
  return requestId || `req_${randomUUID()}`;
}

export function ok<T>(requestId: string | undefined, data: T): Envelope<T> {
  return { requestId: getRequestId(requestId), code: "OK", message: "success", data };
}
