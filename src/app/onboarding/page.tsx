"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type React from "react";
import { BriefcaseBusiness, UsersRound } from "lucide-react";
import { useOnboarding } from "@/lib/use-onboarding";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isOnboarded, ready, submitOnboarding, reset } = useOnboarding();
  const [role, setRole] = useState<"firm" | "client" | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Onboarding | OBLIQ";
  }, []);

  // Support ?reset=1 query parameter to easily clear onboarding state during dev/demos
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("reset")) {
        reset();
        router.replace("/onboarding");
      }
    }
  }, [reset, router]);

  // If already onboarded (and not mid-submit), redirect to dashboard
  useEffect(() => {
    if (ready && isOnboarded && !submitting) {
      router.replace("/");
    }
  }, [ready, isOnboarded, submitting, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = new FormData(event.currentTarget);
    const firmName = String(form.get("firmName") || "").trim();
    const contactEmail = String(form.get("contactEmail") || "").trim();
    const location = String(form.get("location") || "").trim();

    if (!firmName) {
      setError("Please enter your firm name.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await submitOnboarding({
        firmName,
        contactEmail: contactEmail || user.email,
        location: location || undefined,
      });
      router.replace("/");
    } catch {
      setError("Unable to save firm details. Please try again.");
      setSubmitting(false);
    }
  }

  // While storage is being read on the client, show a blank screen.
  // This prevents any flash between the SSR shell and the client redirect.
  if (!ready) {
    return <div className="onboarding-screen" aria-hidden="true" />;
  }

  // Already onboarded and not mid-submit — useEffect above will redirect.
  if (isOnboarded && !submitting) {
    return null;
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-brand">
        <Image
          className="brand-logo"
          src="/obliq-logo-light.svg"
          alt="OBLIQ"
          width={77}
          height={34}
          priority
        />
      </div>

      <div className="onboarding-card">
        {role === null && (
          <>
            <div className="onboarding-header">
              <span className="onboarding-caption">Get Started</span>
              <h1 className="onboarding-title">How will you be using OBLIQ?</h1>
              <p className="onboarding-description">
                Choose your account type to set up your workspace.
              </p>
            </div>

            <div className="onboarding-role-options">
              <button
                type="button"
                className="onboarding-role-card"
                onClick={() => setRole("firm")}
              >
                <div className="onboarding-role-icon">
                  <BriefcaseBusiness size={20} />
                </div>
                <div className="onboarding-role-body">
                  <span className="onboarding-role-title">
                    I am a Firm / Chartered Accountant
                  </span>
                  <span className="onboarding-role-desc">
                    Create a workspace for managing clients, projects, time
                    tracking, and invoices.
                  </span>
                </div>
              </button>

              <button
                type="button"
                className="onboarding-role-card"
                onClick={() => setRole("client")}
              >
                <div className="onboarding-role-icon">
                  <UsersRound size={20} />
                </div>
                <div className="onboarding-role-body">
                  <span className="onboarding-role-title">I am a Client</span>
                  <span className="onboarding-role-desc">
                    Access invoices, project updates, and documents from your
                    accounting firm.
                  </span>
                </div>
              </button>
            </div>
          </>
        )}

        {role === "client" && (
          <div className="onboarding-client-box">
            <div className="onboarding-header">
              <span className="onboarding-caption">Client Access</span>
              <h1 className="onboarding-title">Client Portal Coming Soon</h1>
              <p className="onboarding-description">
                Client accounts on OBLIQ are invitation-only.
              </p>
            </div>

            <div className="onboarding-client-notice">
              <p style={{ margin: 0 }}>
                When your accounting firm invites you to OBLIQ, you will receive
                an invitation link by email to access your client portal.
              </p>
            </div>

            <div>
              <button
                type="button"
                className="onboarding-back-link"
                onClick={() => setRole(null)}
              >
                ← Back to account type selection
              </button>
            </div>
          </div>
        )}

        {role === "firm" && (
          <>
            <div className="onboarding-header">
              <span className="onboarding-caption">Firm Onboarding</span>
              <h1 className="onboarding-title">Set up your firm workspace</h1>
              <p className="onboarding-description">
                Enter your firm details to create your private workspace.
              </p>
            </div>

            <form className="onboarding-form" onSubmit={handleSubmit}>
              {error && <p className="form-error">{error}</p>}

              <label className="onboarding-field">
                <span>Firm Name *</span>
                <input
                  className="onboarding-input"
                  name="firmName"
                  type="text"
                  required
                  placeholder="e.g. Apex Chartered Accountants"
                  autoFocus
                />
              </label>

              <label className="onboarding-field">
                <span>Firm Contact Email</span>
                <input
                  className="onboarding-input"
                  name="contactEmail"
                  type="email"
                  defaultValue={user.email}
                  placeholder="contact@yourfirm.com"
                />
              </label>

              <label className="onboarding-field">
                <span>Office Location / City</span>
                <input
                  className="onboarding-input"
                  name="location"
                  type="text"
                  placeholder="e.g. Mumbai, Maharashtra"
                />
              </label>

              <button
                type="submit"
                className="primary-button onboarding-submit"
                disabled={submitting}
              >
                {submitting ? "Setting up workspace..." : "Complete Setup"}
              </button>

              <div>
                <button
                  type="button"
                  className="onboarding-back-link"
                  onClick={() => setRole(null)}
                >
                  ← Back to account type selection
                </button>
              </div>
            </form>
          </>
        )}

        <p className="onboarding-note">
          Logged in as <strong>{user.name || "User"}</strong>{" "}
          {user.email ? `(${user.email})` : ""}
        </p>
      </div>
    </div>
  );
}
