"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV === "development") {
      Promise.all([
        navigator.serviceWorker.getRegistrations().then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister())),
        ),
        caches.keys().then((keys) =>
          Promise.all(keys.filter((key) => key.startsWith("cashlar-")).map((key) => caches.delete(key))),
        ),
      ]).then(() => {
        const reloadFlag = "cashlar-dev-sw-reset";

        if (navigator.serviceWorker.controller && !window.sessionStorage.getItem(reloadFlag)) {
          window.sessionStorage.setItem(reloadFlag, "1");
          window.location.reload();
          return;
        }

        window.sessionStorage.removeItem(reloadFlag);
      });

      return;
    }

    navigator.serviceWorker
      .register("/sw.js?cashlar-v2")
      .then((registration) => registration.update())
      .catch(() => {
        return;
      });
  }, []);

  return null;
}
