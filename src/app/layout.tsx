import type { Metadata } from "next";
import { M_PLUS_1p } from "next/font/google";
import "./globals.css";

const m_plus = M_PLUS_1p({
  weight: "400",
  subsets: ["latin"],
  variable: "--m-plus-1p",
});

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
      <body className={`${m_plus.variable}`}>
        {children}
      </body>
    </html>
  );
}
