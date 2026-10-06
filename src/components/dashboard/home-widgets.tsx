import {
  Activity,
  BriefcaseBusiness,
  CalendarCheck2,
  ClipboardList,
  Clock3,
  FilePenLine,
  FileText,
  FolderPlus,
  Landmark,
  ReceiptText,
  Send,
} from "lucide-react";
import { dashboard } from "@/data/dashboard";
import { initials } from "@/lib/format";
import type { Route } from "@/lib/routes";
import type { ActivityItem, ModalKind, TeamMember } from "@/types/workspace";

// A quick action either opens a form or goes to a page.
export const quickActions: {
  label: string;
  icon: typeof ReceiptText;
  modal?: ModalKind;
  route?: Route;
}[] = [
  { label: "Send an invoice", modal: "invoice", icon: ReceiptText },
  { label: "Draft a proposal", modal: "proposal", icon: Send },
  { label: "Create a contract", modal: "contract", icon: ClipboardList },
  { label: "Add a form", modal: "form", icon: FileText },
  { label: "Create a project", modal: "project", icon: FolderPlus },
  { label: "File Tax", route: "taxes", icon: Landmark },
];

const metricIcons = {
  briefcase: BriefcaseBusiness,
  edit: FilePenLine,
  calendar: CalendarCheck2,
  clock: Clock3,
};

export function MetricCard({
  metric,
}: {
  metric: (typeof dashboard.metrics)[number];
}) {
  const Icon = metricIcons[metric.icon];
  return (
    <article className="metric-card">
      <div className="metric-label">
        <span className="round-icon">
          <Icon size={17} strokeWidth={1.7} />
        </span>
        <span>{metric.label}</span>
      </div>
      <div className="metric-bottom">
        <strong>{metric.value}</strong>
        <span className={`metric-change ${metric.trend}`}>{metric.change}</span>
      </div>
    </article>
  );
}

export function ActivityList({ activity }: { activity: ActivityItem[] }) {
  return (
    <div className="activity-list">
      {activity.slice(0, 5).map((item) => (
        <div className="activity-item" key={item.id}>
          <span className="activity-mark">
            <Activity size={15} />
          </span>
          <div>
            <p>
              <strong>{item.person}</strong> {item.action} <b>{item.subject}</b>
            </p>
            <small>{item.time}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Avatar({ name }: { name: string }) {
  return (
    <span className="avatar" title={name}>
      {/^[A-Z]{1,3}$/.test(name) ? name : initials(name)}
    </span>
  );
}

export function TeamList({ members }: { members: TeamMember[] }) {
  return (
    <ul className="team-list">
      {members.map((member) => (
        <li key={member.id}>
          <Avatar name={member.name} />
          <span>
            <strong>{member.name}</strong>
            <small>{member.role}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}
