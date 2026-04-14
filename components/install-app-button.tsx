"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/locale-provider";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type InstallStatus = "browser" | "apple" | "standalone" | "ready" | "installed";

type InstallAppButtonProps = {
  variant?: "card" | "inline";
};

function getInstallEnvironment() {
  if (typeof window === "undefined") {
    return {
      isAppleMobile: false,
      isStandalone: false,
    };
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isAppleMobile = /iphone|ipad|ipod/.test(userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

  return {
    isAppleMobile,
    isStandalone,
  };
}

export function InstallAppButton({
  variant = "inline",
}: InstallAppButtonProps) {
  const { dictionary } = useLocale();
  const [environment] = useState(getInstallEnvironment);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState<InstallStatus>(() =>
    environment.isStandalone ? "standalone" : environment.isAppleMobile ? "apple" : "browser",
  );

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      setStatus("ready");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const feedback = {
    browser: dictionary.install.browserReady,
    apple: dictionary.install.appleHint,
    standalone: dictionary.install.standalone,
    ready: dictionary.install.ready,
    installed: dictionary.install.installed,
  }[status];

  async function handleInstall() {
    if (!promptEvent) {
      setStatus(environment.isAppleMobile ? "apple" : environment.isStandalone ? "standalone" : "browser");
      return;
    }

    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
    setStatus("installed");
  }

  if (variant === "card") {
    return (
      <article className="feature-card feature-card--install">
        <span className="card__label">{dictionary.settings.installEyebrow}</span>
        <strong>{dictionary.settings.installTitle}</strong>
        <p>{feedback}</p>
        <button type="button" className="ghost-button" onClick={handleInstall}>
          {dictionary.install.action}
        </button>
      </article>
    );
  }

  return (
    <div className="setting-row setting-row--stack">
      <div>
        <strong>{dictionary.install.title}</strong>
        <p>{feedback}</p>
      </div>
      <button type="button" className="ghost-button" onClick={handleInstall}>
        {dictionary.install.action}
      </button>
    </div>
  );
}
