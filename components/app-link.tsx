"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ComponentProps } from "react";
import { useNavigationLoading } from "@/components/navigation-loading-provider";

type AppLinkProps = ComponentProps<typeof Link>;

export function AppLink({
  href,
  onClick,
  target,
  ...props
}: AppLinkProps) {
  const pathname = usePathname();
  const startLoading = useNavigationLoading();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
      || target === "_blank"
    ) {
      return;
    }

    if (typeof href === "string") {
      const targetPath = href.split(/[?#]/)[0] || "/";

      if (targetPath === pathname) {
        return;
      }
    }

    startLoading();
  }

  return <Link href={href} onClick={handleClick} target={target} {...props} />;
}
