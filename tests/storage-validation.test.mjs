import assert from "node:assert/strict";
import { test } from "node:test";
import {
  validProjects,
  validClients,
  validInvoices,
  validDocuments,
  validActivity,
  validTimeEntries,
} from "../src/lib/storage-validation.ts";

test("rejects storage that is not a record array", () => {
  for (const validate of [
    validProjects,
    validClients,
    validInvoices,
    validDocuments,
    validActivity,
    validTimeEntries,
  ]) {
    for (const value of [null, {}, "[]", [null], [{}]]) {
      assert.equal(validate(value), false);
    }
    assert.equal(validate([]), true);
  }
});

const invoice = {
  id: "INV-1",
  client: "Example",
  amount: 100,
  due: "2026-10-10",
  status: "Draft",
};

test("accepts invoice drafts with or without a description", () => {
  assert.equal(validInvoices([invoice]), true);
  assert.equal(validInvoices([{ ...invoice, description: "Audit" }]), true);
});

test("rejects malformed fields and non-finite amounts", () => {
  for (const amount of ["100", NaN, Infinity, null]) {
    assert.equal(validInvoices([{ ...invoice, amount }]), false);
  }
  assert.equal(validInvoices([{ ...invoice, description: {} }]), false);
  assert.equal(validInvoices([{ ...invoice, client: null }]), false);
  assert.equal(validInvoices([invoice, {}]), false);
});
