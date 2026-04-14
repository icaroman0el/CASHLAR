type SupportedLocale = "pt-BR" | "en";

export function getCurrencyFormatter(locale: SupportedLocale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  });
}

export function getDateFormatter(locale: SupportedLocale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });
}
