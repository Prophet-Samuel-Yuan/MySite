"use client";

import { useState, useEffect } from "react";

export default function NewNotePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mounted, setMounted] = useState(false);

  // 1. 进页面时：读取缓存
  useEffect(() => {
    setMounted(true);
    const savedTitle = localStorage.getItem("draft-title");
    const savedContent = localStorage.getItem("draft-content");
    if (savedTitle) setTitle(savedTitle);
    if (savedContent) setContent(savedContent);
  }, []);

  // 2. 写字时：自动存入缓存
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("draft-title", title);
      localStorage.setItem("draft-content", content);
    }
  }, [title, content, mounted]);

  // 防止服务端渲染不匹配
  if (!mounted) return null;

  return (
    <div className="flex h-full flex-col bg-white px-8 py-10 dark:bg-zinc-950 sm:px-12">
      {/* 顶部状态栏：模仿 Apple Notes 的时间显示 */}
      <div className="mb-8 flex items-center justify-center text-xs font-medium text-zinc-400">
        <span>{new Date().toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}</span>
      </div>

      {/* 标题输入 */}
      <input
        type="text"
        placeholder="New Note"
        className="mb-4 w-full bg-transparent text-4xl font-bold text-zinc-900 placeholder:text-zinc-300 focus:outline-none dark:text-zinc-50 dark:placeholder:text-zinc-700"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 正文输入 */}
      <textarea
        placeholder="Start writing..."
        className="flex-1 w-full resize-none bg-transparent text-lg leading-relaxed text-zinc-700 placeholder:text-zinc-300 focus:outline-none dark:text-zinc-300 dark:placeholder:text-zinc-700"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}