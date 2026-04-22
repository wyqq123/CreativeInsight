import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "CreativeInsight MVP",
  description: "Creative strategy insight platform MVP workspace",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f5f7fb" }}>{children}</body>
    </html>
  );
}
