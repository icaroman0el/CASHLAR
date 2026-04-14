"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "@/components/locale-provider";
import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  setAppTheme,
  subscribeTheme,
} from "@/lib/theme";

export function AuthThemeToggle() {
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

  const label = theme === "dark"
    ? dictionary.theme.darkEnabled
    : dictionary.theme.darkDisabled;

  return (
    <button
      type="button"
      className={`auth-theme-toggle auth-theme-toggle--${theme}`}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <span className="auth-theme-toggle__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M12 4.5a.9.9 0 0 1 .9.9v1.4a.9.9 0 1 1-1.8 0V5.4a.9.9 0 0 1 .9-.9Zm0 12.7a.9.9 0 0 1 .9.9v1.4a.9.9 0 1 1-1.8 0v-1.4a.9.9 0 0 1 .9-.9Zm7.5-4.4a.9.9 0 1 1 0-1.8h1.4a.9.9 0 1 1 0 1.8h-1.4Zm-16.4 0a.9.9 0 1 1 0-1.8h1.4a.9.9 0 1 1 0 1.8H3.1Zm13.2 5.2a.9.9 0 0 1 1.3 0l1 1a.9.9 0 0 1-1.3 1.3l-1-1a.9.9 0 0 1 0-1.3Zm-10.8-10.8a.9.9 0 0 1 1.3 0l1 1A.9.9 0 1 1 6.5 9l-1-1a.9.9 0 0 1 0-1.3Zm12.1 0a.9.9 0 0 1 0 1.3l-1 1A.9.9 0 1 1 15.3 8l1-1a.9.9 0 0 1 1.3 0ZM7.8 16.9a.9.9 0 0 1 0 1.3l-1 1a.9.9 0 0 1-1.3-1.3l1-1a.9.9 0 0 1 1.3 0ZM12 8.1a3.9 3.9 0 1 1 0 7.8 3.9 3.9 0 0 1 0-7.8Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="auth-theme-toggle__track" aria-hidden="true">
        <span className="auth-theme-toggle__thumb" />
      </span>
      <span className="auth-theme-toggle__icon auth-theme-toggle__icon--moon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path
            d="M14.8 3.8a7.7 7.7 0 1 0 5.4 13.2 8.6 8.6 0 1 1-5.4-13.2Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  );
}
