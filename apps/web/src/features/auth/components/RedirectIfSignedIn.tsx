"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { APP_COUNTERPART } from "../routes";
import { useSession } from "../session";

/**
 * Covers the case the middleware cannot: the visitor signs in while already on a public page
 * (for example from the header on `/`). The middleware handles every other case, before render.
 * Renders nothing.
 */
export function RedirectIfSignedIn() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useSession();

  useEffect(() => {
    if (loading || !user) return;
    const target = APP_COUNTERPART[pathname];
    if (!target) return;
    router.replace(`${target}${window.location.search}`);
  }, [loading, user, pathname, router]);

  return null;
}
