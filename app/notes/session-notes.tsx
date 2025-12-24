"use client";

import { createContext, useState, useContext } from "react";

// 定义 Context 的形状
interface SessionNotesContextType {
  notes: any[];
  isLoading: boolean;
  selectedNoteSlug: string | null;
  setSelectedNoteSlug: (slug: string | null) => void;
}

// 1. 创建 Context
export const SessionNotesContext = createContext<SessionNotesContextType>({
  notes: [],
  isLoading: false,
  selectedNoteSlug: null,
  setSelectedNoteSlug: () => {},
});

// 2. 这里的定义必须包含 initialNotes
export function SessionNotesProvider({ 
  children, 
  initialNotes = [] // 👈 关键：这里接收传入的数据
}: { 
  children: React.ReactNode;
  initialNotes?: any[]; // 👈 关键：这里告诉 TS 我们允许这个参数
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedNoteSlug, setSelectedNoteSlug] = useState<string | null>(null);

  return (
    <SessionNotesContext.Provider value={{ 
      notes, 
      isLoading: false, 
      selectedNoteSlug, 
      setSelectedNoteSlug 
    }}>
      {children}
    </SessionNotesContext.Provider>
  );
}

// 3. 方便的 Hook
export function useSessionNotes() {
  return useContext(SessionNotesContext);
}