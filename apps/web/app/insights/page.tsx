import { callApi } from "@/lib/api";

export default async function InsightsPage() {
  const report = await callApi<{ data: { id: string; status: string; summary: string } }>("/insight-reports", {
    method: "POST",
    headers: { "Idempotency-Key": `ik_${Date.now()}` },
    body: JSON.stringify({
      scope: { brandId: "brand_demo", dateFrom: "2026-04-01", dateTo: "2026-04-22" },
      tier: "pro",
    }),
  });

  return (
    <main style={{ maxWidth: 860, margin: "24px auto", padding: 24, background: "#fff", borderRadius: 12 }}>
      <h2>AI 打标与洞察报告</h2>
      <p>报告任务ID：{report.data.id}</p>
      <p>状态：{report.data.status}</p>
      <p>摘要：{report.data.summary}</p>
    </main>
  );
}
