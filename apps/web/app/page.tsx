const modules = [
  { key: "A", title: "AB Test 计算器", path: "/calculator", desc: "估算样本量与实验周期" },
  { key: "B", title: "胜出素材管理", path: "/creatives", desc: "跨平台聚合、筛选和标记" },
  { key: "C", title: "AI 打标与洞察报告", path: "/insights", desc: "打标任务与策略报告流水线" },
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 960, margin: "40px auto", padding: 24 }}>
      <h1>CreativeInsight MVP 架构已激活</h1>
      <p>前端、后端、API 接口与数据模型已经按 PRD 核心链路完成首版骨架搭建。</p>
      <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
        {modules.map((m) => (
          <a
            key={m.key}
            href={m.path}
            style={{ padding: 16, borderRadius: 10, textDecoration: "none", color: "#1f2937", background: "#fff" }}
          >
            <strong>{m.title}</strong>
            <div>{m.desc}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
