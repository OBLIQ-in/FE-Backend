"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_MOCK_USER,
  readFirm,
  readUser,
  resetOnboarding,
  saveFirmOnboarding,
} from "./onboarding-state";
import type { Firm, FirmOnboardingValues, User } from "@/types/workspace";

export type OnboardingContextValue = {
  user: User;
  firm: Firm | null;
  isOnboarded: boolean;
  ready: boolean;
  submitOnboarding: (
    values: FirmOnboardingValues,
  ) => Promise<{ user: User; firm: Firm }>;
  reset: () => void;
  refresh: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(DEFAULT_MOCK_USER);
  const [firm, setFirm] = useState<Firm | null>(null);
  const [ready, setReady] = useState(false);

  const load = useCallback(() => {
    const loadedUser = readUser();
    const loadedFirm = readFirm();
    setUser(loadedUser);
    setFirm(loadedFirm);
    setReady(true);
  }, []);

  useEffect(() => {
    load();
    const handleSync = () => load();
    window.addEventListener("storage", handleSync);
    window.addEventListener("obliq-onboarding-change", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("obliq-onboarding-change", handleSync);
    };
  }, [load]);

  const submitOnboarding = useCallback(async (values: FirmOnboardingValues) => {
    const result = saveFirmOnboarding(values);
    setUser(result.user);
    setFirm(result.firm);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("obliq-onboarding-change"));
    }
    return result;
  }, []);

  const reset = useCallback(() => {
    resetOnboarding();
    setUser(DEFAULT_MOCK_USER);
    setFirm(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("obliq-onboarding-change"));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { resetOnboarding?: () => void }).resetOnboarding =
        () => {
          reset();
          window.location.href = "/onboarding";
        };
    }
  }, [reset]);

  const isOnboarded = Boolean(user.onboardedAt);

  return React.createElement(
    OnboardingContext.Provider,
    {
      value: {
        user,
        firm,
        isOnboarded,
        ready,
        submitOnboarding,
        reset,
        refresh: load,
      },
    },
    children,
  );
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (context) {
    return context;
  }

  // Fallback for isolated usage (e.g. outside provider in tests)
  const user = readUser();
  const firm = readFirm();
  return {
    user,
    firm,
    isOnboarded: Boolean(user.onboardedAt),
    ready: true,
    submitOnboarding: async (values) => saveFirmOnboarding(values),
    reset: () => resetOnboarding(),
    refresh: () => {},
  };
}
