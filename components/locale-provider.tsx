"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getDictionary,
  localeCookieName,
  localeStorageKey,
  normalizeLocale,
  type AppLocale,
  type Dictionary,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: AppLocale;
  dictionary: Dictionary;
  setLocale: (locale: AppLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  children: ReactNode;
  initialLocale: AppLocale;
};

function persistLocale(locale: AppLocale) {
  if (typeof window === "undefined") {
    return;
  }

  document.documentElement.lang = locale;
  window.localStorage.setItem(localeStorageKey, locale);
  document.cookie = `${localeCookieName}=${encodeURIComponent(locale)}; path=/; max-age=31536000; samesite=lax`;
}

export function LocaleProvider({
  children,
  initialLocale,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<AppLocale>(normalizeLocale(initialLocale));
  const setLocale = useCallback((nextLocale: AppLocale) => {
    const normalizedLocale = normalizeLocale(nextLocale);
    persistLocale(normalizedLocale);
    setLocaleState(normalizedLocale);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dictionary: getDictionary(locale),
      setLocale,
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider.");
  }

  return context;
}
