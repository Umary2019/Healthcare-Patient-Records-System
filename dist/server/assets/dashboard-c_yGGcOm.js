import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-Dw-LtZEf.js";
import { u as useAuth, t as toast, s as supabase, L as Link } from "./router-vpkZZcx8.js";
import { P as ProtectedRoute, A as AppShell, a as PageHeader } from "./PageHeader-DzC9JfH7.js";
import { c as createLucideIcon, A as Activity, B as Button } from "./button-CWz-4Pey.js";
import { U as Users } from "./users-B6azN2KL.js";
import { S as Stethoscope } from "./stethoscope-lZg6dM85.js";
import { C as CalendarDays } from "./calendar-days-5j4ZdatP.js";
import { R as Receipt } from "./receipt-DbJAZwFN.js";
import { f as format } from "./format-NdAr1oQf.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CwplnMT2.js";
import "./shield-check-CJAsWoDW.js";
const __iconNode$6 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$6);
const __iconNode$5 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
];
const ClipboardList = createLucideIcon("clipboard-list", __iconNode$5);
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6h4", key: "135r8i" }]
];
const Clock3 = createLucideIcon("clock-3", __iconNode$4);
const __iconNode$3 = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
const DollarSign = createLucideIcon("dollar-sign", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
      key: "18mbvz"
    }
  ],
  ["path", { d: "M6.453 15h11.094", key: "3shlmq" }],
  ["path", { d: "M8.5 2h7", key: "csnxdl" }]
];
const FlaskConical = createLucideIcon("flask-conical", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
      key: "mvr1a0"
    }
  ],
  ["path", { d: "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27", key: "auskq0" }]
];
const HeartPulse = createLucideIcon("heart-pulse", __iconNode$1);
const __iconNode = [
  [
    "path",
    { d: "M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3", key: "1ub6xw" }
  ],
  ["path", { d: "m16 2 6 6", key: "1gw87d" }],
  ["path", { d: "M12 16H4", key: "1cjfip" }]
];
const TestTubeDiagonal = createLucideIcon("test-tube-diagonal", __iconNode);
const EMPTY_STATS = {
  totalPatients: 0,
  totalDoctors: 0,
  totalAppointments: 0,
  todayAppointments: 0,
  pendingAppointments: 0,
  completedAppointments: 0,
  unpaidBills: 0,
  paidRevenue: 0,
  myAppointments: 0,
  myUpcomingAppointments: 0,
  myCompletedAppointments: 0,
  myUnpaidBills: 0,
  labTestsToday: 0,
  labTestsLogged: 0
};
const ROLE_META = {
  admin: {
    eyebrow: "System control",
    title: "Admin command center",
    description: "Oversee users, permissions, compliance, and operational health from a single control room.",
    gradient: "from-slate-950 via-slate-900 to-indigo-950",
    badge: "bg-primary/15 text-primary",
    highlights: ["Manage users", "Review reports", "Monitor security"],
    accent: "bg-primary/10 text-primary"
  },
  doctor: {
    eyebrow: "Care workflow",
    title: "Doctor care board",
    description: "Move from patient history to diagnosis and prescriptions without losing the care context.",
    gradient: "from-emerald-950 via-slate-900 to-slate-950",
    badge: "bg-emerald-500/15 text-emerald-400",
    highlights: ["Open consultations", "Write diagnoses", "Create prescriptions"],
    accent: "bg-emerald-500/15 text-emerald-400"
  },
  receptionist: {
    eyebrow: "Front desk",
    title: "Reception workflow board",
    description: "Register patients, keep demographics tidy, and keep the waiting room moving.",
    gradient: "from-amber-950 via-stone-900 to-slate-950",
    badge: "bg-amber-500/15 text-amber-300",
    highlights: ["Register patients", "Search records", "Update demographics"],
    accent: "bg-amber-500/15 text-amber-300"
  },
  lab_officer: {
    eyebrow: "Lab operations",
    title: "Lab result console",
    description: "Record test outcomes, review result history, and keep the lab queue clean and traceable.",
    gradient: "from-cyan-950 via-slate-900 to-slate-950",
    badge: "bg-cyan-500/15 text-cyan-300",
    highlights: ["Record test results", "Track lab history", "Review patient samples"],
    accent: "bg-cyan-500/15 text-cyan-300"
  },
  patient: {
    eyebrow: "Personal care",
    title: "My health overview",
    description: "See your own records, follow your care plan, and stay ahead of upcoming visits.",
    gradient: "from-violet-950 via-slate-900 to-slate-950",
    badge: "bg-violet-500/15 text-violet-300",
    highlights: ["View profile", "Review prescriptions", "Check lab results"],
    accent: "bg-violet-500/15 text-violet-300"
  }
};
function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] ${className ?? ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-9 w-9 items-center justify-center rounded-lg ${accent ?? "bg-accent text-accent-foreground"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-3xl font-bold", children: value })
  ] });
}
function SectionCard({
  title,
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border bg-card p-6 shadow-[var(--shadow-card)] ${className ?? ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-semibold", children: title }),
    children
  ] });
}
function DashboardActions({
  actions,
  title = "Quick actions"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: actions.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: action.to, children: action.label }) }, action.to)) }) });
}
function AppointmentList({
  list,
  emptyText
}) {
  if (list.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: emptyText });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: list.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 text-sm", children: [
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
  ] }, a.id)) });
}
function LabResultList({
  list,
  emptyText
}) {
  if (list.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: emptyText });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: list.map((result) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: result.test_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: result.patients?.full_name ?? "—" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[16rem] truncate", children: result.result }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: format(new Date(result.test_date), "PP p") })
    ] })
  ] }, result.id)) });
}
function RoleHero({
  role
}) {
  const meta = ROLE_META[role];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: `mb-6 overflow-hidden rounded-3xl border bg-gradient-to-br ${meta.gradient} p-6 text-white shadow-[var(--shadow-elegant)]`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex rounded-full px-3 py-1 text-xs font-medium ${meta.badge}`, children: meta.eyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-3xl font-bold tracking-tight md:text-4xl", children: meta.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-2xl text-sm text-white/80 md:text-base", children: meta.description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: meta.highlights.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs backdrop-blur", children: item }, item)) })
  ] }) });
}
function Dashboard() {
  const {
    user,
    primaryRole,
    roles
  } = useAuth();
  const [stats, setStats] = reactExports.useState(EMPTY_STATS);
  const [recentAppts, setRecentAppts] = reactExports.useState([]);
  const [myRecords, setMyRecords] = reactExports.useState([]);
  const [recentLabResults, setRecentLabResults] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!user) return;
    const shouldWelcome = sessionStorage.getItem("post_login_welcome") === "1";
    if (!shouldWelcome) return;
    const metadataName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
    const firstNameFromMeta = metadataName ? metadataName.split(/\s+/)[0] : "";
    const firstName = firstNameFromMeta || user.email?.split("@")[0] || "there";
    let message = `Welcome, ${firstName}!`;
    if (primaryRole === "doctor") message = `Welcome, Dr. ${firstName}!`;
    if (primaryRole === "admin") message = `Welcome, Admin ${firstName}!`;
    if (primaryRole === "receptionist") message = `Welcome, Receptionist ${firstName}!`;
    if (primaryRole === "lab_officer") message = `Welcome, Lab Officer ${firstName}!`;
    toast.success(message);
    sessionStorage.removeItem("post_login_welcome");
  }, [primaryRole, user]);
  reactExports.useEffect(() => {
    if (!user) return;
    (async () => {
      const today = /* @__PURE__ */ new Date();
      const dayStart = new Date(today);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(today);
      dayEnd.setHours(23, 59, 59, 999);
      const start = dayStart.toISOString();
      const end = dayEnd.toISOString();
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const [{
        data: patientRow
      }, {
        data: doctorRow
      }] = await Promise.all([supabase.from("patients").select("id").eq("user_id", user.id).maybeSingle(), supabase.from("doctors").select("id").eq("user_id", user.id).maybeSingle()]);
      const patientId = patientRow?.id;
      const doctorId = doctorRow?.id;
      const activeRole2 = primaryRole ?? "patient";
      if (activeRole2 === "admin") {
        const [pat, doc, appt, todayAppt, pendingAppt, bills, recent] = await Promise.all([supabase.from("patients").select("id", {
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
        }).gte("scheduled_at", start).lte("scheduled_at", end), supabase.from("appointments").select("id", {
          count: "exact",
          head: true
        }).eq("status", "pending"), supabase.from("bills").select("total,status"), supabase.from("appointments").select("id, scheduled_at, status, patients(full_name), doctors(full_name)").order("scheduled_at", {
          ascending: false
        }).limit(6)]);
        const paidRevenue = (bills.data ?? []).filter((b) => b.status === "paid").reduce((sum, b) => sum + Number(b.total), 0);
        const unpaidBills = (bills.data ?? []).filter((b) => b.status === "unpaid").length;
        setStats({
          ...EMPTY_STATS,
          totalPatients: pat.count ?? 0,
          totalDoctors: doc.count ?? 0,
          totalAppointments: appt.count ?? 0,
          todayAppointments: todayAppt.count ?? 0,
          pendingAppointments: pendingAppt.count ?? 0,
          unpaidBills,
          paidRevenue
        });
        setRecentAppts(recent.data ?? []);
        setMyRecords([]);
        setRecentLabResults([]);
        return;
      }
      if (activeRole2 === "doctor" && doctorId) {
        const [allMine, todayMine, pendingMine, completedMine, upcomingMine] = await Promise.all([supabase.from("appointments").select("id", {
          count: "exact",
          head: true
        }).eq("doctor_id", doctorId), supabase.from("appointments").select("id", {
          count: "exact",
          head: true
        }).eq("doctor_id", doctorId).gte("scheduled_at", start).lte("scheduled_at", end), supabase.from("appointments").select("id", {
          count: "exact",
          head: true
        }).eq("doctor_id", doctorId).eq("status", "pending"), supabase.from("appointments").select("id", {
          count: "exact",
          head: true
        }).eq("doctor_id", doctorId).eq("status", "completed"), supabase.from("appointments").select("id, scheduled_at, status, patients(full_name), doctors(full_name)").eq("doctor_id", doctorId).in("status", ["pending", "approved"]).gte("scheduled_at", nowIso).order("scheduled_at", {
          ascending: true
        }).limit(6)]);
        setStats({
          ...EMPTY_STATS,
          myAppointments: allMine.count ?? 0,
          todayAppointments: todayMine.count ?? 0,
          pendingAppointments: pendingMine.count ?? 0,
          completedAppointments: completedMine.count ?? 0
        });
        setRecentAppts(upcomingMine.data ?? []);
        setMyRecords([]);
        setRecentLabResults([]);
        return;
      }
      if (activeRole2 === "receptionist") {
        const monthStart = /* @__PURE__ */ new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        const [todayAppt, pendingAppt, newPatients, unpaidBillsCount, latestAppt] = await Promise.all([supabase.from("appointments").select("id", {
          count: "exact",
          head: true
        }).gte("scheduled_at", start).lte("scheduled_at", end), supabase.from("appointments").select("id", {
          count: "exact",
          head: true
        }).eq("status", "pending"), supabase.from("patients").select("id", {
          count: "exact",
          head: true
        }).gte("created_at", monthStart.toISOString()), supabase.from("bills").select("id", {
          count: "exact",
          head: true
        }).eq("status", "unpaid"), supabase.from("appointments").select("id, scheduled_at, status, patients(full_name), doctors(full_name)").order("scheduled_at", {
          ascending: false
        }).limit(6)]);
        setStats({
          ...EMPTY_STATS,
          todayAppointments: todayAppt.count ?? 0,
          pendingAppointments: pendingAppt.count ?? 0,
          totalPatients: newPatients.count ?? 0,
          unpaidBills: unpaidBillsCount.count ?? 0
        });
        setRecentAppts(latestAppt.data ?? []);
        setMyRecords([]);
        setRecentLabResults([]);
        return;
      }
      if (activeRole2 === "lab_officer") {
        const [testsToday, totalTests, totalPatients, recentTests] = await Promise.all([supabase.from("lab_results").select("id", {
          count: "exact",
          head: true
        }).eq("lab_officer_id", user.id).gte("test_date", start).lte("test_date", end), supabase.from("lab_results").select("id", {
          count: "exact",
          head: true
        }).eq("lab_officer_id", user.id), supabase.from("patients").select("id", {
          count: "exact",
          head: true
        }), supabase.from("lab_results").select("id, test_name, result, test_date, patients(full_name)").eq("lab_officer_id", user.id).order("test_date", {
          ascending: false
        }).limit(6)]);
        setStats({
          ...EMPTY_STATS,
          labTestsToday: testsToday.count ?? 0,
          labTestsLogged: totalTests.count ?? 0,
          totalPatients: totalPatients.count ?? 0
        });
        setRecentAppts([]);
        setMyRecords([]);
        setRecentLabResults(recentTests.data ?? []);
        return;
      }
      if (activeRole2 === "patient" && patientId) {
        const [allMine, upcomingMine, completedMine, myBills, nextAppts, records] = await Promise.all([supabase.from("appointments").select("id", {
          count: "exact",
          head: true
        }).eq("patient_id", patientId), supabase.from("appointments").select("id", {
          count: "exact",
          head: true
        }).eq("patient_id", patientId).gte("scheduled_at", nowIso), supabase.from("appointments").select("id", {
          count: "exact",
          head: true
        }).eq("patient_id", patientId).eq("status", "completed"), supabase.from("bills").select("id,status,total").eq("patient_id", patientId), supabase.from("appointments").select("id, scheduled_at, status, patients(full_name), doctors(full_name)").eq("patient_id", patientId).gte("scheduled_at", nowIso).order("scheduled_at", {
          ascending: true
        }).limit(6), supabase.from("medical_records").select("id, created_at, diagnosis, doctors(full_name)").eq("patient_id", patientId).order("created_at", {
          ascending: false
        }).limit(4)]);
        const unpaidBillCount = (myBills.data ?? []).filter((b) => b.status === "unpaid").length;
        setStats({
          ...EMPTY_STATS,
          myAppointments: allMine.count ?? 0,
          myUpcomingAppointments: upcomingMine.count ?? 0,
          myCompletedAppointments: completedMine.count ?? 0,
          myUnpaidBills: unpaidBillCount
        });
        setRecentAppts(nextAppts.data ?? []);
        setMyRecords(records.data ?? []);
        setRecentLabResults([]);
      }
    })();
  }, [primaryRole, roles.join(","), user]);
  const roleActions = {
    admin: [{
      label: "Open Admin Panel",
      to: "/admin"
    }, {
      label: "Manage Appointments",
      to: "/appointments"
    }, {
      label: "Review Billing",
      to: "/billing"
    }],
    doctor: [{
      label: "Today's Appointments",
      to: "/appointments"
    }, {
      label: "Write Records",
      to: "/records"
    }, {
      label: "View Patients",
      to: "/patients"
    }],
    receptionist: [{
      label: "Book Appointment",
      to: "/appointments"
    }, {
      label: "Register Patient",
      to: "/patients"
    }, {
      label: "Create Invoice",
      to: "/billing"
    }],
    lab_officer: [{
      label: "Record Lab Result",
      to: "/lab-results"
    }, {
      label: "View Patients",
      to: "/patients"
    }, {
      label: "Open Profile",
      to: "/profile"
    }],
    patient: [{
      label: "Book Appointment",
      to: "/appointments"
    }, {
      label: "My Records",
      to: "/records"
    }, {
      label: "My Billing",
      to: "/billing"
    }]
  };
  const activeRole = primaryRole ?? "patient";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(RoleHero, { role: activeRole }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: `Welcome back${user?.email ? ", " + user.email.split("@")[0] : ""}`, description: `Signed in as ${activeRole}.` }),
    activeRole === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Users, label: "Total patients", value: stats.totalPatients, accent: "bg-primary/10 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Stethoscope, label: "Total doctors", value: stats.totalDoctors, accent: "bg-chart-2/15 text-chart-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CalendarDays, label: "Appointments today", value: stats.todayAppointments, accent: "bg-chart-3/15 text-chart-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: DollarSign, label: "Paid revenue", value: `₦${stats.paidRevenue.toFixed(2)}`, accent: "bg-success/15 text-success" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Clock3, label: "Pending appointments", value: stats.pendingAppointments }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Receipt, label: "Unpaid bills", value: stats.unpaidBills }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Activity, label: "Total appointments", value: stats.totalAppointments })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-4 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Recent appointments", className: "border-primary/15 bg-gradient-to-br from-card to-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppointmentList, { list: recentAppts, emptyText: "No appointments yet." }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardActions, { actions: roleActions.admin, title: "Governance shortcuts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Admin focus", className: "border-primary/15 bg-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Review active users and role assignments." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Watch platform activity and system health." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Use reports to spot operational bottlenecks." })
          ] }) })
        ] })
      ] })
    ] }),
    activeRole === "doctor" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CalendarDays, label: "All appointments", value: stats.myAppointments, accent: "bg-chart-3/15 text-chart-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Clock3, label: "Today", value: stats.todayAppointments, accent: "bg-primary/10 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Activity, label: "Pending", value: stats.pendingAppointments, accent: "bg-warning/15 text-warning-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleCheck, label: "Completed", value: stats.completedAppointments, accent: "bg-success/15 text-success" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-4 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Upcoming consultations", className: "border-emerald-500/15 bg-gradient-to-br from-card to-emerald-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppointmentList, { list: recentAppts, emptyText: "No upcoming consultations." }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardActions, { actions: roleActions.doctor, title: "Care shortcuts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Care focus", className: "border-emerald-500/15 bg-emerald-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Pull up patient history before you consult." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Capture diagnosis and treatment plan in one pass." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Keep prescriptions and lab checks connected." })
          ] }) })
        ] })
      ] })
    ] }),
    activeRole === "receptionist" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CalendarDays, label: "Appointments today", value: stats.todayAppointments, accent: "bg-chart-3/15 text-chart-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Clock3, label: "Pending approvals", value: stats.pendingAppointments, accent: "bg-warning/15 text-warning-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Users, label: "New patients (month)", value: stats.totalPatients, accent: "bg-primary/10 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Receipt, label: "Unpaid invoices", value: stats.unpaidBills, accent: "bg-destructive/15 text-destructive" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-4 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Latest appointment activity", className: "border-amber-500/15 bg-gradient-to-br from-card to-amber-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppointmentList, { list: recentAppts, emptyText: "No appointment activity yet." }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardActions, { actions: roleActions.receptionist, title: "Front desk shortcuts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Front desk focus", className: "border-amber-500/15 bg-amber-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Register new patients and correct demographics fast." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Search existing patients before booking or updating." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Keep the day moving with clear appointment status." })
          ] }) })
        ] })
      ] })
    ] }),
    activeRole === "lab_officer" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: FlaskConical, label: "Tests logged", value: stats.labTestsLogged, accent: "bg-cyan-500/15 text-cyan-300" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: TestTubeDiagonal, label: "Tests today", value: stats.labTestsToday, accent: "bg-cyan-500/15 text-cyan-300" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Users, label: "Patients available", value: stats.totalPatients, accent: "bg-primary/10 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: ClipboardList, label: "Worklist status", value: "Live", accent: "bg-success/15 text-success" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-4 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Recent lab results", className: "border-cyan-500/15 bg-gradient-to-br from-card to-cyan-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LabResultList, { list: recentLabResults, emptyText: "No lab results recorded yet." }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardActions, { actions: roleActions.lab_officer, title: "Lab shortcuts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Lab focus", className: "border-cyan-500/15 bg-cyan-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Record new test results against the correct patient." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Update result history when readings change." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Use patient lookup to reduce mislabeling risk." })
          ] }) })
        ] })
      ] })
    ] }),
    activeRole === "patient" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CalendarDays, label: "My appointments", value: stats.myAppointments, accent: "bg-chart-3/15 text-chart-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Clock3, label: "Upcoming", value: stats.myUpcomingAppointments, accent: "bg-primary/10 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: CircleCheck, label: "Completed", value: stats.myCompletedAppointments, accent: "bg-success/15 text-success" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Receipt, label: "Unpaid bills", value: stats.myUnpaidBills, accent: "bg-warning/15 text-warning-foreground" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-4 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "My next appointments", className: "border-violet-500/15 bg-gradient-to-br from-card to-violet-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppointmentList, { list: recentAppts, emptyText: "No upcoming appointments." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Recent medical records", className: "border-violet-500/15 bg-violet-500/5", children: myRecords.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No medical records yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: myRecords.map((record) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: record.diagnosis || "General consultation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "Dr. ",
                record.doctors?.full_name ?? "—"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: format(new Date(record.created_at), "PP") })
          ] }, record.id)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardActions, { actions: roleActions.patient, title: "Care shortcuts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Care reminder", className: "border-violet-500/15 bg-violet-500/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HeartPulse, { className: "mt-0.5 h-4 w-4 text-primary" }),
            "Keep your profile and contact details updated so appointment reminders, lab updates, and billing notices reach you on time."
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dashboard, {}) }) });
export {
  SplitComponent as component
};
