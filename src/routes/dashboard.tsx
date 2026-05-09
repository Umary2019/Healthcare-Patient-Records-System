import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Users, Stethoscope, CalendarDays, DollarSign, Activity, FileText, Receipt, Clock3, CheckCircle2, FlaskConical, TestTube2, ClipboardList, HeartPulse } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CareRecords" }] }),
  component: () => (
    <ProtectedRoute>
      <AppShell>
        <Dashboard />
      </AppShell>
    </ProtectedRoute>
  ),
});

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  unpaidBills: number;
  paidRevenue: number;
  myAppointments: number;
  myUpcomingAppointments: number;
  myCompletedAppointments: number;
  myUnpaidBills: number;
  labTestsToday: number;
  labTestsLogged: number;
}

const EMPTY_STATS: DashboardStats = {
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
  labTestsLogged: 0,
};

const ROLE_META = {
  admin: {
    eyebrow: "System control",
    title: "Admin command center",
    description: "Oversee users, permissions, compliance, and operational health from a single control room.",
    gradient: "from-slate-950 via-slate-900 to-indigo-950",
    badge: "bg-primary/15 text-primary",
    highlights: ["Manage users", "Review reports", "Monitor security"],
    accent: "bg-primary/10 text-primary",
  },
  doctor: {
    eyebrow: "Clinical workflow",
    title: "Doctor clinical board",
    description: "Move from patient history to diagnosis and prescriptions without losing the clinical thread.",
    gradient: "from-emerald-950 via-slate-900 to-slate-950",
    badge: "bg-emerald-500/15 text-emerald-400",
    highlights: ["Open consultations", "Write diagnoses", "Create prescriptions"],
    accent: "bg-emerald-500/15 text-emerald-400",
  },
  receptionist: {
    eyebrow: "Front desk",
    title: "Reception workflow board",
    description: "Register patients, keep demographics tidy, and keep the waiting room moving.",
    gradient: "from-amber-950 via-stone-900 to-slate-950",
    badge: "bg-amber-500/15 text-amber-300",
    highlights: ["Register patients", "Search records", "Update demographics"],
    accent: "bg-amber-500/15 text-amber-300",
  },
  lab_officer: {
    eyebrow: "Lab operations",
    title: "Lab result console",
    description: "Record test outcomes, review result history, and keep the lab queue clean and traceable.",
    gradient: "from-cyan-950 via-slate-900 to-slate-950",
    badge: "bg-cyan-500/15 text-cyan-300",
    highlights: ["Record test results", "Track lab history", "Review patient samples"],
    accent: "bg-cyan-500/15 text-cyan-300",
  },
  patient: {
    eyebrow: "Personal care",
    title: "My health overview",
    description: "See your own records, follow your care plan, and stay ahead of upcoming visits.",
    gradient: "from-violet-950 via-slate-900 to-slate-950",
    badge: "bg-violet-500/15 text-violet-300",
    highlights: ["View profile", "Review prescriptions", "Check lab results"],
    accent: "bg-violet-500/15 text-violet-300",
  },
} as const;

function StatCard({ icon: Icon, label, value, accent, className }: { icon: typeof Users; label: string; value: string | number; accent?: string; className?: string }) {
  return (
    <div className={`rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent ?? "bg-accent text-accent-foreground"}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-3xl font-bold">{value}</div>
    </div>
  );
}

function SectionCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border bg-card p-6 shadow-[var(--shadow-card)] ${className ?? ""}`}>
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function DashboardActions({ actions, title = "Quick actions" }: { actions: Array<{ label: string; to: string }>; title?: string }) {
  return (
    <SectionCard title={title}>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button key={action.to} asChild size="sm" variant="outline">
            <Link to={action.to}>{action.label}</Link>
          </Button>
        ))}
      </div>
    </SectionCard>
  );
}

