import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, X, Receipt, Printer } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/billing")({
  head: () => ({ meta: [{ title: "Billing — Health Care Records" }] }),
  component: () => (
    <ProtectedRoute roles={["admin", "receptionist", "patient"]}>
      <AppShell><Billing /></AppShell>
    </ProtectedRoute>
  ),
});

interface Service { name: string; qty: number; price: number; }

function Billing() {
  const { isStaff, user } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([{ name: "", qty: 1, price: 0 }]);

  const load = async () => {
    const { data, error } = await supabase
      .from("bills")
      .select("*, patients(full_name)")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setList(data ?? []);
  };

  useEffect(() => {
    load();
    if (isStaff) supabase.from("patients").select("id,full_name").order("full_name").then(({ data }) => setPatients(data ?? []));
  }, [isStaff]);

  const total = services.reduce((s, x) => s + (Number(x.qty) || 0) * (Number(x.price) || 0), 0);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const validServices = services.filter((s) => s.name.trim());
    if (validServices.length === 0) return toast.error("Add at least one service");
    const { error } = await supabase.from("bills").insert([{
      patient_id: fd.get("patient_id") as string,
      services: validServices as any,
      total,
      status: "unpaid",
      created_by: user?.id,
    }]);
    if (error) return toast.error(error.message);
    toast.success("Bill created");
    setOpen(false);
    setServices([{ name: "", qty: 1, price: 0 }]);
    load();
  };

  const togglePaid = async (id: string, status: string) => {
    const next = (status === "paid" ? "unpaid" : "paid") as "paid" | "unpaid";
    const { error } = await supabase.from("bills").update({ status: next }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const printBill = (bill: any) => {
    const w = window.open("", "_blank", "width=600,height=800");
    if (!w) return;
    w.document.write(`
      <html><head><title>Invoice</title>
      <style>body{font-family:sans-serif;padding:32px;color:#222}h1{margin:0}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{padding:8px;border-bottom:1px solid #ddd;text-align:left}.right{text-align:right}</style>
      </head><body>
      <h1>Health Care Records Invoice</h1>
      <p><strong>Patient:</strong> ${bill.patients?.full_name ?? ""}<br/><strong>Date:</strong> ${format(new Date(bill.created_at), "PPP")}<br/><strong>Status:</strong> ${bill.status}</p>
      <table><thead><tr><th>Service</th><th class="right">Qty</th><th class="right">Price</th><th class="right">Subtotal</th></tr></thead><tbody>
      ${(bill.services || []).map((s: Service) => `<tr><td>${s.name}</td><td class="right">${s.qty}</td><td class="right">₦${Number(s.price).toFixed(2)}</td><td class="right">₦${(Number(s.qty) * Number(s.price)).toFixed(2)}</td></tr>`).join("")}
      </tbody></table>
      <h2 class="right">Total: ₦${Number(bill.total).toFixed(2)}</h2>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  return (
    <>
      <PageHeader
        title="Billing"
        description="Generate invoices and track payments."
        actions={isStaff && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> New bill</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>New invoice</DialogTitle></DialogHeader>
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label>Patient</Label>
                  <Select name="patient_id" required>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Services</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setServices([...services, { name: "", qty: 1, price: 0 }])}>
                      <Plus className="mr-1 h-3 w-3" /> Add line
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {services.map((s, i) => (
                      <div key={i} className="grid grid-cols-[1fr_80px_100px_auto] gap-2">
                        <Input placeholder="Service" value={s.name} onChange={(e) => { const c = [...services]; c[i].name = e.target.value; setServices(c); }} />
                        <Input type="number" min={1} value={s.qty} onChange={(e) => { const c = [...services]; c[i].qty = Number(e.target.value); setServices(c); }} />
                        <Input type="number" min={0} step="0.01" value={s.price} onChange={(e) => { const c = [...services]; c[i].price = Number(e.target.value); setServices(c); }} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => setServices(services.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-end text-lg font-semibold">Total: ₦{total.toFixed(2)}</div>
                </div>
                <DialogFooter><Button type="submit">Create bill</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      />

      {list.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <Receipt className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No bills yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((b) => (
            <div key={b.id} className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{b.patients?.full_name}</div>
                  <div className="text-xs text-muted-foreground">{format(new Date(b.created_at), "PPP")}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₦{Number(b.total).toFixed(2)}</div>
                  <Badge variant="outline" className={b.status === "paid" ? "border-success/40 bg-success/15 text-success" : "border-warning/40 bg-warning/15"}>
                    {b.status}
                  </Badge>
                </div>
              </div>
              {Array.isArray(b.services) && b.services.length > 0 && (
                <ul className="mt-3 space-y-1 border-t pt-3 text-sm">
                  {b.services.map((s: Service, i: number) => (
                    <li key={i} className="flex justify-between">
                      <span>{s.name} × {s.qty}</span>
                      <span>₦{(Number(s.qty) * Number(s.price)).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                <Button size="sm" variant="outline" onClick={() => printBill(b)}><Printer className="mr-1 h-3 w-3" /> Print</Button>
                {isStaff && (
                  <Button size="sm" onClick={() => togglePaid(b.id, b.status)}>
                    Mark as {b.status === "paid" ? "unpaid" : "paid"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
