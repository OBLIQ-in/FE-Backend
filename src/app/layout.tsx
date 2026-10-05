import type { Metadata } from "next";
import DashboardApp from "@/components/dashboard-app";
import { OnboardingGuard } from "@/components/onboarding-guard";
import { OnboardingProvider } from "@/lib/use-onboarding";
import "./globals.css";

export const metadata: Metadata = {
  title: "Home | OBLIQ",
  description: "OBLIQ dashboard frontend preview",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <OnboardingProvider>
          <OnboardingGuard>
            <DashboardApp>{children}</DashboardApp>
          </OnboardingGuard>
        </OnboardingProvider>
      </body>
    </html>
  );
}
