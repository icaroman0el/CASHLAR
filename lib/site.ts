function normalizeSiteUrl(value?: string | null) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const envUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

  if (envUrl) {
    return envUrl;
  }

  const vercelUrl = normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL);

  if (vercelUrl) {
    return vercelUrl;
  }

  return "http://localhost:3000";
}
