import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/lib/auth-context";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — MediCare" }] }),
  component: () => (
    <ProtectedRoute roles={["admin"]}>
      <AppShell><Admin /></AppShell>
    </ProtectedRoute>
  ),
});

const ROLES: AppRole[] = ["admin", "doctor", "receptionist", "patient", "lab_officer"];

interface Row {
  id: string;
  full_name: string | null;
  created_at: string;
  role: AppRole | null;
}

function Admin() {
  const { user: me } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const syncMissingRoleRecords = async (profiles: Array<{ id: string; full_name: string | null }>, roles: Array<{ user_id: string; role: AppRole }>) => {
    const roleMap = new Map<string, AppRole>();
    roles.forEach((r) => roleMap.set(r.user_id, r.role));

    const [{ data: existingPatients }, { data: existingDoctors }] = await Promise.all([
      supabase.from("patients").select("user_id"),
      supabase.from("doctors").select("user_id"),
    ]);

    const patientIds = new Set((existingPatients ?? []).map((row) => row.user_id).filter((id): id is string => Boolean(id)));
    const doctorIds = new Set((existingDoctors ?? []).map((row) => row.user_id).filter((id): id is string => Boolean(id)));

    const missingPatients = profiles
      .filter((profile) => roleMap.get(profile.id) === "patient" && !patientIds.has(profile.id))
      .map((profile) => ({
        user_id: profile.id,
        full_name: profile.full_name ?? "Unnamed user",
        phone: null,
        created_by: profile.id,
      }));

    const missingDoctors = profiles
      .filter((profile) => roleMap.get(profile.id) === "doctor" && !doctorIds.has(profile.id))
      .map((profile) => ({
        user_id: profile.id,
        full_name: profile.full_name ?? "Unnamed user",
        specialization: "General Practice",
        phone: null,
        email: null,
      }));

    if (missingPatients.length > 0) {
      const { error } = await supabase.from("patients").insert(missingPatients);
      if (error) toast.error(error.message);
    }

    if (missingDoctors.length > 0) {
      const { error } = await supabase.from("doctors").insert(missingDoctors);
      if (error) toast.error(error.message);
    }
  };

  const load = async () => {
    setLoading(true);
    const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (pErr) toast.error(pErr.message);
    if (rErr) toast.error(rErr.message);
    const map = new Map<string, AppRole>();
    (roles ?? []).forEach((r: any) => map.set(r.user_id, r.role));
    setRows((profiles ?? []).map((p: any) => ({ ...p, role: map.get(p.id) ?? null })));

    if (profiles && roles) {
      await syncMissingRoleRecords(profiles, roles as Array<{ user_id: string; role: AppRole }>);
    }

    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const changeRole = async (userId: string, next: AppRole) => {
    if (userId === me?.id && next !== "admin") {
      const ok = confirm("You're about to remove your own admin access. Continue?");
      if (!ok) return;
    }
    setBusyId(userId);
    // Replace existing roles atomically: delete then insert
    const del = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (del.error) {
      setBusyId(null);
      return toast.error(del.error.message);
    }
    const ins = await supabase.from("user_roles").insert([{ user_id: userId, role: next }]);
    setBusyId(null);
    if (ins.error) return toast.error(ins.error.message);

    if (next === "patient") {
      const profile = rows.find((row) => row.id === userId);
      const { data: existing } = await supabase.from("patients").select("id").eq("user_id", userId).maybeSingle();
      if (!existing) {
        const insertPatient = await supabase.from("patients").insert([{ user_id: userId, full_name: profile?.full_name ?? "Unnamed user", phone: null, created_by: userId }]);
        if (insertPatient.error) toast.error(insertPatient.error.message);
      }
    }

    if (next === "doctor") {
      const profile = rows.find((row) => row.id === userId);
      const { data: existing } = await supabase.from("doctors").select("id").eq("user_id", userId).maybeSingle();
      if (!existing) {
        const insertDoctor = await supabase.from("doctors").insert([{ user_id: userId, full_name: profile?.full_name ?? "Unnamed user", specialization: "General Practice", phone: null, email: null }]);
        if (insertDoctor.error) toast.error(insertDoctor.error.message);
      }
    }
    // write audit log
    await supabase.from("audit_logs").insert([{ actor_id: me?.id, action: "change_role", resource_type: "user", resource_id: userId, details: JSON.stringify({ new_role: next }), timestamp: new Date().toISOString() }]);

    toast.success(`Role updated to ${next}`);
    load();
  };

  const filtered = rows.filter((r) =>
    !q || (r.full_name ?? "").toLowerCase().includes(q.toLowerCase()) || r.id.includes(q)
  );

  return (
    <>
      <PageHeader
        title="User administration"
        description="Promote or demote users. Changes apply immediately and are restricted to admins by row-level security."
      />

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or user id…"
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border bg-card p-12 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading users…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{u.full_name || "Unnamed user"}</div>
                  {u.id === me?.id && <Badge variant="outline" className="text-xs">You</Badge>}
                </div>
                <div className="truncate font-mono text-xs text-muted-foreground">{u.id}</div>
                <div className="text-xs text-muted-foreground">Joined {format(new Date(u.created_at), "PP")}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className={
                    u.role === "admin"
                      ? "border-primary/40 bg-primary/10 text-primary capitalize"
                      : "capitalize"
                  }
                >
                  {u.role ?? "none"}
                </Badge>
                <Select
                  value={u.role ?? undefined}
                  onValueChange={(v) => changeRole(u.id, v as AppRole)}
                  disabled={busyId === u.id}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Assign role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant={u.active === false ? "secondary" : "ghost"}
                  size="sm"
                  onClick={async () => {
                    const next = !u.active;
                    const { error } = await supabase.from("profiles").update({ active: next }).eq("id", u.id);
                    if (error) return toast.error(error.message);
                    // write audit log
                    await supabase.from("audit_logs").insert([{ actor_id: me?.id, action: next ? "activate_user" : "deactivate_user", resource_type: "user", resource_id: u.id, details: JSON.stringify({}), timestamp: new Date().toISOString() }]);
                    toast.success(next ? "User activated" : "User deactivated");
                    load();
                  }}
                >
                  {u.active === false ? "Activate" : "Deactivate"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
