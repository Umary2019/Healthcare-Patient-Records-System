import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Users, Stethoscope, CalendarDays, FileText, Receipt, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareRecords — Modern Clinic Management System" },
      { name: "description", content: "Manage patients, doctors, appointments, medical records and billing — all in one secure platform." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { user } = useAuth();

  const features = [
    { icon: Users, title: "Patient Management", desc: "Complete patient records with medical history at your fingertips." },
    { icon: Stethoscope, title: "Doctor Profiles", desc: "Specializations, schedules, and availability in one place." },
    { icon: CalendarDays, title: "Smart Appointments", desc: "Book, approve, and track appointments effortlessly." },
    { icon: FileText, title: "Medical Records", desc: "Digital prescriptions, diagnoses, and lab reports." },
    { icon: Receipt, title: "Billing & Payments", desc: "Generate invoices and track payment status." },
    { icon: ShieldCheck, title: "Role-Based Access", desc: "Admin, doctor, receptionist, and patient — secured by RLS." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">CareRecords</span>
        </div>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/services" className="text-muted-foreground hover:text-foreground">Services</Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
          <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
        </nav>
        <Link to={user ? "/dashboard" : "/auth"}>
          <Button>{user ? "Go to dashboard" : "Sign in"}</Button>
        </Link>
      </header>

      <section
        className="relative overflow-hidden border-b"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center text-primary-foreground">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" /> HIPAA-conscious • Role-based access
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              The complete clinic, in one calm dashboard.
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/85 md:text-xl">
              Patients, doctors, appointments, records, and billing — unified with bank-grade security.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to={user ? "/dashboard" : "/auth"}>
                <Button size="lg" variant="secondary" className="gap-2">
                  {user ? "Go to dashboard" : "Get started"} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {!user && (
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                    Staff sign in
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Everything your clinic needs</h2>
          <p className="mt-3 text-muted-foreground">
            From the front desk to the consultation room — built for real workflows.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t bg-muted/40 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} CareRecords. Built with care.
      </footer>
    </div>
  );
}
