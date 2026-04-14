"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "@/components/locale-provider";
import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  setAppTheme,
  subscribeTheme,
} from "@/lib/theme";

export function ThemeToggle() {
  const { dictionary } = useLocale();
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setAppTheme(nextTheme);
  }

  return (
    <button type="button" className="setting-toggle" onClick={toggleTheme}>
      <span>
        <strong>{dictionary.theme.title}</strong>
        <small>{theme === "dark" ? dictionary.theme.darkEnabled : dictionary.theme.darkDisabled}</small>
      </span>
      <span className={`toggle-pill toggle-pill--${theme}`}>
        <span className="toggle-thumb" />
      </span>
    </button>
  );
}
