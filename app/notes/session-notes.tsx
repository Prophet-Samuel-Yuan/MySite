"use client";

import { createContext, useState, useContext } from "react";
import { useRouter } from "next/navigation"; // 引入路由控制

// 定义 Context 的形状
interface SessionNotesContextType {
  notes: any[];
  isLoading: boolean;
  selectedNoteSlug: string | null;
  setSelectedNoteSlug: (slug: string | null) => void;
  refreshSessionNotes: () => void; // ✅ 补上了这个缺失的定义
}

// 1. 创建 Context
export const SessionNotesContext = createContext<SessionNotesContextType>({
  notes: [],
  isLoading: false,
  selectedNoteSlug: null,
  setSelectedNoteSlug: () => {},
  refreshSessionNotes: () => {}, // ✅ 补上默认值
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

  // ✅ 实现了真正的刷新逻辑
  const refreshSessionNotes = () => {
    router.refresh(); // 这会告诉 Next.js 重新去服务器拉取最新数据
  };

  return (
    <SessionNotesContext.Provider value={{ 
      notes, 
      isLoading: false, 
      selectedNoteSlug, 
      setSelectedNoteSlug,
      refreshSessionNotes // ✅ 把功能传下去
    }}>
      {children}
    </SessionNotesContext.Provider>
  );
}

// 3. 方便的 Hook
export function useSessionNotes() {
  return useContext(SessionNotesContext);
}