export type Metric = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: "briefcase" | "edit" | "calendar" | "clock";
};

export type Project = {
  id: string;
  name: string;
  client: string;
  status: string;
  progress: number;
  due: string;
  lead: string;
  category: string;
};

export type Client = {
  id: string;
  name: string;
  contact: string;
  email: string;
  projects: number;
  status: string;
};

export type Invoice = {
  id: string;
  client: string;
  amount: number;
  due: string;
  status: string;
  description?: string;
};

export type Document = {
  id: string;
  title: string;
  client: string;
  type: string;
  updated: string;
  status: string;
};

export type ActivityItem = {
  id: string;
  person: string;
  action: string;
  subject: string;
  time: string;
  type: string;
};

export type TimeEntry = {
  id: string;
  date: string;
  project: string;
  seconds: number;
};

export type ModalKind =
  "invoice" | "proposal" | "contract" | "form" | "project" | "client";

export type FormValues = {
  title: string;
  client: string;
  amount: number;
  due: string;
  contact: string;
  email: string;
};

export type WorkspaceData = {
  projects: Project[];
  clients: Client[];
  invoices: Invoice[];
  documents: Document[];
  activity: ActivityItem[];
  entries: TimeEntry[];
};

// API adapters return the records accepted by the existing screens.
export type WorkspaceSource = {
  load: () => Promise<WorkspaceData>;
  create: (kind: ModalKind, values: FormValues) => Promise<WorkspaceData>;
  saveTime: (project: string, seconds: number) => Promise<WorkspaceData>;
};

export type UserType = "client" | "firm";
export type MemberRole = "owner" | "article_assistant";

export type User = {
  id: string;
  authId: string;
  email: string;
  name: string;
  type: UserType | null;
  onboardedAt: string | null;
  createdAt: string;
};

export type Firm = {
  id: string;
  name: string;
  createdBy: string;
  contactEmail?: string;
  location?: string;
  createdAt: string;
};

export type FirmOnboardingValues = {
  firmName: string;
  contactEmail?: string;
  location?: string;
};
