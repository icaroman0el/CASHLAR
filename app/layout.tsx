import { Manrope, Space_Grotesk } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { LocaleProvider } from "@/components/locale-provider";
import { NavigationLoadingProvider } from "@/components/navigation-loading-provider";
import { PwaRegister } from "@/components/pwa-register";
import { ThemeBoot } from "@/components/theme-boot";
import { localeCookieName, normalizeLocale } from "@/lib/i18n";
import { normalizeTheme, themeCookieName } from "@/lib/theme";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Cashlar | Controle Financeiro",
  description: "Sistema de controle financeiro pessoal com Next.js, Supabase e suporte a PWA.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "256x256" },
      { url: "/icon", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cashlar",
  },
};

export const viewport: Viewport = {
  themeColor: "#d39c3f",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(localeCookieName)?.value);
  const theme = normalizeTheme(cookieStore.get(themeCookieName)?.value);

  return (
    <html lang={locale} data-theme={theme} suppressHydrationWarning>
      <body className={`${manrope.variable} ${spaceGrotesk.variable}`}>
        <LocaleProvider initialLocale={locale}>
          <PwaRegister />
          <ThemeBoot />
          <NavigationLoadingProvider>{children}</NavigationLoadingProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
