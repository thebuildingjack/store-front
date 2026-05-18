"use client";

import { useState } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
  });

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      suppressHydrationWarning
      onClick={toggle}
      className="px-4 py-2 rounded-xl border border-accent text-text font-base text-sm"
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}