export const pages = [
  { label: "Home", slug: "home" },
  { label: "Clients", slug: "clients" },
  { label: "Projects", slug: "projects" },
  { label: "Time tracking", slug: "time-tracking" },
  { label: "Invoices", slug: "invoices" },
  { label: "Contracts", slug: "contracts" },
  { label: "Balance", slug: "balance" },
  { label: "Accounting", slug: "accounting" },
] as const;

export type Route = (typeof pages)[number]["slug"];

export function routeHref(route: Route) {
  return route === "home" ? "/" : `/${route}`;
}
