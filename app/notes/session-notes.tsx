"use client";

import { createContext } from "react";

// 我们在这里把所有 Sidebar 需要用到的“空头支票”都开好
export const SessionNotesContext = createContext({
  notes: [],
  isLoading: false,
  refreshSessionNotes: async () => {},
  sessionId: "",
  setSessionId: (id: any) => {},
  // 👇 新增：补上这两个属性，专门给 Sidebar 用
  selectedNoteSlug: null as string | null,
  setSelectedNoteSlug: (slug: string | null) => {},
});

export function SessionNotesProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function SessionNotes() {
  return null;
}