"use client";

import { useLocale } from "@/components/locale-provider";

export function LanguageSelect() {
  const { locale, dictionary, setLocale } = useLocale();

  function handleChange(nextLocale: "pt-BR" | "en") {
    setLocale(nextLocale);
  }

  return (
    <label className="setting-select">
      <span className="sr-only">{dictionary.settings.languageTitle}</span>
      <select
        aria-label={dictionary.settings.languageTitle}
        value={locale}
        onChange={(event) => handleChange(event.target.value as "pt-BR" | "en")}
      >
        <option value="pt-BR">{dictionary.settings.languagePortuguese}</option>
        <option value="en">{dictionary.settings.languageEnglish}</option>
      </select>
    </label>
  );
}
