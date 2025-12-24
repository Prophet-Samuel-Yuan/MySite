"use client";

import Sidebar from "./sidebar";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar 现在是独立的，自己管理状态和数据 */}
      <Sidebar />

      {/* 右侧主内容区域 */}
      {/* sm:pl-80 是为了给左侧固定的 Sidebar (w-80) 留出空间 */}
      <main className="flex-1 w-full sm:pl-80 transition-[padding] duration-300">
        {children}
      </main>
    </div>
  );
}