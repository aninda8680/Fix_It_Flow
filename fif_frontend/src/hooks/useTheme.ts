import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

// ✅ Enable logs only in development
const THEME_DEBUG = import.meta.env.DEV;

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" ? "dark" : "light";
  });

  // ✅ Prevent duplicate logs in React 18 StrictMode
  const hasLoggedInit = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);

    if (THEME_DEBUG && !hasLoggedInit.current) {
      console.log(`[theme] applied → ${theme}`);
      hasLoggedInit.current = true;
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";

      if (THEME_DEBUG) {
        console.log(`[theme] toggled → ${prev} → ${next}`);
      }

      return next;
    });
  };

  return { theme, toggleTheme };
}
