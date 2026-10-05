import type { Firm, FirmOnboardingValues, User } from "@/types/workspace";

type Storage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem?: (key: string) => void;
};

export const USER_STORAGE_KEY = "obliq-preview-user-v1";
export const FIRM_STORAGE_KEY = "obliq-preview-firm-v1";

export const DEFAULT_MOCK_USER: User = {
  id: "usr_mock_new",
  authId: "auth0|mock_new",
  email: "",
  name: "",
  type: null,
  onboardedAt: null,
  createdAt: "2026-10-04T00:00:00.000Z",
};

export function isValidUser(value: unknown): value is User {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.authId === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.name === "string" &&
    (candidate.type === null ||
      candidate.type === "firm" ||
      candidate.type === "client") &&
    (candidate.onboardedAt === null ||
      typeof candidate.onboardedAt === "string") &&
    typeof candidate.createdAt === "string"
  );
}

export function isValidFirm(value: unknown): value is Firm {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    typeof candidate.createdBy === "string" &&
    typeof candidate.createdAt === "string"
  );
}

function getSafeStorage(customStorage?: Storage | null): Storage | null {
  if (customStorage !== undefined) return customStorage;
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

export function readUser(storage?: Storage | null): User {
  try {
    const s = getSafeStorage(storage);
    const saved = s?.getItem(USER_STORAGE_KEY);
    if (!saved) return DEFAULT_MOCK_USER;
    const parsed: unknown = JSON.parse(saved);
    return isValidUser(parsed) ? parsed : DEFAULT_MOCK_USER;
  } catch {
    return DEFAULT_MOCK_USER;
  }
}

export function readFirm(storage?: Storage | null): Firm | null {
  try {
    const s = getSafeStorage(storage);
    const saved = s?.getItem(FIRM_STORAGE_KEY);
    if (!saved) return null;
    const parsed: unknown = JSON.parse(saved);
    return isValidFirm(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveFirmOnboarding(
  values: FirmOnboardingValues,
  storage?: Storage | null,
): { user: User; firm: Firm } {
  const firmName = values.firmName.trim();
  if (!firmName) {
    throw new Error("Firm name is required");
  }

  const s = getSafeStorage(storage);
  const currentUser = readUser(s);
  const now = new Date().toISOString();

  const firmId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? `firm_${crypto.randomUUID()}`
      : `firm_${Date.now()}`;

  const firm: Firm = {
    id: firmId,
    name: firmName,
    createdBy: currentUser.id,
    contactEmail: values.contactEmail?.trim() || currentUser.email,
    location: values.location?.trim() || undefined,
    createdAt: now,
  };

  const updatedUser: User = {
    ...currentUser,
    type: "firm",
    onboardedAt: now,
  };

  try {
    s?.setItem(FIRM_STORAGE_KEY, JSON.stringify(firm));
    s?.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  } catch {
    // Keep in-memory return if storage is blocked
  }

  return { user: updatedUser, firm };
}

export function resetOnboarding(storage?: Storage | null): void {
  try {
    const s = getSafeStorage(storage);
    s?.removeItem?.(USER_STORAGE_KEY);
    s?.removeItem?.(FIRM_STORAGE_KEY);
  } catch {
    // Ignore storage issues
  }
}
