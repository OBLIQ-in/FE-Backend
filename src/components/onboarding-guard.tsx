"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/use-onboarding";
import type { ReactNode } from "react";

/**
 * Wraps dashboard routes and silently redirects un-onboarded users to /onboarding.
 *
 * SSR safety: we render `null` on the server and on the very first client paint,
 * so the SSR HTML and client output are always identical (no hydration mismatch).
 * After mount, we read localStorage and apply redirect / guard logic.
 */
export function OnboardingGuard({ children }: { children: ReactNode }) {
  const { isOnboarded, ready } = useOnboarding();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // /onboarding is public — don't redirect from it
  const isDashboardRoute = pathname !== "/onboarding";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ready) return;
    if (isDashboardRoute && !isOnboarded) {
      router.replace("/onboarding");
    }
  }, [mounted, ready, isOnboarded, isDashboardRoute, router]);

  // Before mount: render nothing (matches server output exactly → no hydration mismatch).
  if (!mounted) return null;

  // After mount, while localStorage is being read: blank screen so there's no flash.
  if (!ready) {
    return (
      <div
        style={{ minHeight: "100dvh", background: "var(--bg, #f7f7f7)" }}
        aria-hidden="true"
      />
    );
  }

  // Unonboarded user on a dashboard route — redirect in flight, show nothing.
  if (isDashboardRoute && !isOnboarded) return null;

  return <>{children}</>;
}
