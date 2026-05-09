import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Users, Stethoscope, CalendarDays, FileText, Receipt, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — MediCare" },
      { name: "description", content: "Patient management, appointments, medical records, billing and role-based access — everything a modern clinic needs." },
      { property: "og:title", content: "MediCare Services" },
      { property: "og:description", content: "Comprehensive clinic management modules for modern healthcare teams." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const services = [
    { icon: Users, title: "Patient Management", desc: "Comprehensive records with medical history, demographics and contact details." },
    { icon: Stethoscope, title: "Doctor Profiles", desc: "Specializations, schedules and availability tracked in one place." },
    { icon: CalendarDays, title: "Smart Appointments", desc: "Book, approve, complete and cancel — with status tracking end-to-end." },
    { icon: FileText, title: "Medical Records", desc: "Digital prescriptions, diagnoses, notes and secure lab report uploads." },
    { icon: Receipt, title: "Billing & Invoicing", desc: "Itemized invoices in ₦ Naira with printable receipts and payment status." },
    { icon: ShieldCheck, title: "Role-Based Access", desc: "Admin, doctor, receptionist and patient — secured by row-level policies." },
  ];
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Our Services</h1>
          <p className="mt-4 text-muted-foreground">From the front desk to the consultation room — built for real workflows.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="rounded-xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="container mx-auto flex items-center justify-between px-4 py-5">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
          <Activity className="h-5 w-5" />
        </div>
        <span className="text-lg font-bold">MediCare</span>
      </Link>
      <nav className="hidden items-center gap-6 text-sm md:flex">
        <Link to="/services" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>Services</Link>
        <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
        <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
      </nav>
      <Link to="/auth"><Button>Sign in</Button></Link>
    </header>
  );
}
