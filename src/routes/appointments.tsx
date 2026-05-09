import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/appointments")({
  head: () => ({ meta: [{ title: "Appointments — Health Care Records" }] }),
  component: () => (
    <ProtectedRoute>
      <AppShell>
        <Appointments />
      </AppShell>
    </ProtectedRoute>
  ),
});

const schema = z.object({
  patient_id: z.string().uuid(),
  doctor_id: z.string().uuid(),
  scheduled_at: z.string().min(1),
  reason: z.string().trim().max(500).optional().nullable(),
});

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-warning/15 text-warning-foreground border-warning/40",
  approved: "bg-primary/15 text-primary border-primary/30",
  completed: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
};

type AppointmentRow = {
  id: string;
  scheduled_at: string;
  status: "pending" | "approved" | "completed" | "cancelled";
  reason: string | null;
  patients: { id: string; full_name: string | null } | null;
  doctors: {
    id: string;
    full_name: string | null;
    specialization: string | null;
  } | null;
};

type PatientOption = { id: string; full_name: string };
type DoctorOption = {
  id: string;
  full_name: string;
  specialization: string | null;
};

function Appointments() {
  const { isStaff, user, primaryRole } = useAuth();
  const [list, setList] = useState<AppointmentRow[]>([]);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [open, setOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [ownPatientId, setOwnPatientId] = useState<string>("");
  const isPatient = primaryRole === "patient";

  const getSinglePatientRecord = async (userId: string) => {
    const { data, error } = await supabase
      .from("patients")
      .select("id, full_name")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1);

    if (error) throw error;
    return (data?.[0] ?? null) as PatientOption | null;
  };

  const ensureOwnPatientRecord = async () => {
    if (!user || !isPatient) return;

    const existing = await getSinglePatientRecord(user.id);
    if (existing) return existing;

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();
    const metadata = user.user_metadata as Record<string, unknown> | undefined;
    const fullName =
      profile?.full_name ??
      (typeof metadata?.full_name === "string"
        ? metadata.full_name
        : "Patient");
    const phone =
      profile?.phone ??
      (typeof metadata?.phone === "string" ? metadata.phone : null);

    const { error } = await supabase
      .from("patients")
      .insert([
        { user_id: user.id, full_name: fullName, phone, created_by: user.id },
      ]);
    if (error) toast.error(error.message);
  };

  const load = async () => {
    let query = supabase
      .from("appointments")
      .select(
        "id, scheduled_at, status, reason, patients(id,full_name), doctors(id,full_name,specialization)",
      )
      .order("scheduled_at", { ascending: false });

    if (isPatient && ownPatientId) {
      query = query.eq("patient_id", ownPatientId);
    }

    const { data, error } = await query;
    if (error) toast.error(error.message);
    else setList(data ?? []);
  };

  useEffect(() => {
    (async () => {
      const nextPatient = await ensureOwnPatientRecord();
      if (nextPatient) setOwnPatientId(nextPatient.id);
      await load();
    })();

    if (isStaff) {
      supabase
        .from("patients")
        .select("id, full_name")
        .order("full_name")
        .then(({ data }) => {
          const nextPatients = (data ?? []) as PatientOption[];
          setPatients(nextPatients);
          if (!selectedPatientId && nextPatients.length > 0)
            setSelectedPatientId(nextPatients[0].id);
        });
    } else if (user) {
      getSinglePatientRecord(user.id)
        .then((data) => {
          if (data) {
            setPatients([data]);
            setSelectedPatientId(data.id);
          }
        })
        .catch((error) => toast.error(error.message));
    }
    supabase
      .from("doctors")
      .select("id, full_name, specialization")
      .order("full_name")
      .then(({ data }) => setDoctors((data ?? []) as DoctorOption[]));
  }, [
    isStaff,
    user,
    isPatient,
    ownPatientId,
    selectedPatientId,
    selectedDoctorId,
  ]);

  useEffect(() => {
    if (!selectedDoctorId && doctors.length > 0)
      setSelectedDoctorId(doctors[0].id);
  }, [doctors, selectedDoctorId]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      patient_id: selectedPatientId || fd.get("patient_id"),
      doctor_id: selectedDoctorId || fd.get("doctor_id"),
      scheduled_at: fd.get("scheduled_at"),
      reason: fd.get("reason") || null,
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const { error } = await supabase.from("appointments").insert([
      {
        ...parsed.data,
        scheduled_at: new Date(parsed.data.scheduled_at).toISOString(),
        created_by: user?.id,
      },
    ]);
    if (error) return toast.error(error.message);
    toast.success("Appointment booked");
    setOpen(false);
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("appointments")
      .update({
        status: status as "pending" | "approved" | "completed" | "cancelled",
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    load();
  };

  const filtered =
    filterStatus === "all"
      ? list
      : list.filter((a) => a.status === filterStatus);

  return (
    <>
      <PageHeader
        title={isPatient ? "My appointments" : "Appointments"}
        description={
          isPatient
            ? "Book, view, and cancel your appointments."
            : "Book, approve, and track patient visits."
        }
        actions={
          <>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-1 h-4 w-4" /> Book
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New appointment</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4">
                  <input
                    type="hidden"
                    name="patient_id"
                    value={selectedPatientId}
                  />
                  <input
                    type="hidden"
                    name="doctor_id"
                    value={selectedDoctorId}
                  />
                  {!isPatient ? (
                    <div className="grid gap-1.5">
                      <Label>Patient</Label>
                      <Select
                        value={selectedPatientId}
                        onValueChange={setSelectedPatientId}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className="grid gap-1.5">
                      <Label>Patient</Label>
                      <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                        {patients[0]?.full_name ??
                          "Your patient profile will load automatically."}
                      </div>
                    </div>
                  )}
                  <div className="grid gap-1.5">
                    <Label>Doctor</Label>
                    <Select
                      value={selectedDoctorId}
                      onValueChange={setSelectedDoctorId}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            Dr. {d.full_name} — {d.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="scheduled_at">Date & time</Label>
                    <Input
                      id="scheduled_at"
                      name="scheduled_at"
                      type="datetime-local"
                      required
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea id="reason" name="reason" rows={2} />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Book</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <CalendarDays className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No appointments.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{a.patients?.full_name}</div>
                  <div className="text-sm text-muted-foreground">
                    with Dr. {a.doctors?.full_name} •{" "}
                    {a.doctors?.specialization}
                  </div>
                  {a.reason && <div className="mt-1 text-sm">{a.reason}</div>}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {format(new Date(a.scheduled_at), "PP")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(a.scheduled_at), "p")}
                  </div>
                  <Badge
                    variant="outline"
                    className={`mt-1 capitalize ${STATUS_COLORS[a.status]}`}
                  >
                    {a.status}
                  </Badge>
                </div>
              </div>
              {isStaff && (
                <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                  {a.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => updateStatus(a.id, "approved")}
                    >
                      Approve
                    </Button>
                  )}
                  {(a.status === "approved" || a.status === "pending") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(a.id, "completed")}
                    >
                      Complete
                    </Button>
                  )}
                  {a.status !== "cancelled" && a.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateStatus(a.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
