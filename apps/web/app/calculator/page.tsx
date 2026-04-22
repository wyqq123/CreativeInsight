import { callApi } from "@/lib/api";

export default async function CalculatorPage() {
  const data = await callApi<{ data: { sampleSizeEach: number; recommendedDays: number; diagnosis: string } }>(
    "/calculator/estimate",
    {
      method: "POST",
      body: JSON.stringify({
        platform: "qianchuan",
        randomizationUnit: "user",
        coreMetric: "ctr",
        baseline: 0.025,
        mde: 0.15,
        alpha: 0.05,
        power: 0.8,
        trafficDaily: 50000,
        attritionRate: 0.1,
        kVariantOverControl: 1,
      }),
    },
  );

  return (
    <main style={{ maxWidth: 800, margin: "24px auto", padding: 24, background: "#fff", borderRadius: 12 }}>
      <h2>AB Test 实验设计计算器</h2>
      <p>每组样本量：{data.data.sampleSizeEach}</p>
      <p>建议周期（天）：{data.data.recommendedDays}</p>
      <p>诊断结果：{data.data.diagnosis}</p>
    </main>
  );
}
