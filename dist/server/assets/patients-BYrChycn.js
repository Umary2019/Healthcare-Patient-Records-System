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
import { o as objectType, s as stringType, e as enumType, c as coerce } from "./types-Bg68Gs7j.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CwplnMT2.js";
import "./shield-check-CJAsWoDW.js";
import "./users-B6azN2KL.js";
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);
const schema = objectType({
  full_name: stringType().trim().min(2).max(120),
  age: coerce.number().int().min(0).max(150).optional().nullable(),
  gender: enumType(["male", "female", "other"]).optional().nullable(),
  phone: stringType().trim().max(30).optional().nullable(),
  address: stringType().trim().max(500).optional().nullable(),
  medical_history: stringType().trim().max(5e3).optional().nullable()
});
function normalizePhone(value) {
  return typeof value === "string" ? value.replace(/\s+/g, "").trim() : "";
}
function Patients() {
  const {
    user,
    hasRole,
    primaryRole
  } = useAuth();
  const [list, setList] = reactExports.useState([]);
  const [q, setQ] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const canMutatePatients = primaryRole === "admin" || primaryRole === "receptionist";
  const load = async () => {
    setLoading(true);
    const {
      data,
      error
    } = await supabase.from("patients").select("*").order("created_at", {
      ascending: false
    });
    if (error) toast.error(error.message);
    else setList(data ?? []);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const filtered = list.filter((p) => !q || p.full_name.toLowerCase().includes(q.toLowerCase()) || p.phone?.includes(q));
  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      full_name: fd.get("full_name"),
      age: fd.get("age") || null,
      gender: fd.get("gender") || null,
      phone: fd.get("phone") || null,
      address: fd.get("address") || null,
      medical_history: fd.get("medical_history") || null
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const nextPhone = normalizePhone(parsed.data.phone);
    if (nextPhone) {
      const {
        data: existingPhone
      } = await supabase.from("patients").select("id").eq("phone", nextPhone).neq("id", editing?.id ?? "00000000-0000-0000-0000-000000000000").maybeSingle();
      if (existingPhone) {
        toast.error("That phone number is already registered for another patient.");
        return;
      }
    }
    if (editing) {
      const {
        error
      } = await supabase.from("patients").update({
        ...parsed.data,
        phone: nextPhone || null
      }).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Patient updated");
    } else {
      const {
        error
      } = await supabase.from("patients").insert([{
        ...parsed.data,
        phone: nextPhone || null,
        created_by: user?.id
      }]);
      if (error) return toast.error(error.message);
      toast.success("Patient added");
    }
    setOpen(false);
    setEditing(null);
    load();
  };
  const onDelete = async (id) => {
    if (!confirm("Delete this patient? This cannot be undone.")) return;
    const {
      error
    } = await supabase.from("patients").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Patient deleted");
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Patients", description: "Manage patient records and medical history.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search...", className: "w-64 pl-8" })
      ] }),
      canMutatePatients && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: (v) => {
        setOpen(v);
        if (!v) setEditing(null);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
          " Add patient"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit patient" : "New patient" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "grid gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "full_name", children: "Full name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "full_name", name: "full_name", defaultValue: editing?.full_name, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "age", children: "Age" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "age", name: "age", type: "number", min: 0, max: 150, defaultValue: editing?.age ?? "" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "gender", children: "Gender" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "gender", defaultValue: editing?.gender ?? void 0, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "male", children: "Male" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "female", children: "Female" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "other", children: "Other" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", name: "phone", defaultValue: editing?.phone ?? "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "address", children: "Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "address", name: "address", defaultValue: editing?.address ?? "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "medical_history", children: "Medical history" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "medical_history", name: "medical_history", rows: 3, defaultValue: editing?.medical_history ?? "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: editing ? "Save" : "Create" }) })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border bg-card shadow-[var(--shadow-card)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Age" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Gender" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "py-8 text-center text-muted-foreground", children: "Loading..." }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "py-8 text-center text-muted-foreground", children: "No patients found." }) }) : filtered.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: p.full_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: p.age ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "capitalize", children: p.gender ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: p.phone ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right", children: [
          canMutatePatients && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => {
            setEditing(p);
            setOpen(true);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
          hasRole("admin") && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => onDelete(p.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
        ] })
      ] }, p.id)) })
    ] }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { roles: ["admin", "doctor", "receptionist", "lab_officer"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Patients, {}) }) });
export {
  SplitComponent as component
};
