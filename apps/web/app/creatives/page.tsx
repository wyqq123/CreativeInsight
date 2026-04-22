import { callApi } from "@/lib/api";

type Creative = {
  id: string;
  brandId: string;
  platform: string;
  winnerStatus: string;
  version: number;
};

export default async function CreativesPage() {
  const result = await callApi<{ data: { items: Creative[] } }>("/creatives");
  return (
    <main style={{ maxWidth: 860, margin: "24px auto", padding: 24, background: "#fff", borderRadius: 12 }}>
      <h2>胜出素材管理中心</h2>
      <ul>
        {result.data.items.map((item) => (
          <li key={item.id}>
            {item.id} | {item.platform} | {item.winnerStatus} | v{item.version}
          </li>
        ))}
      </ul>
    </main>
  );
}
