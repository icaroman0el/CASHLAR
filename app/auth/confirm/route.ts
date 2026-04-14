import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { localeCookieName, normalizeLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextPath = searchParams.get("next");
  const locale = normalizeLocale(request.cookies.get(localeCookieName)?.value);
  const redirectTo = request.nextUrl.clone();

  if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
    redirectTo.pathname = nextPath;
  } else {
    redirectTo.pathname = "/";
  }

  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("next");

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  const invalidMessage = locale === "en"
    ? "Invalid or expired confirmation link."
    : "Link de confirmacao invalido ou expirado.";

  return NextResponse.redirect(
    new URL(`/login?message=${encodeURIComponent(invalidMessage)}&kind=error`, request.url),
  );
}
