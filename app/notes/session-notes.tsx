"use client";

import { createContext } from "react";

// 1. 造一个假的 Context，假装里面有笔记数据
// 这样 command-menu.tsx 就不会报错了
export const SessionNotesContext = createContext({
  notes: [], // 空列表
  isLoading: false,
});

// 2. 默认导出，防止其他地方报错
export default function SessionNotes() {
  return null;
}