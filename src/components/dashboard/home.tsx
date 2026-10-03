import type { Dispatch, SetStateAction } from "react";
import { ArrowRight, ReceiptText } from "lucide-react";
import { dashboard } from "@/data/dashboard";
import {
  ActivityList,
  MetricCard,
  quickActions,
} from "@/components/dashboard/home-widgets";
import { EarningsChart } from "@/components/dashboard/earnings-chart";
import { ProjectTable } from "@/components/dashboard/project-table";
import { SectionHeader } from "@/components/dashboard/ui";
import type {
  Navigate,
  OpenModal,
  SelectProject,
} from "@/components/dashboard/contracts";
import type { ActivityItem, Invoice, Project } from "@/types/workspace";
import { parseDate } from "@/lib/format";

export function HomePage({
  projects,
  invoices,
  activity,
  period,
  setPeriod,
  openModal,
  navigate,
  selectProject,
}: {
  projects: Project[];
  invoices: Invoice[];
  activity: ActivityItem[];
  period: string;
  setPeriod: Dispatch<SetStateAction<string>>;
  openModal: OpenModal;
  navigate: Navigate;
  selectProject: SelectProject;
}) {
  const upcoming = projects
    .filter((item) => item.status !== "Completed")
    .filter((item) => parseDate(item.due))
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 3);
  const metrics = dashboard.metrics.map((metric) =>
    metric.id === "total"
      ? {
          ...metric,
          value: String(456 + projects.length - dashboard.projects.length),
        }
      : metric,
  );
  return (
    <div className="dashboard-content">
      <section className="metrics" aria-label="Project summary">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>
      <div className="lower-grid">
        <EarningsChart period={period} setPeriod={setPeriod} />
        <div className="home-side">
          <section className="quick-actions" aria-label="Quick actions">
            {quickActions.map(({ label, kind, icon: Icon }) => (
              <button
                className="action-card"
                key={kind}
                onClick={() => openModal(kind)}
              >
                <span className="round-icon action-icon">
                  <Icon size={17} strokeWidth={1.7} />
                </span>
                <span>{label}</span>
                <ArrowRight className="action-arrow" size={15} />
              </button>
            ))}
          </section>
          <section className="panel deadline-panel">
            <SectionHeader
              title="Coming up"
              action="All projects"
              onAction={() => navigate("projects")}
            />
            <div className="deadline-list">
              {upcoming.map((item) => (
                <button key={item.id} onClick={() => selectProject(item)}>
                  <span className="date-tile">
                    <strong>
                      {new Date(`${item.due}T12:00:00`).getDate()}
                    </strong>
                    <small>
                      {new Intl.DateTimeFormat("en-IN", {
                        month: "short",
                      }).format(new Date(`${item.due}T12:00:00`))}
                    </small>
                  </span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.client}</small>
                  </span>
                  <ArrowRight size={14} />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
      <div className="detail-grid">
        <section className="panel project-panel">
          <SectionHeader
            title="Recent projects"
            action="View all"
            onAction={() => navigate("projects")}
          />
          <ProjectTable
            projects={projects.slice(0, 5)}
            onSelect={selectProject}
            compact
          />
        </section>
        <section className="panel activity-panel">
          <SectionHeader title="Recent activity" />
          <ActivityList activity={activity} />
        </section>
      </div>
      <div className="summary-strip">
        <div>
          <span className="summary-symbol">
            <ReceiptText size={19} />
          </span>
          <span>
            <strong>
              {
                invoices.filter((item) => item.status === "Awaiting payment")
                  .length
              }{" "}
              invoices awaiting payment
            </strong>
          </span>
        </div>
        <button onClick={() => navigate("invoices")}>
          Open invoices <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
