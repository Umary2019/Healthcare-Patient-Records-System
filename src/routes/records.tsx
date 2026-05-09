import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, FileText, Upload, X, Download } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/records")({
  head: () => ({ meta: [{ title: "Medical Records — MediCare" }] }),
  component: () => (
    <ProtectedRoute>
      <AppShell><Records /></AppShell>
    </ProtectedRoute>
  ),
});

interface PrescriptionItem { drug: string; dosage: string; instructions: string; }
interface ReportFile { name: string; path: string; mime: string; }

function Records() {
  const { hasRole, isStaff } = useAuth();
  const canCreate = hasRole("doctor") || hasRole("admin");
  const [list, setList] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PrescriptionItem[]>([{ drug: "", dosage: "", instructions: "" }]);
  const [files, setFiles] = useState<ReportFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("medical_records")
      .select("*, patients(full_name), doctors(full_name)")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setList(data ?? []);
  };

  useEffect(() => {
    load();
    if (isStaff) {
      supabase.from("patients").select("id,full_name").order("full_name").then(({ data }) => setPatients(data ?? []));
      supabase.from("doctors").select("id,full_name").order("full_name").then(({ data }) => setDoctors(data ?? []));
    }
  }, [isStaff]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error("Max 10MB");
    setUploading(true);
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("medical-reports").upload(path, file);
    setUploading(false);
    if (error) return toast.error(error.message);
    setFiles((f) => [...f, { name: file.name, path, mime: file.type }]);
    toast.success("Uploaded");
  };

  const downloadFile = async (path: string, name: string) => {
    const { data, error } = await supabase.storage.from("medical-reports").createSignedUrl(path, 60);
    if (error) return toast.error(error.message);
    const a = document.createElement("a");
    a.href = data.signedUrl;
    a.download = name;
    a.click();
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const validItems = items.filter((i) => i.drug.trim());
    const { error } = await supabase.from("medical_records").insert([{
      patient_id: fd.get("patient_id") as string,
      doctor_id: fd.get("doctor_id") as string,
      diagnosis: (fd.get("diagnosis") as string) || null,
      notes: (fd.get("notes") as string) || null,
      prescription: validItems as any,
      report_files: files as any,
    }]);
    if (error) return toast.error(error.message);
    toast.success("Record saved");
    setOpen(false);
    setItems([{ drug: "", dosage: "", instructions: "" }]);
    setFiles([]);
    load();
  };

  return (
    <>
      <PageHeader
        title="Medical Records"
        description="Diagnoses, prescriptions, and lab reports."
        actions={canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> New record</Button></DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader><DialogTitle>New medical record</DialogTitle></DialogHeader>
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label>Patient</Label>
                    <Select name="patient_id" required>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Doctor</Label>
                    <Select name="doctor_id" required>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{doctors.map((d) => <SelectItem key={d.id} value={d.id}>Dr. {d.full_name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-1.5"><Label htmlFor="diagnosis">Diagnosis</Label><Textarea id="diagnosis" name="diagnosis" rows={2} /></div>
                <div className="grid gap-1.5"><Label htmlFor="notes">Notes</Label><Textarea id="notes" name="notes" rows={2} /></div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Prescription</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setItems([...items, { drug: "", dosage: "", instructions: "" }])}>
                      <Plus className="mr-1 h-3 w-3" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {items.map((it, i) => (
                      <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                        <Input placeholder="Drug" value={it.drug} onChange={(e) => { const c = [...items]; c[i].drug = e.target.value; setItems(c); }} />
                        <Input placeholder="Dosage" value={it.dosage} onChange={(e) => { const c = [...items]; c[i].dosage = e.target.value; setItems(c); }} />
                        <Input placeholder="Instructions" value={it.instructions} onChange={(e) => { const c = [...items]; c[i].instructions = e.target.value; setItems(c); }} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => setItems(items.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Lab reports</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input type="file" onChange={handleUpload} accept="image/*,application/pdf" disabled={uploading} />
                    {uploading && <Upload className="h-4 w-4 animate-pulse" />}
                  </div>
                  {files.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center justify-between rounded border px-2 py-1">
                          <span className="truncate">{f.name}</span>
                          <Button type="button" variant="ghost" size="icon" onClick={() => setFiles(files.filter((_, j) => j !== i))}><X className="h-3 w-3" /></Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <DialogFooter><Button type="submit">Save record</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      {list.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No records yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((r) => (
            <div key={r.id} className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{r.patients?.full_name}</div>
                  <div className="text-xs text-muted-foreground">Dr. {r.doctors?.full_name ?? "—"} • {format(new Date(r.created_at), "PP")}</div>
                </div>
              </div>
              {r.diagnosis && <div className="mt-3"><div className="text-xs font-medium uppercase text-muted-foreground">Diagnosis</div><p className="text-sm">{r.diagnosis}</p></div>}
              {r.notes && <div className="mt-3"><div className="text-xs font-medium uppercase text-muted-foreground">Notes</div><p className="text-sm">{r.notes}</p></div>}
              {Array.isArray(r.prescription) && r.prescription.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-medium uppercase text-muted-foreground">Prescription</div>
                  <ul className="mt-1 space-y-1 text-sm">
                    {r.prescription.map((p: PrescriptionItem, i: number) => (
                      <li key={i}>• <strong>{p.drug}</strong> — {p.dosage}{p.instructions ? ` (${p.instructions})` : ""}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(r.report_files) && r.report_files.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-medium uppercase text-muted-foreground">Reports</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {r.report_files.map((f: ReportFile, i: number) => (
                      <Button key={i} variant="outline" size="sm" onClick={() => downloadFile(f.path, f.name)}>
                        <Download className="mr-1 h-3 w-3" /> {f.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
