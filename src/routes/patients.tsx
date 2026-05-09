import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/patients")({
  head: () => ({ meta: [{ title: "Patients — Health Care Records" }] }),
  component: () => (
    <ProtectedRoute roles={["admin", "doctor", "receptionist", "lab_officer"]}>
      <AppShell>
        <Patients />
      </AppShell>
    </ProtectedRoute>
  ),
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  age: z.coerce.number().int().min(0).max(150).optional().nullable(),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  blood_group: z.string().trim().max(10).optional().nullable(),
  insurance_provider: z.string().trim().max(120).optional().nullable(),
  insurance_number: z.string().trim().max(120).optional().nullable(),
  insurance_plan: z.string().trim().max(120).optional().nullable(),
  emergency_contact_name: z.string().trim().max(120).optional().nullable(),
  emergency_contact_phone: z.string().trim().max(30).optional().nullable(),
});

type Patient = {
  id: string;
  full_name: string;
  age: number | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  blood_group: string | null;
  insurance_provider: string | null;
  insurance_number: string | null;
  insurance_plan: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
};

function normalizePhone(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, "").trim() : "";
}

function Patients() {
  const { user, hasRole, primaryRole } = useAuth();
  const [list, setList] = useState<Patient[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const canMutatePatients =
    primaryRole === "admin" || primaryRole === "receptionist";

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setList(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = list.filter(
    (p) =>
      !q ||
      p.full_name.toLowerCase().includes(q.toLowerCase()) ||
      p.phone?.includes(q) ||
      p.id.toLowerCase().includes(q.toLowerCase()) ||
      p.insurance_number?.toLowerCase().includes(q.toLowerCase()),
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      full_name: fd.get("full_name"),
      age: fd.get("age") || null,
      gender: fd.get("gender") || null,
      phone: fd.get("phone") || null,
      address: fd.get("address") || null,
      blood_group: fd.get("blood_group") || null,
      insurance_provider: fd.get("insurance_provider") || null,
      insurance_number: fd.get("insurance_number") || null,
      insurance_plan: fd.get("insurance_plan") || null,
      emergency_contact_name: fd.get("emergency_contact_name") || null,
      emergency_contact_phone: fd.get("emergency_contact_phone") || null,
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    const nextPhone = normalizePhone(parsed.data.phone);
    if (nextPhone) {
      const { data: existingPhone } = await supabase
        .from("patients")
        .select("id")
        .eq("phone", nextPhone)
        .neq("id", editing?.id ?? "00000000-0000-0000-0000-000000000000")
        .maybeSingle();
      if (existingPhone) {
        toast.error(
          "That phone number is already registered for another patient.",
        );
        return;
      }
    }

    if (editing) {
      const { error } = await supabase
        .from("patients")
        .update({ ...parsed.data, phone: nextPhone || null })
        .eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Patient updated");
    } else {
      const { error } = await supabase
        .from("patients")
        .insert([
          { ...parsed.data, phone: nextPhone || null, created_by: user?.id },
        ]);
      if (error) return toast.error(error.message);
      toast.success("Patient added");
    }
    setOpen(false);
    setEditing(null);
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this patient? This cannot be undone.")) return;
    const { error } = await supabase.from("patients").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Patient deleted");
    load();
  };

  return (
    <>
      <PageHeader
        title="Patients"
        description="Manage patient records and medical history."
        actions={
          <>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, patient ID, phone, or insurance..."
                className="w-72 pl-8"
              />
            </div>
            {canMutatePatients && (
              <Dialog
                open={open}
                onOpenChange={(v) => {
                  setOpen(v);
                  if (!v) setEditing(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-1 h-4 w-4" /> Add patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {editing ? "Edit patient" : "New patient"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={onSubmit} className="grid gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="full_name">Full name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        defaultValue={editing?.full_name}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          min={0}
                          max={150}
                          defaultValue={editing?.age ?? ""}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          name="gender"
                          defaultValue={editing?.gender ?? undefined}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="blood_group">Blood group</Label>
                        <Input
                          id="blood_group"
                          name="blood_group"
                          defaultValue={editing?.blood_group ?? ""}
                          placeholder="A+, O-, ..."
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="insurance_number">
                          Insurance number
                        </Label>
                        <Input
                          id="insurance_number"
                          name="insurance_number"
                          defaultValue={editing?.insurance_number ?? ""}
                        />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="insurance_provider">
                        Insurance provider
                      </Label>
                      <Input
                        id="insurance_provider"
                        name="insurance_provider"
                        defaultValue={editing?.insurance_provider ?? ""}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="insurance_plan">Insurance plan</Label>
                      <Input
                        id="insurance_plan"
                        name="insurance_plan"
                        defaultValue={editing?.insurance_plan ?? ""}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={editing?.phone ?? ""}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        defaultValue={editing?.address ?? ""}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="emergency_contact_name">
                          Emergency contact
                        </Label>
                        <Input
                          id="emergency_contact_name"
                          name="emergency_contact_name"
                          defaultValue={editing?.emergency_contact_name ?? ""}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="emergency_contact_phone">
                          Emergency phone
                        </Label>
                        <Input
                          id="emergency_contact_phone"
                          name="emergency_contact_phone"
                          defaultValue={editing?.emergency_contact_phone ?? ""}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {editing ? "Save" : "Create"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </>
        }
      />

      <div className="rounded-xl border bg-card shadow-[var(--shadow-card)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Insurance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="font-medium">{p.full_name}</TableCell>
                  <TableCell>{p.age ?? "—"}</TableCell>
                  <TableCell className="capitalize">
                    {p.gender ?? "—"}
                  </TableCell>
                  <TableCell>{p.phone ?? "—"}</TableCell>
                  <TableCell>
                    <div className="text-sm">{p.insurance_provider ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.insurance_number ?? ""}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {canMutatePatients && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(p);
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
                        onClick={() => onDelete(p.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
