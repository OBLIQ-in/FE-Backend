import {
  Activity,
  BriefcaseBusiness,
  CalendarCheck2,
  ClipboardList,
  Clock3,
  FilePenLine,
  FileText,
  ReceiptText,
  Send,
} from "lucide-react";
import { dashboard } from "@/data/dashboard";
import type { ActivityItem, ModalKind } from "@/types/workspace";

export const quickActions: {
  label: string;
  kind: ModalKind;
  icon: typeof ReceiptText;
}[] = [
  { label: "Send an invoice", kind: "invoice", icon: ReceiptText },
  { label: "Draft a proposal", kind: "proposal", icon: Send },
  { label: "Create a contract", kind: "contract", icon: ClipboardList },
  { label: "Add a form", kind: "form", icon: FileText },
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
