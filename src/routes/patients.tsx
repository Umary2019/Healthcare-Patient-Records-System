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
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/patients")({
  head: () => ({ meta: [{ title: "Patients — CareRecords" }] }),
  component: () => (
    <ProtectedRoute roles={["admin", "doctor", "receptionist"]}>
      <AppShell><Patients /></AppShell>
    </ProtectedRoute>
  ),
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  age: z.coerce.number().int().min(0).max(150).optional().nullable(),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  phone: z.string().trim().max(30).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  medical_history: z.string().trim().max(5000).optional().nullable(),
});

type Patient = {
  id: string;
  full_name: string;
  age: number | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  medical_history: string | null;
};

function Patients() {
  const { user, hasRole } = useAuth();
  const [list, setList] = useState<Patient[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setList(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = list.filter((p) =>
    !q || p.full_name.toLowerCase().includes(q.toLowerCase()) || p.phone?.includes(q)
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
      medical_history: fd.get("medical_history") || null,
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    if (editing) {
      const { error } = await supabase.from("patients").update(parsed.data).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Patient updated");
    } else {
      const { error } = await supabase.from("patients").insert([{ ...parsed.data, created_by: user?.id }]);
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
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-64 pl-8" />
            </div>
            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-1 h-4 w-4" /> Add patient</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editing ? "Edit patient" : "New patient"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4">
                  <div className="grid gap-1.5"><Label htmlFor="full_name">Full name</Label><Input id="full_name" name="full_name" defaultValue={editing?.full_name} required /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5"><Label htmlFor="age">Age</Label><Input id="age" name="age" type="number" min={0} max={150} defaultValue={editing?.age ?? ""} /></div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="gender">Gender</Label>
                      <Select name="gender" defaultValue={editing?.gender ?? undefined}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-1.5"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" defaultValue={editing?.phone ?? ""} /></div>
                  <div className="grid gap-1.5"><Label htmlFor="address">Address</Label><Input id="address" name="address" defaultValue={editing?.address ?? ""} /></div>
                  <div className="grid gap-1.5"><Label htmlFor="medical_history">Medical history</Label><Textarea id="medical_history" name="medical_history" rows={3} defaultValue={editing?.medical_history ?? ""} /></div>
                  <DialogFooter><Button type="submit">{editing ? "Save" : "Create"}</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="rounded-xl border bg-card shadow-[var(--shadow-card)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No patients found.</TableCell></TableRow>
            ) : filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.full_name}</TableCell>
                <TableCell>{p.age ?? "—"}</TableCell>
                <TableCell className="capitalize">{p.gender ?? "—"}</TableCell>
                <TableCell>{p.phone ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  {hasRole("admin") && (
                    <Button variant="ghost" size="icon" onClick={() => onDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
