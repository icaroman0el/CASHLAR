import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AuthCard } from "@/components/auth-card";
import { login } from "@/app/login/actions";
import { getDictionary, localeCookieName, normalizeLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ message?: string; kind?: "error" | "success" }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [{ message, kind }, supabase] = await Promise.all([searchParams, createClient()]);
  const locale = normalizeLocale((await cookies()).get(localeCookieName)?.value);
  const dictionary = getDictionary(locale);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <AuthCard
      title={dictionary.auth.loginTitle}
      description={dictionary.auth.loginDescription}
      mode="login"
      submitLabel={dictionary.auth.loginSubmit}
      submitAction={login}
      alternateHref="/cadastro"
      alternateLabel={dictionary.auth.noAccount}
      alternateActionLabel={dictionary.auth.createAccount}
      eyebrowLabel={dictionary.auth.loginCardEyebrow}
      cardTitle={dictionary.auth.loginCardTitle}
      heroPoints={dictionary.auth.heroPoints}
      fieldLabels={{
        name: dictionary.auth.name,
        yourName: dictionary.auth.yourName,
        email: dictionary.auth.email,
        emailPlaceholder: dictionary.auth.emailPlaceholder,
        password: dictionary.auth.password,
        passwordHint: dictionary.auth.passwordHint,
        forgotPassword: dictionary.auth.forgotPassword,
        forgotPasswordEmailRequired: dictionary.auth.forgotPasswordEmailRequired,
        resetPasswordEmailSent: dictionary.auth.resetPasswordEmailSent,
        sendingResetLink: dictionary.auth.sendingResetLink,
      }}
      message={message}
      messageKind={kind}
      variant="login-showcase"
      heroImageSrc="/login-background-desktop.png"
    />
  );
}
