"use client";

import { InstallAppButton } from "@/components/install-app-button";
import { LanguageSelect } from "@/components/language-select";
import { useLocale } from "@/components/locale-provider";

export function SettingsView() {
  const { dictionary } = useLocale();

  return (
    <main className="dashboard">
      <section className="settings-header">
        <h1>{dictionary.settings.title}</h1>
      </section>

      <section className="settings-list-card">
        <div className="settings-list">
          <article className="settings-list__section">
            <div className="settings-list__heading">
              <p className="card__label">{dictionary.settings.languageEyebrow}</p>
              <h2>{dictionary.settings.languageTitle}</h2>
              <p>{dictionary.settings.languageDescription}</p>
            </div>
            <LanguageSelect />
          </article>

          <article className="settings-list__section">
            <div className="settings-list__heading">
              <p className="card__label">{dictionary.settings.installEyebrow}</p>
              <h2>{dictionary.settings.installTitle}</h2>
              <p>{dictionary.settings.installDescription}</p>
            </div>
            <InstallAppButton />
            <div className="settings-apple-guide">
              <p className="card__label">{dictionary.install.iosGuideLabel}</p>
              <h3>{dictionary.settings.appleTitle}</h3>
              <ol className="settings-steps">
                <li>{dictionary.settings.appleStepOne}</li>
                <li>{dictionary.settings.appleStepTwo}</li>
                <li>{dictionary.settings.appleStepThree}</li>
              </ol>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
