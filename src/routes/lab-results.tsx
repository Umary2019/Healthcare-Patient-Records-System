import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Search, Trash2, Edit } from "lucide-react";
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

export const Route = createFileRoute("/lab-results")({
  head: () => ({ meta: [{ title: "Lab Results — Health Care Records" }] }),
  component: () => (
    <ProtectedRoute roles={["admin", "lab_officer", "doctor"]}>
      <AppShell><LabResults /></AppShell>
    </ProtectedRoute>
  ),
});

const schema = z.object({
  patient_id: z.string().min(1),
  consultation_id: z.string().optional().nullable(),
  test_name: z.string().trim().min(1).max(255),
  result: z.string().trim().min(1).max(5000),
  remarks: z.string().trim().max(1000).optional().nullable(),
  test_date: z.string().optional(),
});

function LabResults() {
  const { user } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [q, setQ] = useState("");

  const load = async () => {
    const { data, error } = await supabase
      .from("lab_results")
      .select("*, patients(full_name)")
      .order("test_date", { ascending: false });
    if (error) return toast.error(error.message);
    setList(data ?? []);
  };

  useEffect(() => {
    load();
    supabase.from("patients").select("id,full_name").order("full_name").then(({ data }) => setPatients(data ?? []));
  }, []);

  const filtered = list.filter((r) => !q || r.patients?.full_name?.toLowerCase().includes(q.toLowerCase()) || r.test_name?.toLowerCase().includes(q.toLowerCase()));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      patient_id: fd.get("patient_id"),
      consultation_id: fd.get("consultation_id") || null,
      test_name: fd.get("test_name"),
      result: fd.get("result"),
      remarks: fd.get("remarks") || null,
      test_date: fd.get("test_date") || new Date().toISOString(),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    if (editing) {
      const { error } = await supabase.from("lab_results").update(parsed.data).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Lab result updated");
    } else {
      const { error } = await supabase.from("lab_results").insert([{ ...parsed.data, lab_officer_id: user?.id }]);
      if (error) return toast.error(error.message);
      toast.success("Lab result saved");
    }
    setOpen(false);
    setEditing(null);
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this lab result?")) return;
    const { error } = await supabase.from("lab_results").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <>
      <PageHeader
        title="Lab Results"
        description="Record and manage laboratory test results."
        actions={(
          <>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-64 pl-8" />
            </div>
            <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
              <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> New result</Button></DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>{editing ? "Edit lab result" : "New lab result"}</DialogTitle></DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4">
                  <div className="grid gap-1.5">
                    <Label>Patient</Label>
                    <Select name="patient_id" defaultValue={editing?.patient_id ?? undefined} required>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5"><Label>Test name</Label><Input name="test_name" defaultValue={editing?.test_name ?? ""} required /></div>
                  <div className="grid gap-1.5"><Label>Result</Label><Textarea name="result" rows={4} defaultValue={editing?.result ?? ""} required /></div>
                  <div className="grid gap-1.5"><Label>Remarks</Label><Textarea name="remarks" rows={2} defaultValue={editing?.remarks ?? ""} /></div>
                  <div className="grid gap-1.5"><Label>Test date</Label><Input name="test_date" type="datetime-local" defaultValue={editing?.test_date ? new Date(editing.test_date).toISOString().slice(0,16) : undefined} /></div>
                  <DialogFooter><Button type="submit">{editing ? "Save" : "Create"}</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}
      />

      <div className="rounded-xl border bg-card shadow-[var(--shadow-card)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Test</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No lab results found.</TableCell></TableRow>
            ) : filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.patients?.full_name ?? '—'}</TableCell>
                <TableCell>{r.test_name}</TableCell>
                <TableCell>{r.result}</TableCell>
                <TableCell>{r.test_date ? new Date(r.test_date).toLocaleString() : '—'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setOpen(true); }}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
