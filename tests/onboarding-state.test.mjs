import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_MOCK_USER,
  FIRM_STORAGE_KEY,
  USER_STORAGE_KEY,
  isValidFirm,
  isValidUser,
  readFirm,
  readUser,
  resetOnboarding,
  saveFirmOnboarding,
} from "../src/lib/onboarding-state.ts";

function createMemoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return map.get(key) ?? null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
  };
}

test("readUser returns DEFAULT_MOCK_USER with un-onboarded state when storage is empty", () => {
  const storage = createMemoryStorage();
  const user = readUser(storage);
  assert.equal(user.id, DEFAULT_MOCK_USER.id);
  assert.equal(user.name, DEFAULT_MOCK_USER.name);
  assert.equal(user.onboardedAt, null);
  assert.equal(user.type, null);
});

test("readUser ignores malformed or invalid stored users", () => {
  const storage = createMemoryStorage({
    [USER_STORAGE_KEY]: JSON.stringify({ id: 123, invalid: true }),
  });
  const user = readUser(storage);
  assert.equal(user.id, DEFAULT_MOCK_USER.id);
  assert.equal(user.onboardedAt, null);
});

test("readFirm returns null when storage is empty or corrupt", () => {
  const storage = createMemoryStorage({
    [FIRM_STORAGE_KEY]: "invalid json",
  });
  assert.equal(readFirm(storage), null);
});

test("saveFirmOnboarding requires non-empty firm name", () => {
  const storage = createMemoryStorage();
  assert.throws(
    () => saveFirmOnboarding({ firmName: "   " }, storage),
    /Firm name is required/,
  );
});

test("saveFirmOnboarding creates firm record and marks user as onboarded", () => {
  const storage = createMemoryStorage();
  const result = saveFirmOnboarding(
    {
      firmName: "Apex Chartered Accountants",
      contactEmail: "contact@apexca.in",
      location: "Mumbai",
    },
    storage,
  );

  assert.ok(result.firm.id.startsWith("firm_"));
  assert.equal(result.firm.name, "Apex Chartered Accountants");
  assert.equal(result.firm.contactEmail, "contact@apexca.in");
  assert.equal(result.firm.location, "Mumbai");
  assert.equal(result.firm.createdBy, DEFAULT_MOCK_USER.id);
  assert.ok(result.firm.createdAt);

  assert.equal(result.user.type, "firm");
  assert.ok(result.user.onboardedAt);

  // Verify persistence in storage
  const persistedUser = readUser(storage);
  const persistedFirm = readFirm(storage);

  assert.equal(persistedUser.type, "firm");
  assert.equal(persistedUser.onboardedAt, result.user.onboardedAt);
  assert.equal(persistedFirm?.name, "Apex Chartered Accountants");
  assert.equal(isValidFirm(persistedFirm), true);
  assert.equal(isValidUser(persistedUser), true);
});

test("resetOnboarding clears user and firm storage", () => {
  const storage = createMemoryStorage();
  saveFirmOnboarding({ firmName: "Test Firm" }, storage);
  assert.ok(readFirm(storage));
  assert.ok(readUser(storage).onboardedAt);

  resetOnboarding(storage);
  assert.equal(readFirm(storage), null);
  assert.equal(readUser(storage).onboardedAt, null);
});
