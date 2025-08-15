"use client";
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const preferredTheme = prefersDark ? "dark" : "light";
      setTheme(preferredTheme);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(preferredTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(newTheme);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border shadow transition"
      style={{
        borderColor: 'var(--header-text)',
        backgroundColor: 'transparent',
        color: 'var(--header-text)'
      }}
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.75 15.5A7.25 7.25 0 0 1 8.5 6.25c0-.41.04-.81.1-1.2A9 9 0 1 0 19 19.9c-.39.06-.79.1-1.2.1a7.25 7.25 0 0 1-7.25-7.25Z"/></svg>
      ) : (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V3.5A.75.75 0 0 1 12 2.75Zm0 16a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75Zm9.25-6.75a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM5.25 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75Zm12.02 5.02a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Zm-12.02 0a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0Zm12.02-10.04a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0Zm-12.02 0a.75.75 0 0 1-1.06 0L3.19 6.19a.75.75 0 1 1 1.06-1.06l1.06 1.06a.75.75 0 0 1 0 1.06ZM12 7.25A4.75 4.75 0 1 0 12 16.75 4.75 4.75 0 0 0 12 7.25Z"/></svg>
      )}
    </button>
  );
}
