import Image from "next/image";
import { cookies } from "next/headers";
import { AppLink } from "@/components/app-link";
import { AuthThemeToggle } from "@/components/auth-theme-toggle";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { getDictionary, localeCookieName, normalizeLocale } from "@/lib/i18n";

export default async function ResetPasswordPage() {
  const locale = normalizeLocale((await cookies()).get(localeCookieName)?.value);
  const dictionary = getDictionary(locale);

  return (
    <div className="auth-shell auth-shell--login-showcase">
      <section className="auth-card auth-card--showcase card">
        <div className="auth-card__brand">
          <p className="eyebrow auth-card__brand-name">Cashlar</p>
          <AuthThemeToggle />
        </div>

        <div className="auth-card__showcase-head">
          <p className="card__label">{dictionary.auth.resetPasswordCardEyebrow}</p>
          <h1>{dictionary.auth.resetPasswordCardTitle}</h1>
        </div>

        <p className="auth-card__showcase-description">{dictionary.auth.resetPasswordDescription}</p>

        <ResetPasswordForm
          submitLabel={dictionary.auth.resetPasswordSubmit}
          successRedirectMessage={dictionary.auth.resetPasswordSuccess}
          fieldLabels={{
            password: dictionary.auth.password,
            passwordHint: dictionary.auth.passwordHint,
            confirmPassword: dictionary.auth.confirmPassword,
            confirmPasswordHint: dictionary.auth.confirmPasswordHint,
            passwordTooShort: dictionary.auth.passwordTooShort,
            passwordMismatch: dictionary.auth.passwordMismatch,
            recoverySessionMissing: dictionary.auth.recoverySessionMissing,
          }}
        />

        <p className="auth-footer">
          <AppLink href="/login" className="text-link">
            {dictionary.auth.backToLogin}
          </AppLink>
        </p>
      </section>

      <section className="auth-hero auth-hero--showcase card">
        <div className="auth-hero__media">
          <Image
            src="/login-background-desktop.png"
            alt={dictionary.auth.resetPasswordTitle}
            fill
            priority
            className="auth-hero__image"
            sizes="(max-width: 1100px) 100vw, 58vw"
          />
        </div>
      </section>
    </div>
  );
}
