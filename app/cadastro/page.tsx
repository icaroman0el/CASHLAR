import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AuthCard } from "@/components/auth-card";
import { signup } from "@/app/login/actions";
import { getDictionary, localeCookieName, normalizeLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

type SignupPageProps = {
  searchParams: Promise<{ message?: string; kind?: "error" | "success" }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
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
      title={dictionary.auth.signupTitle}
      description={dictionary.auth.signupDescription}
      mode="signup"
      submitLabel={dictionary.auth.signupSubmit}
      submitAction={signup}
      alternateHref="/login"
      alternateLabel={dictionary.auth.haveAccount}
      alternateActionLabel={dictionary.auth.doLogin}
      eyebrowLabel={dictionary.auth.signupCardEyebrow}
      cardTitle={dictionary.auth.signupCardTitle}
      heroPoints={dictionary.auth.heroPoints}
      fieldLabels={{
        name: dictionary.auth.name,
        yourName: dictionary.auth.yourName,
        email: dictionary.auth.email,
        emailPlaceholder: dictionary.auth.emailPlaceholder,
        password: dictionary.auth.password,
        passwordHint: dictionary.auth.passwordHint,
      }}
      message={message}
      messageKind={kind}
      variant="login-showcase"
      heroImageSrc="/login-background-desktop.png"
    />
  );
}
