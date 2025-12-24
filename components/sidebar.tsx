"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import clsx from "clsx";
import { Search, Star, PenSquare } from "lucide-react";
import { SessionNotesContext } from "@/app/notes/session-notes"; // 确保路径对
import { useMobileDetect } from "./mobile-detector"; // 确保路径对

export default function Sidebar() {
  const { notes, isLoading, selectedNoteSlug, setSelectedNoteSlug } = useContext(SessionNotesContext);
  const pathname = usePathname();
  const { isMobile, isMobileMenuOpen, setIsMobileMenuOpen } = useMobileDetect();
  const [searchTerm, setSearchTerm] = useState("");

  // 简单的搜索过滤逻辑
  const filteredNotes = notes.filter((note: any) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={clsx(
        "fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-zinc-200 bg-[#F2F1F6]/95 backdrop-blur-xl transition-transform dark:border-zinc-800 dark:bg-[#1c1c1e]/95 sm:translate-x-0",
        !isMobileMenuOpen && "-translate-x-full"
      )}
    >
      {/* === 顶部：红黄绿按钮 & 草稿入口 === */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        {/* Mac 窗口控制按钮 (装饰) */}
        <div className="flex space-x-2 group opacity-60 hover:opacity-100 transition-opacity">
          <div className="h-3 w-3 rounded-full bg-[#FF5F57] border border-[#E0443E]/50"></div>
          <div className="h-3 w-3 rounded-full bg-[#FEBC2E] border border-[#D89E24]/50"></div>
          <div className="h-3 w-3 rounded-full bg-[#28C840] border border-[#1AAB29]/50"></div>
        </div>

        {/* 新建草稿按钮 */}
        <Link
          href="/notes/new"
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <PenSquare size={20} />
        </Link>
      </div>

      {/* === 搜索栏 === */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border-none bg-[#E3E3E8] py-1.5 pl-9 pr-4 text-[15px] placeholder:text-zinc-500 focus:bg-white focus:ring-0 focus:outline-none dark:bg-[#2c2c2e] dark:text-zinc-100 dark:focus:bg-[#3a3a3c]"
          />
        </div>
      </div>

      {/* === 笔记列表 === */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {isLoading ? (
          <div className="p-4 text-center text-xs text-zinc-400">Loading...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-xs text-zinc-400">No notes found</div>
        ) : (
          filteredNotes.map((note: any) => {
            const isSelected = pathname === `/notes/${note.slug}`;
            
            return (
              <Link
                key={note.id}
                href={`/notes/${note.slug}`}
                className={clsx(
                  "group flex flex-col gap-0.5 rounded-lg p-3 transition-colors",
                  // 选中态：Apple Notes 经典的黄色高亮
                  isSelected
                    ? "bg-[#FBEBA6] dark:bg-[#D1A636]"
                    : "hover:bg-[#E3E3E8] dark:hover:bg-[#2c2c2e]"
                )}
                onClick={() => {
                  if (isMobile) setIsMobileMenuOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={clsx(
                      "truncate text-[15px] font-bold leading-tight",
                      isSelected ? "text-black" : "text-black dark:text-white"
                    )}
                  >
                    {note.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[14px]">
                  <span
                    className={clsx(
                      "flex-shrink-0",
                      isSelected ? "text-zinc-800" : "text-zinc-500 dark:text-zinc-400"
                    )}
                  >
                    {/* 只显示日期部分，简化 */}
                    {note.date.split('T')[0]}
                  </span>
                  
                  <span
                    className={clsx(
                      "truncate",
                      isSelected ? "text-zinc-700" : "text-zinc-400 dark:text-zinc-500"
                    )}
                  >
                    {/* 如果置顶，显示星星 */}
                    {note.pinned && (
                      <Star className="mr-1 inline-block h-3 w-3 fill-yellow-500 text-yellow-500" />
                    )}
                    No additional text
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}