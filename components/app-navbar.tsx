"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { AppLink } from "@/components/app-link";
import { AuthThemeToggle } from "@/components/auth-theme-toggle";
import { useLocale } from "@/components/locale-provider";
import { LogoutButton } from "@/components/logout-button";

type AppNavbarProps = {
  userName: string | null;
  userEmail: string | null;
};

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="navbar-dropdown__gear"
      focusable="false"
      aria-hidden="true"
    >
      <path
        d="M12 4.2 4.5 10v9.3h5.1v-5.4h4.8v5.4h5.1V10L12 4.2Zm0-2.2 9.2 7.1-.9 1.2-1.2-.9v11.4h-6.9v-5.4h-2.4v5.4H2.9V9.4l-1.2.9-.9-1.2L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="navbar-dropdown__gear"
      focusable="false"
      aria-hidden="true"
    >
      <path
        d="M10.9 2.4h2.2l.5 2.1a7.8 7.8 0 0 1 1.9.8l1.9-1.1 1.6 1.6-1 1.9c.3.6.6 1.2.8 1.9l2.1.5v2.2l-2.1.5a7.8 7.8 0 0 1-.8 1.9l1 1.9-1.6 1.6-1.9-1a7.8 7.8 0 0 1-1.9.8l-.5 2.1h-2.2l-.5-2.1a7.8 7.8 0 0 1-1.9-.8l-1.9 1-1.6-1.6 1.1-1.9a7.8 7.8 0 0 1-.8-1.9l-2.1-.5v-2.2l2.1-.5c.2-.7.5-1.3.8-1.9l-1.1-1.9L6.4 4.2l1.9 1.1c.6-.3 1.2-.6 1.9-.8l.7-2.1Zm1.1 6a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AppNavbar({
  userName,
  userEmail,
}: AppNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(true);
  const menuId = useId();
  const pathname = usePathname();
  const { dictionary, locale } = useLocale();
  const desktopNavCopy = useMemo(
    () =>
      locale === "en"
        ? {
          collapse: "Hide",
          expand: "Expand",
          toggleLabel: "Toggle desktop navigation",
        }
        : {
          collapse: "Esconder",
          expand: "Expandir",
          toggleLabel: "Alternar navegação lateral",
        },
    [locale],
  );

  const initials = useMemo(() => {
    const source = userName?.trim() || userEmail?.trim() || "Cashlar";

    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((value) => value[0]?.toUpperCase() ?? "")
      .join("");
  }, [userEmail, userName]);

  function getDesktopLinkClass(href: "/" | "/perfil" | "/configuracoes") {
    return `navbar-desktop-link ${pathname === href ? "navbar-desktop-link--active" : ""}`;
  }

  useEffect(() => {
    document.documentElement.dataset.desktopNav = isDesktopCollapsed ? "collapsed" : "expanded";
    window.localStorage.setItem(
      "cashlar-desktop-nav",
      isDesktopCollapsed ? "collapsed" : "expanded",
    );
  }, [isDesktopCollapsed]);

  return (
    <div className="navbar-wrap">
      <header className="app-navbar">
        <button
          type="button"
          className={`hamburger ${isOpen ? "hamburger--open" : ""}`}
          aria-label={dictionary.navbar.openMenu}
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <AppLink href="/" className="brand brand--centered" onClick={() => setIsOpen(false)}>
          <span className="brand__wordmark">
            <span className="brand__cash">Cash</span>
            <span className="brand__lar">Lar</span>
          </span>
        </AppLink>

        <AppLink href="/" className="navbar-icon" aria-label={dictionary.navbar.goHome}>
          <Image
            src="/cashlar-mark.png"
            alt="Ícone do Cashlar"
            width={120}
            height={120}
            className="navbar-icon__image navbar-icon__image--light"
            priority
          />
          <Image
            src="/cashlar-mark-dark.png"
            alt="Ãcone do Cashlar"
            width={156}
            height={156}
            className="navbar-icon__image navbar-icon__image--dark"
            priority
          />
        </AppLink>
        <div className="navbar-theme-slot">
          <AuthThemeToggle />
        </div>
      </header>

      <nav className={`navbar-desktop-nav ${isDesktopCollapsed ? "navbar-desktop-nav--collapsed" : ""}`}>
        <button
          type="button"
          className="navbar-desktop-nav__toggle"
          aria-label={desktopNavCopy.toggleLabel}
          aria-expanded={!isDesktopCollapsed}
          onClick={() => setIsDesktopCollapsed((current) => !current)}
        >
          <span className="navbar-desktop-nav__toggle-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="navbar-desktop-nav__toggle-label">
            {isDesktopCollapsed ? desktopNavCopy.expand : desktopNavCopy.collapse}
          </span>
          <span className="navbar-desktop-nav__toggle-arrow" aria-hidden="true">
            {isDesktopCollapsed ? "»" : "«"}
          </span>
        </button>

        <AppLink href="/" className={getDesktopLinkClass("/")}>
          <span className="navbar-dropdown__badge navbar-dropdown__badge--icon" aria-hidden="true">
            <HomeIcon />
          </span>
          <span className="navbar-desktop-link__copy">
            <strong>{dictionary.navbar.home}</strong>
            <small>{dictionary.navbar.goHome}</small>
          </span>
        </AppLink>

        <AppLink href="/perfil" className={getDesktopLinkClass("/perfil")}>
          <span className="navbar-dropdown__avatar" aria-hidden="true">{initials}</span>
          <span className="navbar-desktop-link__copy">
            <strong>{dictionary.navbar.profile}</strong>
            <small>{userName || dictionary.common.account}</small>
          </span>
        </AppLink>

        <AppLink href="/configuracoes" className={getDesktopLinkClass("/configuracoes")}>
          <span className="navbar-dropdown__badge navbar-dropdown__badge--icon" aria-hidden="true">
            <SettingsIcon />
          </span>
          <span className="navbar-desktop-link__copy">
            <strong>{dictionary.navbar.settings}</strong>
            <small>{dictionary.navbar.settingsDescription}</small>
          </span>
        </AppLink>

        <LogoutButton variant="navbar" />
      </nav>

      {isOpen ? (
        <>
          <button
            type="button"
            className="dropdown-backdrop"
            aria-label={dictionary.navbar.closeMenu}
            onClick={() => setIsOpen(false)}
          />
          <div id={menuId} className="navbar-dropdown">
            <AppLink
              href="/"
              className="navbar-dropdown__item"
              onClick={() => setIsOpen(false)}
            >
              <span className="navbar-dropdown__badge navbar-dropdown__badge--icon" aria-hidden="true">
                <HomeIcon />
              </span>
              <span>
                <strong>{dictionary.navbar.home}</strong>
              </span>
            </AppLink>

            <AppLink
              href="/perfil"
              className="navbar-dropdown__profile navbar-dropdown__profile--link"
              onClick={() => setIsOpen(false)}
            >
              <span className="navbar-dropdown__avatar">{initials}</span>
              <div>
                <strong>{userName || dictionary.common.account}</strong>
                <span>{dictionary.navbar.profileDescription}</span>
              </div>
            </AppLink>

            <AppLink
              href="/configuracoes"
              className="navbar-dropdown__item"
              onClick={() => setIsOpen(false)}
            >
              <span className="navbar-dropdown__badge navbar-dropdown__badge--icon" aria-hidden="true">
                <SettingsIcon />
              </span>
              <span>
                <strong>{dictionary.navbar.settings}</strong>
              </span>
            </AppLink>

            <LogoutButton variant="menu" />
          </div>
        </>
      ) : null}
    </div>
  );
}
