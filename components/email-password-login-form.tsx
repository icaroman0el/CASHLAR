"use client";

import { useRef, useState } from "react";
import { useNavigationLoading } from "@/components/navigation-loading-provider";
import { createClient } from "@/lib/supabase/client";

type EmailPasswordLoginFormProps = {
  submitLabel: string;
  initialMessage?: string;
  initialMessageKind?: "error" | "success";
  fieldLabels: {
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordHint: string;
    forgotPassword: string;
    forgotPasswordEmailRequired: string;
    resetPasswordEmailSent: string;
    sendingResetLink: string;
  };
};

export function EmailPasswordLoginForm({
  submitLabel,
  initialMessage,
  initialMessageKind = "error",
  fieldLabels,
}: EmailPasswordLoginFormProps) {
  const [supabase] = useState(() => createClient());
  const [message, setMessage] = useState<string | null>(initialMessage ?? null);
  const [messageKind, setMessageKind] = useState<"error" | "success">(initialMessageKind);
  const [isPending, setIsPending] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const startLoading = useNavigationLoading();
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage(null);
    setMessageKind("error");

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setMessageKind("error");
      setIsPending(false);
      return;
    }

    startLoading();
    window.location.assign("/");
  }

  async function handleForgotPassword() {
    const email = emailInputRef.current?.value.trim() ?? "";

    if (!email) {
      setMessage(fieldLabels.forgotPasswordEmailRequired);
      setMessageKind("error");
      return;
    }

    setIsSendingReset(true);
    setMessage(null);

    const redirectTo = new URL("/redefinir-senha", window.location.origin).toString();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setMessage(error.message);
      setMessageKind("error");
      setIsSendingReset(false);
      return;
    }

    setMessage(fieldLabels.resetPasswordEmailSent);
    setMessageKind("success");
    setIsSendingReset(false);
  }

  return (
    <form className="transaction-form" action={handleSubmit}>
      <label>
        {fieldLabels.email}
        <input
          ref={emailInputRef}
          type="email"
          name="email"
          placeholder={fieldLabels.emailPlaceholder}
          required
        />
      </label>

      <label>
        {fieldLabels.password}
        <input type="password" name="password" placeholder={fieldLabels.passwordHint} minLength={6} required />
      </label>

      <div className="auth-form__support">
        <button
          type="button"
          className="auth-form__link"
          onClick={handleForgotPassword}
          disabled={isPending || isSendingReset}
        >
          {isSendingReset ? fieldLabels.sendingResetLink : fieldLabels.forgotPassword}
        </button>
      </div>

      {message ? (
        <p className={`form-message ${messageKind === "success" ? "form-message--success" : "form-message--error"}`}>
          {message}
        </p>
      ) : null}

      <button type="submit" className="button" disabled={isPending || isSendingReset}>
        {isPending ? `${submitLabel}...` : submitLabel}
      </button>
    </form>
  );
}
