"use client";

import { createContext } from "react";

export const SessionNotesContext = createContext({
  notes: [],
  isLoading: false,
  refreshSessionNotes: async () => {},
  // 👇 关键修改：把 null 改成了 "" (空字符串)
  sessionId: "", 
  setSessionId: (id: any) => {}, 
});

export function SessionNotesProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function SessionNotes() {
  return null;
}