"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { NavigationLoader } from "@/components/navigation-loader";

type NavigationLoadingContextValue = {
  startLoading: () => void;
};

const NavigationLoadingContext = createContext<NavigationLoadingContextValue | null>(null);

export function NavigationLoadingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const previousRouteKeyRef = useRef(routeKey);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (previousRouteKeyRef.current === routeKey) {
      return;
    }

    previousRouteKeyRef.current = routeKey;

    const frame = window.requestAnimationFrame(() => {
      setIsLoading(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [routeKey]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsLoading(false);
    }, 8000);

    return () => window.clearTimeout(timeout);
  }, [isLoading]);

  const value = useMemo<NavigationLoadingContextValue>(() => ({
    startLoading: () => setIsLoading(true),
  }), []);

  return (
    <NavigationLoadingContext.Provider value={value}>
      {children}
      <NavigationLoader visible={isLoading} />
    </NavigationLoadingContext.Provider>
  );
}

export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext);

  return context?.startLoading ?? (() => undefined);
}
