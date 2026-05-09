import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-Dw-LtZEf.js";
import { u as useAuth, s as supabase, t as toast } from "./router-vpkZZcx8.js";
import { P as ProtectedRoute, A as AppShell, a as PageHeader, X } from "./PageHeader-DzC9JfH7.js";
import { c as createLucideIcon, B as Button } from "./button-CWz-4Pey.js";
import { I as Input } from "./input-mZUvqWal.js";
import { L as Label } from "./label-CsOweroK.js";
import { T as Textarea } from "./textarea-3-0L2nmI.js";
import { D as Dialog, a as DialogTrigger, P as Plus, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-CoGYsTGl.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-T1ttIxcE.js";
import { F as FileText } from "./shield-check-CJAsWoDW.js";
import { f as format } from "./format-NdAr1oQf.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CwplnMT2.js";
import "./users-B6azN2KL.js";
const __iconNode$1 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$1);
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
function Records() {
  const {
    hasRole,
    isStaff
  } = useAuth();
  const canCreate = hasRole("doctor") || hasRole("admin");
  const [list, setList] = reactExports.useState([]);
  const [patients, setPatients] = reactExports.useState([]);
  const [doctors, setDoctors] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [items, setItems] = reactExports.useState([{
    drug: "",
    dosage: "",
    instructions: ""
  }]);
  const [files, setFiles] = reactExports.useState([]);
  const [uploading, setUploading] = reactExports.useState(false);
  const load = async () => {
    const {
      data,
      error
    } = await supabase.from("medical_records").select("*, patients(full_name), doctors(full_name)").order("created_at", {
      ascending: false
    });
    if (error) toast.error(error.message);
    else setList(data ?? []);
  };
  reactExports.useEffect(() => {
    load();
    if (isStaff) {
      supabase.from("patients").select("id,full_name").order("full_name").then(({
        data
      }) => setPatients(data ?? []));
      supabase.from("doctors").select("id,full_name").order("full_name").then(({
        data
      }) => setDoctors(data ?? []));
    }
  }, [isStaff]);
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return toast.error("Max 10MB");
    setUploading(true);
    const path = `${Date.now()}-${file.name}`;
    const {
      error
    } = await supabase.storage.from("medical-reports").upload(path, file);
    setUploading(false);
    if (error) return toast.error(error.message);
    setFiles((f) => [...f, {
      name: file.name,
      path,
      mime: file.type
    }]);
    toast.success("Uploaded");
  };
  const downloadFile = async (path, name) => {
    const {
      data,
      error
    } = await supabase.storage.from("medical-reports").createSignedUrl(path, 60);
    if (error) return toast.error(error.message);
    const a = document.createElement("a");
    a.href = data.signedUrl;
    a.download = name;
    a.click();
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const validItems = items.filter((i) => i.drug.trim());
    const {
      error
    } = await supabase.from("medical_records").insert([{
      patient_id: fd.get("patient_id"),
      doctor_id: fd.get("doctor_id"),
      diagnosis: fd.get("diagnosis") || null,
      notes: fd.get("notes") || null,
      prescription: validItems,
      report_files: files
    }]);
    if (error) return toast.error(error.message);
    toast.success("Record saved");
    setOpen(false);
    setItems([{
      drug: "",
      dosage: "",
      instructions: ""
    }]);
    setFiles([]);
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Medical Records", description: "Diagnoses, prescriptions, and lab reports.", actions: canCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
        " New record"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] max-w-2xl overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New medical record" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "grid gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Patient" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "patient_id", required: true, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: patients.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.full_name }, p.id)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Doctor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "doctor_id", required: true, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: doctors.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: d.id, children: [
                  "Dr. ",
                  d.full_name
                ] }, d.id)) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "diagnosis", children: "Diagnosis" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "diagnosis", name: "diagnosis", rows: 2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "notes", name: "notes", rows: 2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Prescription" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "ghost", size: "sm", onClick: () => setItems([...items, {
                drug: "",
                dosage: "",
                instructions: ""
              }]), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-3 w-3" }),
                " Add"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_1fr_1fr_auto] gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Drug", value: it.drug, onChange: (e) => {
                const c = [...items];
                c[i].drug = e.target.value;
                setItems(c);
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Dosage", value: it.dosage, onChange: (e) => {
                const c = [...items];
                c[i].dosage = e.target.value;
                setItems(c);
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Instructions", value: it.instructions, onChange: (e) => {
                const c = [...items];
                c[i].instructions = e.target.value;
                setItems(c);
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => setItems(items.filter((_, j) => j !== i)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
            ] }, i)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Lab reports" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "file", onChange: handleUpload, accept: "image/*,application/pdf", disabled: uploading }),
              uploading && /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 animate-pulse" })
            ] }),
            files.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1 text-sm", children: files.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded border px-2 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: f.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: () => setFiles(files.filter((_, j) => j !== i)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
            ] }, i)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Save record" }) })
        ] })
      ] })
    ] }) }),
    list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mx-auto mb-3 h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No records yet." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: list.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-start justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: r.patients?.full_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "Dr. ",
          r.doctors?.full_name ?? "—",
          " • ",
          format(new Date(r.created_at), "PP")
        ] })
      ] }) }),
      r.diagnosis && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium uppercase text-muted-foreground", children: "Diagnosis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: r.diagnosis })
      ] }),
      r.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium uppercase text-muted-foreground", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: r.notes })
      ] }),
      Array.isArray(r.prescription) && r.prescription.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium uppercase text-muted-foreground", children: "Prescription" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-1 space-y-1 text-sm", children: r.prescription.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "• ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: p.drug }),
          " — ",
          p.dosage,
          p.instructions ? ` (${p.instructions})` : ""
        ] }, i)) })
      ] }),
      Array.isArray(r.report_files) && r.report_files.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium uppercase text-muted-foreground", children: "Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex flex-wrap gap-2", children: r.report_files.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => downloadFile(f.path, f.name), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1 h-3 w-3" }),
          " ",
          f.name
        ] }, i)) })
      ] })
    ] }, r.id)) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Records, {}) }) });
export {
  SplitComponent as component
};
