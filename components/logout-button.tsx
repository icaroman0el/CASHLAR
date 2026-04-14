"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useNavigationLoading } from "@/components/navigation-loading-provider";
import { useLocale } from "@/components/locale-provider";
import { createClient } from "@/lib/supabase/client";

type LogoutButtonProps = {
  variant?: "default" | "menu" | "navbar";
};

export function LogoutButton({
  variant = "default",
}: LogoutButtonProps) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { dictionary } = useLocale();
  const startLoading = useNavigationLoading();

  async function handleLogout() {
    setMessage(null);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
      return;
    }

    startTransition(() => {
      startLoading();
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <div className={`logout-block logout-block--${variant}`}>
      <button
        type="button"
        className={`ghost-button logout-button logout-button--${variant}`}
        onClick={handleLogout}
        disabled={isPending}
      >
        {variant === "navbar" ? (
          <>
            <span className="logout-button__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="navbar-dropdown__gear" focusable="false">
                <path
                  d="M10 3.5h6.2a2.3 2.3 0 0 1 2.3 2.3v12.4a2.3 2.3 0 0 1-2.3 2.3H10v-1.8h6.2a.5.5 0 0 0 .5-.5V5.8a.5.5 0 0 0-.5-.5H10V3.5Zm1.1 4.1 1.3 1.3-1.8 1.8h7.4v1.8h-7.4l1.8 1.8-1.3 1.3-4-4 4-4Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="navbar-desktop-link__copy">
              <strong>{isPending ? dictionary.logout.signingOut : dictionary.logout.signOut}</strong>
            </span>
          </>
        ) : (
          isPending ? dictionary.logout.signingOut : dictionary.logout.signOut
        )}
      </button>
      {message ? <p className="form-message form-message--error">{message}</p> : null}
    </div>
  );
}
