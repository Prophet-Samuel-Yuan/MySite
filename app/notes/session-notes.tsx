"use client";

import { createContext } from "react";

// 这是一个“全能”的假数据包，包含了 Sidebar 和 CommandMenu 所有可能需要的属性
export const SessionNotesContext = createContext({
  notes: [],
  isLoading: false,
  refreshSessionNotes: async () => {},
  // 👇 这次补齐了这俩“钉子户”
  sessionId: null, 
  setSessionId: (id: any) => {}, 
});

// 这是一个空的 Provider，负责把页面包起来，不让它报错
export function SessionNotesProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function SessionNotes() {
  return null;
}