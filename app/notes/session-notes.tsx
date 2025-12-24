"use client";

import { createContext } from "react";

// 补齐缺少的“勺子”
export const SessionNotesContext = createContext({
  notes: [],
  isLoading: false,
  refreshSessionNotes: () => {}, // 👈 加了这一行空函数，骗过编译器
});

export default function SessionNotes() {
  return null;
}