"use client";

// 👇 注意：这里改成了引用新文件 mac-sidebar
import MacSidebar from "./mac-sidebar"; 

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* 使用新的 MacSidebar 组件 */}
      <MacSidebar />

      {/* 右侧主内容区域 */}
      <main className="flex-1 w-full sm:pl-80 transition-[padding] duration-300">
        {children}
      </main>
    </div>
  );
}