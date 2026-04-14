"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (!isVisible || !promptEvent) {
    return null;
  }

  return (
    <div className="install-card">
      <div>
        <p className="card__label">Acesso rapido</p>
        <strong>Instale o Cashlar no seu celular</strong>
        <p>Assim ele abre como app e fica mais pratico de registrar gastos no dia a dia.</p>
      </div>
      <button
        type="button"
        className="button"
        onClick={async () => {
          await promptEvent.prompt();
          await promptEvent.userChoice;
          setIsVisible(false);
          setPromptEvent(null);
        }}
      >
        Instalar app
      </button>
    </div>
  );
}
