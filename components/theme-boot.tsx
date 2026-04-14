"use client";

import { useEffect } from "react";
import { syncThemeWithBrowser } from "@/lib/theme";

export function ThemeBoot() {
  useEffect(() => {
    syncThemeWithBrowser();
  }, []);

  return null;
}
