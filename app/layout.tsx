import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // 👈 这一行最重要，它负责把“衣服”穿上

// 加载一个好看的英文字体
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Digital Garden",
  description: "Thinking out loud.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 这里就是显示你写的所有页面内容 */}
        {children}
      </body>
    </html>
  );
}