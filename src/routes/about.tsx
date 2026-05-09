import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Heart, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — CareRecords" },
      { name: "description", content: "Learn about CareRecords' mission to modernize clinic operations with secure, role-based healthcare software." },
      { property: "og:title", content: "About CareRecords" },
      { property: "og:description", content: "Our mission to modernize clinic operations with secure healthcare software." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const values = [
    { icon: Heart, title: "Patient-first", desc: "Every workflow starts with better outcomes for patients." },
    { icon: Shield, title: "Secure by design", desc: "Row-level security and role-based access on every record." },
    { icon: Users, title: "Built for teams", desc: "Doctors, receptionists, and admins working in harmony." },
  ];
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About CareRecords</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            We help clinics replace clipboards and chaos with one calm dashboard — so care teams can focus on what matters most.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border bg-card p-6 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
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
        <span className="text-lg font-bold">CareRecords</span>
      </Link>
      <nav className="hidden items-center gap-6 text-sm md:flex">
        <Link to="/services" className="text-muted-foreground hover:text-foreground">Services</Link>
        <Link to="/about" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>About</Link>
        <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
      </nav>
      <Link to="/auth"><Button>Sign in</Button></Link>
    </header>
  );
}
