import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-CYQJekC1.js";
import { u as useAuth, s as supabase, t as toast } from "./router-CTu-sRtw.js";
import { P as ProtectedRoute, A as AppShell, a as PageHeader, X } from "./PageHeader-D2XCUBu7.js";
import { c as createLucideIcon, B as Button } from "./button-DOu4fBLP.js";
import { I as Input } from "./input-FUnIe9ab.js";
import { L as Label } from "./label-DuOPJ3Pt.js";
import { D as Dialog, a as DialogTrigger, P as Plus, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-CSkMKj6D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C6Z6DS6s.js";
import { B as Badge } from "./badge-BAE1RQy8.js";
import { R as Receipt } from "./stethoscope-U1M9GSyd.js";
import { f as format } from "./format-NdAr1oQf.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-VI4E7ysD.js";
import "./users-CK4E6vm0.js";
const __iconNode = [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
];
const Printer = createLucideIcon("printer", __iconNode);
function Billing() {
  const {
    isStaff,
    user
  } = useAuth();
  const [list, setList] = reactExports.useState([]);
  const [patients, setPatients] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [services, setServices] = reactExports.useState([{
    name: "",
    qty: 1,
    price: 0
  }]);
  const load = async () => {
    const {
      data,
      error
    } = await supabase.from("bills").select("*, patients(full_name)").order("created_at", {
      ascending: false
    });
    if (error) toast.error(error.message);
    else setList(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
    if (isStaff) supabase.from("patients").select("id,full_name").order("full_name").then(({
      data
    }) => setPatients(data ?? []));
  }, [isStaff]);
  const total = services.reduce((s, x) => s + (Number(x.qty) || 0) * (Number(x.price) || 0), 0);
  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const validServices = services.filter((s) => s.name.trim());
    if (validServices.length === 0) return toast.error("Add at least one service");
    const {
      error
    } = await supabase.from("bills").insert([{
      patient_id: fd.get("patient_id"),
      services: validServices,
      total,
      status: "unpaid",
      created_by: user?.id
    }]);
    if (error) return toast.error(error.message);
    toast.success("Bill created");
    setOpen(false);
    setServices([{
      name: "",
      qty: 1,
      price: 0
    }]);
    load();
  };
  const togglePaid = async (id, status) => {
    const next = status === "paid" ? "unpaid" : "paid";
    const {
      error
    } = await supabase.from("bills").update({
      status: next
    }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };
  const printBill = (bill) => {
    const w = window.open("", "_blank", "width=600,height=800");
    if (!w) return;
    w.document.write(`
      <html><head><title>Invoice</title>
      <style>body{font-family:sans-serif;padding:32px;color:#222}h1{margin:0}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{padding:8px;border-bottom:1px solid #ddd;text-align:left}.right{text-align:right}</style>
      </head><body>
      <h1>MediCare Invoice</h1>
      <p><strong>Patient:</strong> ${bill.patients?.full_name ?? ""}<br/><strong>Date:</strong> ${format(new Date(bill.created_at), "PPP")}<br/><strong>Status:</strong> ${bill.status}</p>
      <table><thead><tr><th>Service</th><th class="right">Qty</th><th class="right">Price</th><th class="right">Subtotal</th></tr></thead><tbody>
      ${(bill.services || []).map((s) => `<tr><td>${s.name}</td><td class="right">${s.qty}</td><td class="right">₦${Number(s.price).toFixed(2)}</td><td class="right">₦${(Number(s.qty) * Number(s.price)).toFixed(2)}</td></tr>`).join("")}
      </tbody></table>
      <h2 class="right">Total: ₦${Number(bill.total).toFixed(2)}</h2>
      </body></html>
    `);
    w.document.close();
    w.print();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Billing", description: "Generate invoices and track payments.", actions: isStaff && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
        " New bill"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New invoice" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "grid gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Patient" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "patient_id", required: true, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: patients.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.full_name }, p.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Services" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setServices([...services, {
                name: "",
                qty: 1,
                price: 0
              }]), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-3 w-3" }),
                " Add line"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: services.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_80px_100px_auto] gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Service", value: s.name, onChange: (e) => {
                const c = [...services];
                c[i].name = e.target.value;
                setServices(c);
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 1, value: s.qty, onChange: (e) => {
                const c = [...services];
                c[i].qty = Number(e.target.value);
                setServices(c);
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, step: "0.01", value: s.price, onChange: (e) => {
                const c = [...services];
                c[i].price = Number(e.target.value);
                setServices(c);
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => setServices(services.filter((_, j) => j !== i)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
            ] }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-end text-lg font-semibold", children: [
              "Total: ₦",
              total.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Create bill" }) })
        ] })
      ] })
    ] }) }),
    list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "mx-auto mb-3 h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No bills yet." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: list.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: b.patients?.full_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: format(new Date(b.created_at), "PPP") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold", children: [
            "₦",
            Number(b.total).toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: b.status === "paid" ? "border-success/40 bg-success/15 text-success" : "border-warning/40 bg-warning/15", children: b.status })
        ] })
      ] }),
      Array.isArray(b.services) && b.services.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-1 border-t pt-3 text-sm", children: b.services.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          s.name,
          " × ",
          s.qty
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "₦",
          (Number(s.qty) * Number(s.price)).toFixed(2)
        ] })
      ] }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2 border-t pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => printBill(b), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "mr-1 h-3 w-3" }),
          " Print"
        ] }),
        isStaff && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => togglePaid(b.id, b.status), children: [
          "Mark as ",
          b.status === "paid" ? "unpaid" : "paid"
        ] })
      ] })
    ] }, b.id)) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { roles: ["admin", "receptionist", "patient"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Billing, {}) }) });
export {
  SplitComponent as component
};
