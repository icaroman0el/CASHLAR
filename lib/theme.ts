export const themeStorageKey = "cashlar-theme";
export const themeCookieName = "cashlar-theme";

export type AppTheme = "light" | "dark";

const themeListeners = new Set<() => void>();

export function normalizeTheme(value?: string | null): AppTheme {
  return value === "dark" ? "dark" : "light";
}

export function resolveBrowserTheme(): AppTheme {
  if (typeof document !== "undefined") {
    const currentTheme = document.documentElement.dataset.theme;

    if (currentTheme === "dark" || currentTheme === "light") {
      return currentTheme;
    }
  }

  if (typeof window !== "undefined") {
    const storedTheme = window.localStorage.getItem(themeStorageKey);

    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }

  return "light";
}

export function persistTheme(theme: AppTheme) {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(themeStorageKey, theme);
  document.cookie = `${themeCookieName}=${encodeURIComponent(theme)}; path=/; max-age=31536000; samesite=lax`;
}

function notifyThemeListeners() {
  themeListeners.forEach((listener) => listener());
}

export function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);

  return () => {
    themeListeners.delete(listener);
  };
}

export function getThemeSnapshot(): AppTheme {
  return resolveBrowserTheme();
}

export function getThemeServerSnapshot(): AppTheme {
  return "light";
}

export function setAppTheme(theme: AppTheme) {
  persistTheme(theme);
  notifyThemeListeners();
}

export function syncThemeWithBrowser() {
  const theme = resolveBrowserTheme();
  persistTheme(theme);
  notifyThemeListeners();
  return theme;
}
