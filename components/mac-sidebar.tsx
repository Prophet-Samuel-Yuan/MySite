"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import clsx from "clsx";
import { Search, Star, PenSquare } from "lucide-react";
import { SessionNotesContext } from "@/app/notes/session-notes";
import { useMobileDetect } from "./mobile-detector";

export default function MacSidebar() {
  const { notes, isLoading } = useContext(SessionNotesContext);
  const pathname = usePathname();
  const { isMobile, isMobileMenuOpen, setIsMobileMenuOpen } = useMobileDetect();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotes = notes.filter((note: any) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={clsx(
        "fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-gray-200 bg-[#F2F2F7] backdrop-blur-xl transition-transform dark:border-gray-700 dark:bg-[#1c1c1e] sm:translate-x-0",
        !isMobileMenuOpen && "-translate-x-full"
      )}
    >
      {/* 🔴🟡🟢 Mac 按钮区域 */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-[#FF5F57] border border-[#E0443E]/50 shadow-sm"></div>
          <div className="h-3 w-3 rounded-full bg-[#FEBC2E] border border-[#D89E24]/50 shadow-sm"></div>
          <div className="h-3 w-3 rounded-full bg-[#28C840] border border-[#1AAB29]/50 shadow-sm"></div>
        </div>
        <Link
          href="/notes/new"
          className="rounded-full p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          <PenSquare size={18} className="text-gray-600 dark:text-gray-300" />
        </Link>
      </div>

      {/* 搜索框 */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border-none bg-white/80 py-2 pl-9 pr-4 text-[13px] placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:bg-gray-700/80 dark:text-gray-100 dark:focus:bg-gray-600 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* 笔记列表 */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
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
                  "group flex flex-col gap-0.5 rounded-xl p-2.5 transition-all duration-150",
                  isSelected
                    ? "bg-[#FEDE4B] shadow-sm"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span className={clsx("truncate text-[13px] font-semibold leading-snug", isSelected ? "text-gray-900" : "text-gray-900 dark:text-gray-100")}>
                    {note.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[12px]">
                  <span className={clsx("flex-shrink-0 font-medium", isSelected ? "text-gray-700" : "text-gray-500 dark:text-gray-400")}>
                    {note.date ? note.date.substring(0, 10) : ""}
                  </span>
                  {note.pinned && (
                    <span>
                      <Star className="inline-block h-3 w-3 fill-yellow-500 text-yellow-500" />
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
