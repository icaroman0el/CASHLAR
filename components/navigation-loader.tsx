"use client";

import Image from "next/image";

type NavigationLoaderProps = {
  visible?: boolean;
};

export function NavigationLoader({
  visible = true,
}: NavigationLoaderProps) {
  return (
    <div
      className={`navigation-loader ${visible ? "navigation-loader--visible" : ""}`}
      aria-hidden={!visible}
    >
      <div className="navigation-loader__backdrop" />
      <div className="navigation-loader__card" role="status" aria-live="polite">
        <div className="navigation-loader__brand">
          <Image
            src="/cashlar-mark.png"
            alt="Ícone do Cashlar"
            width={96}
            height={96}
            className="navigation-loader__image"
            priority
          />
          <div className="navigation-loader__copy">
            <p className="card__label">Cashlar</p>
            <strong>Carregando</strong>
          </div>
        </div>
        <div className="navigation-loader__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
