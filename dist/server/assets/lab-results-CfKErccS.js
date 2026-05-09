import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-Dw-LtZEf.js";
import { u as useAuth, s as supabase, t as toast } from "./router-vpkZZcx8.js";
import { P as ProtectedRoute, A as AppShell, a as PageHeader } from "./PageHeader-DzC9JfH7.js";
import { c as createLucideIcon, B as Button } from "./button-CWz-4Pey.js";
import { I as Input } from "./input-mZUvqWal.js";
import { L as Label } from "./label-CsOweroK.js";
import { T as Textarea } from "./textarea-3-0L2nmI.js";
import { D as Dialog, a as DialogTrigger, P as Plus, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-CoGYsTGl.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-T1ttIxcE.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-mqIxESc3.js";
import { S as Search } from "./search-yGTimT8A.js";
import { T as Trash2 } from "./trash-2-CsN1WGgM.js";
import { o as objectType, s as stringType } from "./types-Bg68Gs7j.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CwplnMT2.js";
import "./shield-check-CJAsWoDW.js";
import "./users-B6azN2KL.js";
const __iconNode = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode);
const schema = objectType({
  patient_id: stringType().min(1),
  consultation_id: stringType().optional().nullable(),
  test_name: stringType().trim().min(1).max(255),
  result: stringType().trim().min(1).max(5e3),
  remarks: stringType().trim().max(1e3).optional().nullable(),
  test_date: stringType().optional()
});
function LabResults() {
  const {
    user
  } = useAuth();
  const [list, setList] = reactExports.useState([]);
  const [patients, setPatients] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [q, setQ] = reactExports.useState("");
  const load = async () => {
    const {
      data,
      error
    } = await supabase.from("lab_results").select("*, patients(full_name)").order("test_date", {
      ascending: false
    });
    if (error) return toast.error(error.message);
    setList(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
    supabase.from("patients").select("id,full_name").order("full_name").then(({
      data
    }) => setPatients(data ?? []));
  }, []);
  const filtered = list.filter((r) => !q || r.patients?.full_name?.toLowerCase().includes(q.toLowerCase()) || r.test_name?.toLowerCase().includes(q.toLowerCase()));
  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      patient_id: fd.get("patient_id"),
      consultation_id: fd.get("consultation_id") || null,
      test_name: fd.get("test_name"),
      result: fd.get("result"),
      remarks: fd.get("remarks") || null,
      test_date: fd.get("test_date") || (/* @__PURE__ */ new Date()).toISOString()
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (editing) {
      const {
        error
      } = await supabase.from("lab_results").update(parsed.data).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Lab result updated");
    } else {
      const {
        error
      } = await supabase.from("lab_results").insert([{
        ...parsed.data,
        lab_officer_id: user?.id
      }]);
      if (error) return toast.error(error.message);
      toast.success("Lab result saved");
    }
    setOpen(false);
    setEditing(null);
    load();
  };
  const onDelete = async (id) => {
    if (!confirm("Delete this lab result?")) return;
    const {
      error
    } = await supabase.from("lab_results").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Lab Results", description: "Record and manage laboratory test results.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search...", className: "w-64 pl-8" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: (v) => {
        setOpen(v);
        if (!v) setEditing(null);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
          " New result"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit lab result" : "New lab result" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "grid gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Patient" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "patient_id", defaultValue: editing?.patient_id ?? void 0, required: true, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: patients.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.full_name }, p.id)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Test name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "test_name", defaultValue: editing?.test_name ?? "", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Result" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { name: "result", rows: 4, defaultValue: editing?.result ?? "", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Remarks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { name: "remarks", rows: 2, defaultValue: editing?.remarks ?? "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Test date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "test_date", type: "datetime-local", defaultValue: editing?.test_date ? new Date(editing.test_date).toISOString().slice(0, 16) : void 0 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: editing ? "Save" : "Create" }) })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border bg-card shadow-[var(--shadow-card)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Patient" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Test" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Result" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "py-8 text-center text-muted-foreground", children: "No lab results found." }) }) : filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: r.patients?.full_name ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: r.test_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: r.result }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: r.test_date ? new Date(r.test_date).toLocaleString() : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
            setEditing(r);
            setOpen(true);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => onDelete(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
        ] })
      ] }, r.id)) })
    ] }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { roles: ["admin", "lab_officer", "doctor"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LabResults, {}) }) });
export {
  SplitComponent as component
};
