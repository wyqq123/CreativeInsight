const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

export async function callApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Org-Id": "org_demo",
      "X-Request-Id": `req_${Date.now()}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return (await res.json()) as T;
}
