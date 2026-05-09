import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Activity, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Health Care Records" },
      { name: "description", content: "Get in touch with the Health Care Records team. We're here to help your healthcare project get started." },
      { property: "og:title", content: "Contact Health Care Records" },
      { property: "og:description", content: "Reach out to the Health Care Records team for healthcare providers." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [busy, setBusy] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      toast.success("Message received — we'll get back to you shortly.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Get in touch</h1>
          <p className="mt-4 text-muted-foreground">Questions, demos, partnership — we'd love to hear from you.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-[1fr_1.5fr]">
          <div className="space-y-5">
            <ContactItem icon={Mail} label="Email" value="bargazal001@gmail.com" />
            <ContactItem icon={Phone} label="Phone" value="+234 906 340 6108" />
            <ContactItem icon={MapPin} label="Office" value="Gombe, Nigeria" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4 rounded-xl border bg-card p-6 shadow-[var(--shadow-card)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={5} required />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Sending…" : "Send message"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
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
        <span className="text-lg font-bold">Health Care Records</span>
      </Link>
      <nav className="hidden items-center gap-6 text-sm md:flex">
        <Link to="/services" className="text-muted-foreground hover:text-foreground">Services</Link>
        <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
        <Link to="/contact" className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>Contact</Link>
      </nav>
      <Link to="/auth"><Button>Sign in</Button></Link>
    </header>
  );
}