function AppointmentList({ list, emptyText }: { list: any[]; emptyText: string }) {
  if (list.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div className="divide-y">
      {list.map((a) => (
        <div key={a.id} className="flex items-center justify-between py-3 text-sm">
          <div>
            <div className="font-medium">{a.patients?.full_name ?? "—"}</div>
            <div className="text-xs text-muted-foreground">with Dr. {a.doctors?.full_name ?? "—"}</div>
          </div>
          <div className="text-right">
            <div>{format(new Date(a.scheduled_at), "PP p")}</div>
            <div className="text-xs capitalize text-muted-foreground">{a.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LabResultList({ list, emptyText }: { list: any[]; emptyText: string }) {
  if (list.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div className="divide-y">
      {list.map((result) => (
        <div key={result.id} className="flex items-center justify-between py-3 text-sm">
          <div>
            <div className="font-medium">{result.test_name}</div>
            <div className="text-xs text-muted-foreground">{result.patients?.full_name ?? "—"}</div>
          </div>
          <div className="text-right">
            <div className="max-w-[16rem] truncate">{result.result}</div>
            <div className="text-xs text-muted-foreground">{format(new Date(result.test_date), "PP p")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RoleHero({ role }: { role: keyof typeof ROLE_META }) {
  const meta = ROLE_META[role];

  return (
    <section className={`mb-6 overflow-hidden rounded-3xl border bg-gradient-to-br ${meta.gradient} p-6 text-white shadow-[var(--shadow-elegant)]`}>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
        <div>
          <div className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${meta.badge}`}>{meta.eyebrow}</div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{meta.title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">{meta.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {meta.highlights.map((item) => (
              <span key={item} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-xl bg-black/20 p-3">
              <div className="text-xs uppercase tracking-wide text-white/60">Focus</div>
              <div className="mt-1 text-sm font-medium">Role-specific workflow</div>
            </div>
            <div className="rounded-xl bg-black/20 p-3">
              <div className="text-xs uppercase tracking-wide text-white/60">Access</div>
              <div className="mt-1 text-sm font-medium">Protected by RBAC</div>
            </div>
            <div className="rounded-xl bg-black/20 p-3">
              <div className="text-xs uppercase tracking-wide text-white/60">Source</div>
              <div className="mt-1 text-sm font-medium">Live Supabase data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dashboard() {
  const { user, primaryRole, roles } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [recentAppts, setRecentAppts] = useState<any[]>([]);
  const [myRecords, setMyRecords] = useState<any[]>([]);
  const [recentLabResults, setRecentLabResults] = useState<any[]>([]);

  useEffect(() => {
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

  useEffect(() => {
    if (!user) return;

    (async () => {
      const today = new Date();
      const dayStart = new Date(today);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(today);
      dayEnd.setHours(23, 59, 59, 999);
      const start = dayStart.toISOString();
      const end = dayEnd.toISOString();
      const nowIso = new Date().toISOString();

      const [{ data: patientRow }, { data: doctorRow }] = await Promise.all([
        supabase.from("patients").select("id").eq("user_id", user.id).maybeSingle(),
        supabase.from("doctors").select("id").eq("user_id", user.id).maybeSingle(),
      ]);
      const patientId = patientRow?.id;
      const doctorId = doctorRow?.id;
      const activeRole = (primaryRole ?? "patient") as keyof typeof ROLE_META;

      if (activeRole === "admin") {
        const [pat, doc, appt, todayAppt, pendingAppt, bills, recent] = await Promise.all([
          supabase.from("patients").select("id", { count: "exact", head: true }),
          supabase.from("doctors").select("id", { count: "exact", head: true }),
          supabase.from("appointments").select("id", { count: "exact", head: true }),
          supabase.from("appointments").select("id", { count: "exact", head: true }).gte("scheduled_at", start).lte("scheduled_at", end),
          supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("bills").select("total,status"),
          supabase.from("appointments").select("id, scheduled_at, status, patients(full_name), doctors(full_name)").order("scheduled_at", { ascending: false }).limit(6),
        ]);

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
          paidRevenue,
        });
        setRecentAppts(recent.data ?? []);
        setMyRecords([]);
        setRecentLabResults([]);
        return;
      }

      if (activeRole === "doctor" && doctorId) {
        const [allMine, todayMine, pendingMine, completedMine, upcomingMine] = await Promise.all([
          supabase.from("appointments").select("id", { count: "exact", head: true }).eq("doctor_id", doctorId),
          supabase.from("appointments").select("id", { count: "exact", head: true }).eq("doctor_id", doctorId).gte("scheduled_at", start).lte("scheduled_at", end),
          supabase.from("appointments").select("id", { count: "exact", head: true }).eq("doctor_id", doctorId).eq("status", "pending"),
          supabase.from("appointments").select("id", { count: "exact", head: true }).eq("doctor_id", doctorId).eq("status", "completed"),
          supabase
            .from("appointments")
            .select("id, scheduled_at, status, patients(full_name), doctors(full_name)")
            .eq("doctor_id", doctorId)
            .in("status", ["pending", "approved"])
            .gte("scheduled_at", nowIso)
            .order("scheduled_at", { ascending: true })
            .limit(6),
        ]);

        setStats({
          ...EMPTY_STATS,
          myAppointments: allMine.count ?? 0,
          todayAppointments: todayMine.count ?? 0,
          pendingAppointments: pendingMine.count ?? 0,
          completedAppointments: completedMine.count ?? 0,
        });
        setRecentAppts(upcomingMine.data ?? []);
        setMyRecords([]);
        setRecentLabResults([]);
        return;
      }

      if (activeRole === "receptionist") {
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        const [todayAppt, pendingAppt, newPatients, unpaidBillsCount, latestAppt] = await Promise.all([
          supabase.from("appointments").select("id", { count: "exact", head: true }).gte("scheduled_at", start).lte("scheduled_at", end),
          supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("patients").select("id", { count: "exact", head: true }).gte("created_at", monthStart.toISOString()),
          supabase.from("bills").select("id", { count: "exact", head: true }).eq("status", "unpaid"),
          supabase.from("appointments").select("id, scheduled_at, status, patients(full_name), doctors(full_name)").order("scheduled_at", { ascending: false }).limit(6),
        ]);

        setStats({
          ...EMPTY_STATS,
          todayAppointments: todayAppt.count ?? 0,
          pendingAppointments: pendingAppt.count ?? 0,
          totalPatients: newPatients.count ?? 0,
          unpaidBills: unpaidBillsCount.count ?? 0,
        });
        setRecentAppts(latestAppt.data ?? []);
        setMyRecords([]);
        setRecentLabResults([]);
        return;
      }

      if (activeRole === "lab_officer") {
        const [testsToday, totalTests, totalPatients, recentTests] = await Promise.all([
          supabase.from("lab_results").select("id", { count: "exact", head: true }).eq("lab_officer_id", user.id).gte("test_date", start).lte("test_date", end),
          supabase.from("lab_results").select("id", { count: "exact", head: true }).eq("lab_officer_id", user.id),
          supabase.from("patients").select("id", { count: "exact", head: true }),
          supabase
            .from("lab_results")
            .select("id, test_name, result, test_date, patients(full_name)")
            .eq("lab_officer_id", user.id)
            .order("test_date", { ascending: false })
            .limit(6),
        ]);

        setStats({
          ...EMPTY_STATS,
          labTestsToday: testsToday.count ?? 0,
          labTestsLogged: totalTests.count ?? 0,
          totalPatients: totalPatients.count ?? 0,
        });
        setRecentAppts([]);
        setMyRecords([]);
        setRecentLabResults(recentTests.data ?? []);
        return;
      }

      if (activeRole === "patient" && patientId) {
        const [allMine, upcomingMine, completedMine, myBills, nextAppts, records] = await Promise.all([
          supabase.from("appointments").select("id", { count: "exact", head: true }).eq("patient_id", patientId),
          supabase.from("appointments").select("id", { count: "exact", head: true }).eq("patient_id", patientId).gte("scheduled_at", nowIso),
          supabase.from("appointments").select("id", { count: "exact", head: true }).eq("patient_id", patientId).eq("status", "completed"),
          supabase.from("bills").select("id,status,total").eq("patient_id", patientId),
          supabase
            .from("appointments")
            .select("id, scheduled_at, status, patients(full_name), doctors(full_name)")
            .eq("patient_id", patientId)
            .gte("scheduled_at", nowIso)
            .order("scheduled_at", { ascending: true })
            .limit(6),
          supabase.from("medical_records").select("id, created_at, diagnosis, doctors(full_name)").eq("patient_id", patientId).order("created_at", { ascending: false }).limit(4),
        ]);

        const unpaidBillCount = (myBills.data ?? []).filter((b) => b.status === "unpaid").length;
        setStats({
          ...EMPTY_STATS,
          myAppointments: allMine.count ?? 0,
          myUpcomingAppointments: upcomingMine.count ?? 0,
          myCompletedAppointments: completedMine.count ?? 0,
          myUnpaidBills: unpaidBillCount,
        });
        setRecentAppts(nextAppts.data ?? []);
        setMyRecords(records.data ?? []);
        setRecentLabResults([]);
      }
    })();
  }, [primaryRole, roles.join(","), user]);

  const roleActions: Record<string, Array<{ label: string; to: string }>> = {
    admin: [
      { label: "Open Admin Panel", to: "/admin" },
      { label: "Manage Appointments", to: "/appointments" },
      { label: "Review Billing", to: "/billing" },
    ],
    doctor: [
      { label: "Today's Appointments", to: "/appointments" },
      { label: "Write Records", to: "/records" },
      { label: "View Patients", to: "/patients" },
    ],
    receptionist: [
      { label: "Book Appointment", to: "/appointments" },
      { label: "Register Patient", to: "/patients" },
      { label: "Create Invoice", to: "/billing" },
    ],
    lab_officer: [
      { label: "Record Lab Result", to: "/lab-results" },
      { label: "View Patients", to: "/patients" },
      { label: "Open Profile", to: "/profile" },
    ],
    patient: [
      { label: "Book Appointment", to: "/appointments" },
      { label: "My Records", to: "/records" },
      { label: "My Billing", to: "/billing" },
    ],
  };

  const activeRole = (primaryRole ?? "patient") as keyof typeof ROLE_META;
  const meta = ROLE_META[activeRole];

  return (
    <>
      <RoleHero role={activeRole} />

      <PageHeader
        title={`Welcome back${user?.email ? ", " + user.email.split("@")[0] : ""}`}
        description={`Signed in as ${activeRole}.`}
      />

      {activeRole === "admin" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Users} label="Total patients" value={stats.totalPatients} accent="bg-primary/10 text-primary" />
            <StatCard icon={Stethoscope} label="Total doctors" value={stats.totalDoctors} accent="bg-chart-2/15 text-chart-2" />
            <StatCard icon={CalendarDays} label="Appointments today" value={stats.todayAppointments} accent="bg-chart-3/15 text-chart-3" />
            <StatCard icon={DollarSign} label="Paid revenue" value={`₦${stats.paidRevenue.toFixed(2)}`} accent="bg-success/15 text-success" />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard icon={Clock3} label="Pending appointments" value={stats.pendingAppointments} />
            <StatCard icon={Receipt} label="Unpaid bills" value={stats.unpaidBills} />
            <StatCard icon={Activity} label="Total appointments" value={stats.totalAppointments} />
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionCard title="Recent appointments" className="border-primary/15 bg-gradient-to-br from-card to-primary/5">
                <AppointmentList list={recentAppts} emptyText="No appointments yet." />
              </SectionCard>
            </div>
            <div className="space-y-4">
              <DashboardActions actions={roleActions.admin} title="Governance shortcuts" />
              <SectionCard title="Admin focus" className="border-primary/15 bg-primary/5">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Review active users and role assignments.</li>
                  <li>• Watch platform activity and system health.</li>
                  <li>• Use reports to spot operational bottlenecks.</li>
                </ul>
              </SectionCard>
            </div>
          </div>
        </>
      )}

      {activeRole === "doctor" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={CalendarDays} label="All appointments" value={stats.myAppointments} accent="bg-chart-3/15 text-chart-3" />
            <StatCard icon={Clock3} label="Today" value={stats.todayAppointments} accent="bg-primary/10 text-primary" />
            <StatCard icon={Activity} label="Pending" value={stats.pendingAppointments} accent="bg-warning/15 text-warning-foreground" />
            <StatCard icon={CheckCircle2} label="Completed" value={stats.completedAppointments} accent="bg-success/15 text-success" />
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionCard title="Upcoming consultations" className="border-emerald-500/15 bg-gradient-to-br from-card to-emerald-500/5">
                <AppointmentList list={recentAppts} emptyText="No upcoming consultations." />
              </SectionCard>
            </div>
            <div className="space-y-4">
              <DashboardActions actions={roleActions.doctor} title="Clinical shortcuts" />
              <SectionCard title="Clinical focus" className="border-emerald-500/15 bg-emerald-500/5">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Pull up patient history before you consult.</li>
                  <li>• Capture diagnosis and treatment plan in one pass.</li>
                  <li>• Keep prescriptions and lab checks connected.</li>
                </ul>
              </SectionCard>
            </div>
          </div>
        </>
      )}

      {activeRole === "receptionist" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={CalendarDays} label="Appointments today" value={stats.todayAppointments} accent="bg-chart-3/15 text-chart-3" />
            <StatCard icon={Clock3} label="Pending approvals" value={stats.pendingAppointments} accent="bg-warning/15 text-warning-foreground" />
            <StatCard icon={Users} label="New patients (month)" value={stats.totalPatients} accent="bg-primary/10 text-primary" />
            <StatCard icon={Receipt} label="Unpaid invoices" value={stats.unpaidBills} accent="bg-destructive/15 text-destructive" />
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionCard title="Latest appointment activity" className="border-amber-500/15 bg-gradient-to-br from-card to-amber-500/5">
                <AppointmentList list={recentAppts} emptyText="No appointment activity yet." />
              </SectionCard>
            </div>
            <div className="space-y-4">
              <DashboardActions actions={roleActions.receptionist} title="Front desk shortcuts" />
              <SectionCard title="Front desk focus" className="border-amber-500/15 bg-amber-500/5">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Register new patients and correct demographics fast.</li>
                  <li>• Search existing patients before booking or updating.</li>
                  <li>• Keep the day moving with clear appointment status.</li>
                </ul>
              </SectionCard>
            </div>
          </div>
        </>
      )}

      {activeRole === "lab_officer" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FlaskConical} label="Tests logged" value={stats.labTestsLogged} accent="bg-cyan-500/15 text-cyan-300" />
            <StatCard icon={TestTube2} label="Tests today" value={stats.labTestsToday} accent="bg-cyan-500/15 text-cyan-300" />
            <StatCard icon={Users} label="Patients available" value={stats.totalPatients} accent="bg-primary/10 text-primary" />
            <StatCard icon={ClipboardList} label="Worklist status" value="Live" accent="bg-success/15 text-success" />
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionCard title="Recent lab results" className="border-cyan-500/15 bg-gradient-to-br from-card to-cyan-500/5">
                <LabResultList list={recentLabResults} emptyText="No lab results recorded yet." />
              </SectionCard>
            </div>
            <div className="space-y-4">
              <DashboardActions actions={roleActions.lab_officer} title="Lab shortcuts" />
              <SectionCard title="Lab focus" className="border-cyan-500/15 bg-cyan-500/5">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Record new test results against the correct patient.</li>
                  <li>• Update result history when readings change.</li>
                  <li>• Use patient lookup to reduce mislabeling risk.</li>
                </ul>
              </SectionCard>
            </div>
          </div>
        </>
      )}

      {activeRole === "patient" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={CalendarDays} label="My appointments" value={stats.myAppointments} accent="bg-chart-3/15 text-chart-3" />
            <StatCard icon={Clock3} label="Upcoming" value={stats.myUpcomingAppointments} accent="bg-primary/10 text-primary" />
            <StatCard icon={CheckCircle2} label="Completed" value={stats.myCompletedAppointments} accent="bg-success/15 text-success" />
            <StatCard icon={Receipt} label="Unpaid bills" value={stats.myUnpaidBills} accent="bg-warning/15 text-warning-foreground" />
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <SectionCard title="My next appointments" className="border-violet-500/15 bg-gradient-to-br from-card to-violet-500/5">
                <AppointmentList list={recentAppts} emptyText="No upcoming appointments." />
              </SectionCard>
              <SectionCard title="Recent medical records" className="border-violet-500/15 bg-violet-500/5">
                {myRecords.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No medical records yet.</p>
                ) : (
                  <div className="divide-y">
                    {myRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between py-3 text-sm">
                        <div>
                          <div className="font-medium">{record.diagnosis || "General consultation"}</div>
                          <div className="text-xs text-muted-foreground">Dr. {record.doctors?.full_name ?? "—"}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{format(new Date(record.created_at), "PP")}</div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>
            <div className="space-y-4">
              <DashboardActions actions={roleActions.patient} title="Care shortcuts" />
              <SectionCard title="Care reminder" className="border-violet-500/15 bg-violet-500/5">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <HeartPulse className="mt-0.5 h-4 w-4 text-primary" />
                  Keep your profile and contact details updated so appointment reminders, lab updates, and billing notices reach you on time.
                </div>
              </SectionCard>
            </div>
          </div>
        </>
      )}
    </>
  );
}
