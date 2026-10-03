import Image from "next/image";
import {
  ArrowLeftCircle,
  BriefcaseBusiness,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  Home,
  LineChart,
  ReceiptText,
  UsersRound,
} from "lucide-react";

import Link from "next/link";
import { pages, routeHref } from "@/lib/routes";
import type { Navigate } from "./contracts";
const icons = {
  home: Home,
  clients: UsersRound,
  projects: BriefcaseBusiness,
  "time-tracking": Clock3,
  invoices: ReceiptText,
  contracts: ClipboardList,
  balance: CircleDollarSign,
  accounting: LineChart,
};
const navigation = [pages.slice(0, 4), pages.slice(4)].map((group) =>
  group.map((page) => ({ ...page, icon: icons[page.slug] })),
);

export function Sidebar({
  route,
  navigate,
  mobileOpen,
  closeMobile,
  toggleCollapse,
}: {
  route: string;
  navigate: Navigate;
  mobileOpen: boolean;
  closeMobile: () => void;
  toggleCollapse: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <button
          className="scrim"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <Image
            className="brand-logo"
            src="/obliq-logo-light.svg"
            alt="OBLIQ"
            width={77}
            height={34}
          />
          <button
            className="collapse-button"
            aria-label="Collapse sidebar"
            onClick={() => {
              if (window.innerWidth <= 900) closeMobile();
              else toggleCollapse();
            }}
          >
            <ArrowLeftCircle size={18} />
          </button>
        </div>
        <nav aria-label="Main navigation">
          {navigation.map((group, index) => (
            <div className="nav-group" key={index}>
              {index === 1 && (
                <>
                  <div className="nav-divider" />
                  <div className="nav-caption">TOOLS</div>
                </>
              )}
              {group.map(({ label, slug, icon: Icon }) => (
                <Link
                  key={slug}
                  href={routeHref(slug)}
                  className={`nav-link ${route === slug ? "active" : ""}`}
                  aria-current={route === slug ? "page" : undefined}
                  onClick={(event) => {
                    if (
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    )
                      return;
                    event.preventDefault();
                    navigate(slug);
                    closeMobile();
                  }}
                >
                  <Icon size={18} strokeWidth={1.7} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="workspace-foot">
          <span className="workspace-avatar">O</span>
          <span>
            <strong>OBLIQ workspace</strong>
            <small>Local preview data</small>
          </span>
        </div>
      </aside>
    </>
  );
}
