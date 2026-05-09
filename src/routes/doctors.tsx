import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Stethoscope, Pencil, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/doctors")({
  head: () => ({ meta: [{ title: "Doctors — Health Care Records" }] }),
  component: () => (
    <ProtectedRoute>
      <AppShell>
        <Doctors />
      </AppShell>
    </ProtectedRoute>
  ),
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  specialization: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30).optional().nullable(),
  email: z
    .string()
    .trim()
    .email()
    .max(255)
    .optional()
    .or(z.literal(""))
    .nullable(),
  bio: z.string().trim().max(2000).optional().nullable(),
  availability: z.string().trim().max(5000).optional().nullable(),
});

type Doctor = {
  id: string;
  user_id: string | null;
  full_name: string;
  specialization: string;
  phone: string | null;
  email: string | null;
  bio: string | null;
  active: boolean | null;
  availability: Record<string, unknown> | null;
};

function Doctors() {
  const { hasRole, user, primaryRole } = useAuth();
  const [list, setList] = useState<Doctor[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);

  const ensureOwnDoctorRecord = async () => {
    if (!user || primaryRole !== "doctor") return;

    const { data: existing } = await supabase
      .from("doctors")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();
    const metadata = user.user_metadata as Record<string, unknown> | undefined;
    const fullName =
      profile?.full_name ??
      (typeof metadata?.full_name === "string" ? metadata.full_name : "Doctor");
    const specialization =
      typeof metadata?.specialization === "string" &&
      metadata.specialization.trim()
        ? metadata.specialization
        : "General Practice";
    const phone =
      profile?.phone ??
      (typeof metadata?.phone === "string" ? metadata.phone : null);

    const { error } = await supabase.from("doctors").insert([
      {
        user_id: user.id,
        full_name: fullName,
        specialization,
        phone,
        email: user.email,
      },
    ]);
    if (error) toast.error(error.message);
  };

  const load = async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .order("created_at", { ascending: false });
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
      availability: fd.get("availability") || null,
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    let availabilityValue: Record<string, unknown> | null = null;
    if (
      typeof parsed.data.availability === "string" &&
      parsed.data.availability.trim()
    ) {
      try {
        availabilityValue = JSON.parse(parsed.data.availability);
      } catch {
        return toast.error("Availability must be valid JSON.");
      }
    }

    const payload = {
      full_name: parsed.data.full_name,
      specialization: parsed.data.specialization,
      phone: parsed.data.phone,
      email: parsed.data.email,
      bio: parsed.data.bio,
      availability: availabilityValue ?? {},
    };

    const query = editing
      ? supabase
          .from("doctors")
          .update(payload as never)
          .eq("id", editing.id)
      : supabase.from("doctors").insert([payload as never]);
    const { error } = await query;
    if (error) return toast.error(error.message);
    toast.success(editing ? "Doctor updated" : "Doctor added");
    setOpen(false);
    setEditing(null);
    load();
  };

  const toggleActive = async (doctor: Doctor) => {
    const next = !(doctor.active ?? true);
    const { error } = await supabase
      .from("doctors")
      .update({ active: next })
      .eq("id", doctor.id);
    if (error) return toast.error(error.message);
    toast.success(next ? "Doctor activated" : "Doctor deactivated");
    load();
  };

  return (
    <>
      <PageHeader
        title="Doctors"
        description="Specialists and their contact details."
        actions={
          hasRole("admin") && (
            <Dialog
              open={open}
              onOpenChange={(next) => {
                setOpen(next);
                if (!next) setEditing(null);
              }}
            >
              <DialogTrigger asChild>
                <Button onClick={() => setEditing(null)}>
                  <Plus className="mr-1 h-4 w-4" /> Add doctor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editing ? "Edit doctor" : "New doctor"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="full_name">Full name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      required
                      defaultValue={editing?.full_name ?? ""}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      required
                      placeholder="Cardiology, Pediatrics..."
                      defaultValue={editing?.specialization ?? ""}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={editing?.phone ?? ""}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={editing?.email ?? ""}
                      />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="availability">Availability (JSON)</Label>
                    <Textarea
                      id="availability"
                      name="availability"
                      rows={4}
                      placeholder='{"mon":["09:00-13:00"]}'
                      defaultValue={
                        editing?.availability
                          ? JSON.stringify(editing.availability, null, 2)
                          : ""
                      }
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      defaultValue={editing?.bio ?? ""}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editing ? "Save changes" : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )
        }
      />

      {list.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          No doctors yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Dr. {d.full_name}</div>
                  <div className="text-sm text-primary">{d.specialization}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        d.active === false
                          ? "border-destructive/30 bg-destructive/10 text-destructive"
                          : "border-success/30 bg-success/10 text-success"
                      }
                    >
                      {d.active === false ? "Inactive" : "Active"}
                    </Badge>
                  </div>
                </div>
                {(hasRole("admin") ||
                  (primaryRole === "doctor" && d.user_id === user?.id)) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(d);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {hasRole("admin") && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleActive(d)}
                  >
                    {d.active === false ? (
                      <Power className="h-4 w-4 text-success" />
                    ) : (
                      <PowerOff className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                )}
              </div>
              {(d.phone || d.email) && (
                <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                  {d.email && <div>{d.email}</div>}
                  {d.phone && <div>{d.phone}</div>}
                </div>
              )}
              {d.availability && Object.keys(d.availability).length > 0 && (
                <pre className="mt-3 overflow-x-auto rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                  {JSON.stringify(d.availability, null, 2)}
                </pre>
              )}
              {d.bio && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                  {d.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
