import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/doctors")({
  head: () => ({ meta: [{ title: "Doctors — MediCare" }] }),
  component: () => (
    <ProtectedRoute>
      <AppShell><Doctors /></AppShell>
    </ProtectedRoute>
  ),
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  specialization: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30).optional().nullable(),
  email: z.string().trim().email().max(255).optional().or(z.literal("")).nullable(),
  bio: z.string().trim().max(2000).optional().nullable(),
});

type Doctor = {
  id: string;
  full_name: string;
  specialization: string;
  phone: string | null;
  email: string | null;
  bio: string | null;
};

function Doctors() {
  const { hasRole, user, primaryRole } = useAuth();
  const [list, setList] = useState<Doctor[]>([]);
  const [open, setOpen] = useState(false);

  const ensureOwnDoctorRecord = async () => {
    if (!user || primaryRole !== "doctor") return;

    const { data: existing } = await supabase.from("doctors").select("id").eq("user_id", user.id).maybeSingle();
    if (existing) return;

    const { data: profile } = await supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle();
    const metadata = user.user_metadata as Record<string, unknown> | undefined;
    const fullName = profile?.full_name ?? (typeof metadata?.full_name === "string" ? metadata.full_name : "Doctor");
    const specialization = typeof metadata?.specialization === "string" && metadata.specialization.trim() ? metadata.specialization : "General Practice";
    const phone = profile?.phone ?? (typeof metadata?.phone === "string" ? metadata.phone : null);

    const { error } = await supabase.from("doctors").insert([{ user_id: user.id, full_name: fullName, specialization, phone, email: user.email }]);
    if (error) toast.error(error.message);
  };

  const load = async () => {
    const { data, error } = await supabase.from("doctors").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setList(data ?? []);
  };
  useEffect(() => {
    (async () => {
      await ensureOwnDoctorRecord();
      await load();
    })();
  }, [user?.id, primaryRole]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      full_name: fd.get("full_name"),
      specialization: fd.get("specialization"),
      phone: fd.get("phone") || null,
      email: fd.get("email") || null,
      bio: fd.get("bio") || null,
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const { error } = await supabase.from("doctors").insert([parsed.data as any]);
    if (error) return toast.error(error.message);
    toast.success("Doctor added");
    setOpen(false);
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this doctor?")) return;
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Specialists and their contact details."
        actions={hasRole("admin") && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Add doctor</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New doctor</DialogTitle></DialogHeader>
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-1.5"><Label htmlFor="full_name">Full name</Label><Input id="full_name" name="full_name" required /></div>
                <div className="grid gap-1.5"><Label htmlFor="specialization">Specialization</Label><Input id="specialization" name="specialization" required placeholder="Cardiology, Pediatrics..." /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" /></div>
                  <div className="grid gap-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" /></div>
                </div>
                <div className="grid gap-1.5"><Label htmlFor="bio">Bio</Label><Textarea id="bio" name="bio" rows={3} /></div>
                <DialogFooter><Button type="submit">Create</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      {list.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">No doctors yet.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => (
            <div key={d.id} className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elegant)]">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Dr. {d.full_name}</div>
                  <div className="text-sm text-primary">{d.specialization}</div>
                </div>
                {hasRole("admin") && (
                  <Button variant="ghost" size="icon" onClick={() => onDelete(d.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              {(d.phone || d.email) && (
                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  {d.email && <div>{d.email}</div>}
                  {d.phone && <div>{d.phone}</div>}
                </div>
              )}
              {d.bio && <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{d.bio}</p>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
