"use client";

import { createContext, useState, useContext } from "react";
import { useRouter } from "next/navigation";

// 定义 Context 的形状
interface SessionNotesContextType {
  notes: any[];
  isLoading: boolean;
  selectedNoteSlug: string | null;
  setSelectedNoteSlug: (slug: string | null) => void;
  // ✅ 修正 1：这里改成 Promise<void>，满足 CommandMenu 的要求
  refreshSessionNotes: () => Promise<void>; 
}

// 1. 创建 Context
export const SessionNotesContext = createContext<SessionNotesContextType>({
  notes: [],
  isLoading: false,
  selectedNoteSlug: null,
  setSelectedNoteSlug: () => {},
  // ✅ 修正 2：默认值也改成 async
  refreshSessionNotes: async () => {}, 
});

// 2. Provider 组件
export function SessionNotesProvider({ 
  children, 
  initialNotes = [] 
}: { 
  children: React.ReactNode;
  initialNotes?: any[];
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedNoteSlug, setSelectedNoteSlug] = useState<string | null>(null);
  const router = useRouter();

  // ✅ 修正 3：加上 async 关键字，变成异步函数
  const refreshSessionNotes = async () => {
    router.refresh();
    // 这里虽然 router.refresh 本身不返回 Promise，但加上 async 就会自动包裹成 Promise
  };

  return (
    <SessionNotesContext.Provider value={{ 
      notes, 
      isLoading: false, 
      selectedNoteSlug, 
      setSelectedNoteSlug,
      refreshSessionNotes 
    }}>
      {children}
    </SessionNotesContext.Provider>
  );
}

// 3. 方便的 Hook
export function useSessionNotes() {
  return useContext(SessionNotesContext);
}