"use client";

import { useState, useEffect } from "react";

export function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(false);
  // 👇 新增：管理侧边栏菜单的开关状态
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 定义检测逻辑
    const checkMobile = () => {
      const isMobileNow = window.innerWidth < 640;
      setIsMobile(isMobileNow);
      // 如果变成了大屏幕，自动打开菜单；如果是手机，默认关闭
      if (!isMobileNow) {
        setIsMobileMenuOpen(true);
      } else {
        setIsMobileMenuOpen(false);
      }
    };

    // 初始化检测
    checkMobile();

    // 监听窗口大小变化
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 👇 关键修改：返回一个对象，而不是单纯的 boolean
  return { 
    isMobile, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen 
  };
}