import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "虹ヶ咲学園 学生証ジェネレーター",
  description: "学生証風の画像を作成することができます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
