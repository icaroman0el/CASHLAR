type SupportedLocale = "pt-BR" | "en";

export const categories = [
  "Salario",
  "Freelance",
  "Moradia",
  "Mercado",
  "Transporte",
  "Lazer",
  "Saude",
  "Educacao",
  "Assinaturas",
  "Outros",
] as const;

const categoryLabelMap: Record<SupportedLocale, Record<string, string>> = {
  "pt-BR": {
    Salario: "Salário",
    Freelance: "Freelance",
    Moradia: "Moradia",
    Mercado: "Mercado",
    Transporte: "Transporte",
    Lazer: "Lazer",
    Saude: "Saúde",
    Educacao: "Educação",
    Assinaturas: "Assinaturas",
    Outros: "Outros",
  },
  en: {
    Salario: "Salary",
    Freelance: "Freelance",
    Moradia: "Housing",
    Mercado: "Groceries",
    Transporte: "Transport",
    Lazer: "Leisure",
    Saude: "Health",
    Educacao: "Education",
    Assinaturas: "Subscriptions",
    Outros: "Other",
  },
};

function normalizeCategory(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getCanonicalCategory(value: string) {
  const normalizedValue = normalizeCategory(value);

  return (
    categories.find((category) => normalizeCategory(category) === normalizedValue)
    ?? value
  );
}

export function getCategoryLabel(value: string, locale: SupportedLocale = "pt-BR") {
  const canonicalCategory = getCanonicalCategory(value);

  return (
    categoryLabelMap[locale][canonicalCategory]
    ?? categoryLabelMap["pt-BR"][canonicalCategory]
    ?? value
  );
}
