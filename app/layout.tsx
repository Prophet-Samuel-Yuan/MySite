import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 👇 关键：这一行必须有，而且全文件只能出现一次
export const runtime = 'edge';

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
        {children}
      </body>
    </html>
  );
}