"use client";

import { createContext } from "react";

export const SessionNotesContext = createContext({
  notes: [],
  isLoading: false,
  // 👇 关键修改：加了 async，把它伪装成一个异步 Promise，骗过编译器
  refreshSessionNotes: async () => {},
});

export default function SessionNotes() {
  return null;
}