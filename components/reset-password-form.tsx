"use client";

import { useEffect, useState } from "react";
import { useNavigationLoading } from "@/components/navigation-loading-provider";
import { createClient } from "@/lib/supabase/client";

type ResetPasswordFormProps = {
  submitLabel: string;
  successRedirectMessage: string;
  fieldLabels: {
    password: string;
    passwordHint: string;
    confirmPassword: string;
    confirmPasswordHint: string;
    passwordTooShort: string;
    passwordMismatch: string;
    recoverySessionMissing: string;
  };
};

export function ResetPasswordForm({
  submitLabel,
  successRedirectMessage,
  fieldLabels,
}: ResetPasswordFormProps) {
  const [supabase] = useState(() => createClient());
  const [message, setMessage] = useState<string | null>(null);
  const [messageKind, setMessageKind] = useState<"error" | "success">("error");
  const [isPending, setIsPending] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const startLoading = useNavigationLoading();

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      setHasRecoverySession(Boolean(user));
      setIsCheckingSession(false);
    }

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      setHasRecoverySession(Boolean(session?.user));
      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    setMessageKind("error");

    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirm_password") ?? "");

    if (password.length < 6) {
      setMessage(fieldLabels.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setMessage(fieldLabels.passwordMismatch);
      return;
    }

    setIsPending(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setMessageKind("error");
      setIsPending(false);
      return;
    }

    await supabase.auth.signOut();
    setMessage(successRedirectMessage);
    setMessageKind("success");
    startLoading();
    window.location.assign(`/login?message=${encodeURIComponent(successRedirectMessage)}&kind=success`);
  }

  return (
    <form className="transaction-form" action={handleSubmit}>
      <label>
        {fieldLabels.password}
        <input type="password" name="password" placeholder={fieldLabels.passwordHint} minLength={6} required />
      </label>

      <label>
        {fieldLabels.confirmPassword}
        <input
          type="password"
          name="confirm_password"
          placeholder={fieldLabels.confirmPasswordHint}
          minLength={6}
          required
        />
      </label>

      {!isCheckingSession && !hasRecoverySession ? (
        <p className="form-message form-message--error">{fieldLabels.recoverySessionMissing}</p>
      ) : null}

      {message ? (
        <p className={`form-message ${messageKind === "success" ? "form-message--success" : "form-message--error"}`}>
          {message}
        </p>
      ) : null}

      <button type="submit" className="button" disabled={isPending || isCheckingSession || !hasRecoverySession}>
        {isPending ? `${submitLabel}...` : submitLabel}
      </button>
    </form>
  );
}
