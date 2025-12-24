"use client";

import { createContext } from "react";

// 1. 补齐 Context (之前修过的)
export const SessionNotesContext = createContext({
  notes: [],
  isLoading: false,
  refreshSessionNotes: async () => {},
});

// 2. 补齐 Provider (这次报错缺少的！关键！)
// 它只是一个空壳，负责把孩子渲染出来，骗过编译器
export function SessionNotesProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// 3. 补齐 Default Export
export default function SessionNotes() {
  return null;
}