import Image from "next/image";
import { AppLink } from "@/components/app-link";
import { EmailPasswordLoginForm } from "@/components/email-password-login-form";
import { AuthThemeToggle } from "@/components/auth-theme-toggle";

type AuthCardProps = {
  title: string;
  description: string;
  mode: "login" | "signup";
  submitLabel: string;
  submitAction: (formData: FormData) => Promise<void>;
  alternateHref: string;
  alternateLabel: string;
  alternateActionLabel: string;
  eyebrowLabel: string;
  cardTitle: string;
  heroPoints: readonly string[];
  fieldLabels: {
    name: string;
    yourName: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordHint: string;
    forgotPassword?: string;
    forgotPasswordEmailRequired?: string;
    resetPasswordEmailSent?: string;
    sendingResetLink?: string;
  };
  message?: string;
  messageKind?: "error" | "success";
  variant?: "default" | "login-showcase";
  heroImageSrc?: string;
};

export function AuthCard({
  title,
  description,
  mode,
  submitLabel,
  submitAction,
  alternateHref,
  alternateLabel,
  alternateActionLabel,
  eyebrowLabel,
  cardTitle,
  heroPoints,
  fieldLabels,
  message,
  messageKind = "error",
  variant = "default",
  heroImageSrc,
}: AuthCardProps) {
  const isLoginShowcase = variant === "login-showcase";

  const formContent = (
    <>
      {mode === "login" ? (
        <EmailPasswordLoginForm
          submitLabel={submitLabel}
          initialMessage={message}
          initialMessageKind={messageKind}
          fieldLabels={{
            email: fieldLabels.email,
            emailPlaceholder: fieldLabels.emailPlaceholder,
            password: fieldLabels.password,
            passwordHint: fieldLabels.passwordHint,
            forgotPassword: fieldLabels.forgotPassword ?? "",
            forgotPasswordEmailRequired: fieldLabels.forgotPasswordEmailRequired ?? "",
            resetPasswordEmailSent: fieldLabels.resetPasswordEmailSent ?? "",
            sendingResetLink: fieldLabels.sendingResetLink ?? "",
          }}
        />
      ) : (
        <form className="transaction-form" action={submitAction}>
          <label>
            {fieldLabels.name}
            <input type="text" name="full_name" placeholder={fieldLabels.yourName} required />
          </label>

          <label>
            {fieldLabels.email}
            <input type="email" name="email" placeholder={fieldLabels.emailPlaceholder} required />
          </label>

          <label>
            {fieldLabels.password}
            <input type="password" name="password" placeholder={fieldLabels.passwordHint} minLength={6} required />
          </label>

          {message ? (
            <p className={`form-message ${messageKind === "success" ? "form-message--success" : "form-message--error"}`}>
              {message}
            </p>
          ) : null}

          <button type="submit" className="button">
            {submitLabel}
          </button>
        </form>
      )}

      <p className="auth-footer">
        {alternateLabel}{" "}
        <AppLink href={alternateHref} className="text-link">
          {alternateActionLabel}
        </AppLink>
      </p>
    </>
  );

  if (isLoginShowcase) {
    return (
      <div className="auth-shell auth-shell--login-showcase">
        <section className="auth-card auth-card--showcase card">
          <div className="auth-card__brand">
            <p className="eyebrow auth-card__brand-name">Cashlar</p>
            <AuthThemeToggle />
          </div>

          <div className="auth-card__showcase-head">
            <p className="card__label">{eyebrowLabel}</p>
            <h1>{cardTitle}</h1>
          </div>

          {formContent}
        </section>

        <section className="auth-hero auth-hero--showcase card">
          <div className="auth-hero__media">
            <Image
              src={heroImageSrc ?? "/login-background.png"}
              alt={title}
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

  return (
    <div className="auth-shell">
      <section className="auth-hero card">
        <p className="eyebrow">Cashlar</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="auth-hero__points">
          {heroPoints.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </div>
      </section>

      <section className="auth-card card">
        <div className="panel__header">
          <div>
            <p className="card__label">{eyebrowLabel}</p>
            <h2>{cardTitle}</h2>
          </div>
        </div>

        {formContent}
      </section>
    </div>
  );
}
