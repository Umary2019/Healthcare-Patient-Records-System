import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-CYQJekC1.js";
import { P as ProtectedRoute, A as AppShell, a as PageHeader } from "./PageHeader-D2XCUBu7.js";
import { u as useAuth, s as supabase } from "./router-CTu-sRtw.js";
import { U as Users } from "./users-CK4E6vm0.js";
import { S as Stethoscope, C as CalendarDays } from "./stethoscope-U1M9GSyd.js";
import { c as createLucideIcon, A as Activity } from "./button-DOu4fBLP.js";
import { f as format } from "./format-NdAr1oQf.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-VI4E7ysD.js";
const __iconNode = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
const DollarSign = createLucideIcon("dollar-sign", __iconNode);
function StatCard({
  icon: Icon,
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-9 w-9 items-center justify-center rounded-lg ${accent ?? "bg-accent text-accent-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-3xl font-bold", children: value })
  ] });
}
function Dashboard() {
  const {
    user,
    primaryRole,
    roles
  } = useAuth();
  const [stats, setStats] = reactExports.useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    revenue: 0,
    todayAppointments: 0
  });
  const [recentAppts, setRecentAppts] = reactExports.useState([]);
  reactExports.useEffect(() => {
    (async () => {
      const today = /* @__PURE__ */ new Date();
      const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      const [pat, doc, appt, todayAppt, bills, recent] = await Promise.all([supabase.from("patients").select("id", {
        count: "exact",
        head: true
      }), supabase.from("doctors").select("id", {
        count: "exact",
        head: true
      }), supabase.from("appointments").select("id", {
        count: "exact",
        head: true
      }), supabase.from("appointments").select("id", {
        count: "exact",
        head: true
      }).gte("scheduled_at", start).lte("scheduled_at", end), supabase.from("bills").select("total,status"), supabase.from("appointments").select("id, scheduled_at, status, patients(full_name), doctors(full_name)").order("scheduled_at", {
        ascending: false
      }).limit(5)]);
      const revenue = (bills.data ?? []).filter((b) => b.status === "paid").reduce((s, b) => s + Number(b.total), 0);
      setStats({
        patients: pat.count ?? 0,
        doctors: doc.count ?? 0,
        appointments: appt.count ?? 0,
        todayAppointments: todayAppt.count ?? 0,
        revenue
      });
      setRecentAppts(recent.data ?? []);
    })();
  }, [roles.join(",")]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: `Welcome back${user?.email ? ", " + user.email.split("@")[0] : ""}`, description: `Signed in as ${primaryRole ?? "user"}.` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Users, label: "Patients", value: stats.patients, accent: "bg-primary/10 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Stethoscope, label: "Doctors", value: stats.doctors, accent: "bg-chart-2/15 text-chart-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CalendarDays, label: primaryRole === "doctor" ? "Today" : "Appointments", value: primaryRole === "doctor" ? stats.todayAppointments : stats.appointments, accent: "bg-chart-3/15 text-chart-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: DollarSign, label: "Revenue (paid)", value: `₦${stats.revenue.toFixed(2)}`, accent: "bg-success/15 text-success" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-xl border bg-card p-6 shadow-[var(--shadow-card)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Recent appointments" })
      ] }),
      recentAppts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No appointments yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: recentAppts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: a.patients?.full_name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "with Dr. ",
            a.doctors?.full_name ?? "—"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: format(new Date(a.scheduled_at), "PP p") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs capitalize text-muted-foreground", children: a.status })
        ] })
      ] }, a.id)) })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, {}) }) });
export {
  SplitComponent as component
};
