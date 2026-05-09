import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-CYQJekC1.js";
import { u as useAuth, s as supabase, t as toast } from "./router-CTu-sRtw.js";
import { P as ProtectedRoute, A as AppShell, a as PageHeader } from "./PageHeader-D2XCUBu7.js";
import { B as Button } from "./button-DOu4fBLP.js";
import { I as Input } from "./input-FUnIe9ab.js";
import { L as Label } from "./label-DuOPJ3Pt.js";
import { T as Textarea } from "./textarea-DbCEjI_e.js";
import { D as Dialog, a as DialogTrigger, P as Plus, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-CSkMKj6D.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C6Z6DS6s.js";
import { B as Badge } from "./badge-BAE1RQy8.js";
import { C as CalendarDays } from "./stethoscope-U1M9GSyd.js";
import { f as format } from "./format-NdAr1oQf.js";
import { o as objectType, s as stringType } from "./types-Bo_1Yrzj.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-VI4E7ysD.js";
import "./users-CK4E6vm0.js";
const schema = objectType({
  patient_id: stringType().uuid(),
  doctor_id: stringType().uuid(),
  scheduled_at: stringType().min(1),
  reason: stringType().trim().max(500).optional().nullable()
});
const STATUS_COLORS = {
  pending: "bg-warning/15 text-warning-foreground border-warning/40",
  approved: "bg-primary/15 text-primary border-primary/30",
  completed: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30"
};
function Appointments() {
  const {
    isStaff,
    user,
    primaryRole
  } = useAuth();
  const [list, setList] = reactExports.useState([]);
  const [patients, setPatients] = reactExports.useState([]);
  const [doctors, setDoctors] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [selectedPatientId, setSelectedPatientId] = reactExports.useState("");
  const [selectedDoctorId, setSelectedDoctorId] = reactExports.useState("");
  const isPatient = primaryRole === "patient";
  const ensureOwnPatientRecord = async () => {
    if (!user || !isPatient) return;
    const {
      data: existing
    } = await supabase.from("patients").select("id").eq("user_id", user.id).maybeSingle();
    if (existing) return;
    const {
      data: profile
    } = await supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle();
    const metadata = user.user_metadata;
    const fullName = profile?.full_name ?? (typeof metadata?.full_name === "string" ? metadata.full_name : "Patient");
    const phone = profile?.phone ?? (typeof metadata?.phone === "string" ? metadata.phone : null);
    const {
      error
    } = await supabase.from("patients").insert([{
      user_id: user.id,
      full_name: fullName,
      phone,
      created_by: user.id
    }]);
    if (error) toast.error(error.message);
  };
  const load = async () => {
    const {
      data,
      error
    } = await supabase.from("appointments").select("id, scheduled_at, status, reason, patients(id,full_name), doctors(id,full_name,specialization)").order("scheduled_at", {
      ascending: false
    });
    if (error) toast.error(error.message);
    else setList(data ?? []);
  };
  reactExports.useEffect(() => {
    (async () => {
      await ensureOwnPatientRecord();
      await load();
    })();
    if (isStaff) {
      supabase.from("patients").select("id, full_name").order("full_name").then(({
        data
      }) => {
        const nextPatients = data ?? [];
        setPatients(nextPatients);
        if (!selectedPatientId && nextPatients.length > 0) setSelectedPatientId(nextPatients[0].id);
      });
    } else if (user) {
      supabase.from("patients").select("id, full_name").eq("user_id", user.id).maybeSingle().then(({
        data,
        error
      }) => {
        if (error) return toast.error(error.message);
        if (data) {
          setPatients([data]);
          setSelectedPatientId(data.id);
        }
      });
    }
    supabase.from("doctors").select("id, full_name, specialization").order("full_name").then(({
      data
    }) => setDoctors(data ?? []));
  }, [isStaff, user, isPatient]);
  reactExports.useEffect(() => {
    if (!selectedDoctorId && doctors.length > 0) setSelectedDoctorId(doctors[0].id);
  }, [doctors, selectedDoctorId]);
  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      patient_id: selectedPatientId || fd.get("patient_id"),
      doctor_id: selectedDoctorId || fd.get("doctor_id"),
      scheduled_at: fd.get("scheduled_at"),
      reason: fd.get("reason") || null
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const {
      error
    } = await supabase.from("appointments").insert([{
      ...parsed.data,
      scheduled_at: new Date(parsed.data.scheduled_at).toISOString(),
      created_by: user?.id
    }]);
    if (error) return toast.error(error.message);
    toast.success("Appointment booked");
    setOpen(false);
    load();
  };
  const updateStatus = async (id, status) => {
    const {
      error
    } = await supabase.from("appointments").update({
      status
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    load();
  };
  const filtered = filterStatus === "all" ? list : list.filter((a) => a.status === filterStatus);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Appointments", description: "Book, approve, and track patient visits.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterStatus, onValueChange: setFilterStatus, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All statuses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pending", children: "Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "approved", children: "Approved" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "completed", children: "Completed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelled", children: "Cancelled" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
          " Book"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New appointment" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "grid gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "hidden", name: "patient_id", value: selectedPatientId }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "hidden", name: "doctor_id", value: selectedDoctorId }),
            !isPatient ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Patient" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedPatientId, onValueChange: setSelectedPatientId, required: true, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select patient" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: patients.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.full_name }, p.id)) })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Patient" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border bg-muted/40 px-3 py-2 text-sm", children: patients[0]?.full_name ?? "Your patient profile will load automatically." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Doctor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedDoctorId, onValueChange: setSelectedDoctorId, required: true, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select doctor" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: doctors.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: d.id, children: [
                  "Dr. ",
                  d.full_name,
                  " — ",
                  d.specialization
                ] }, d.id)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "scheduled_at", children: "Date & time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "scheduled_at", name: "scheduled_at", type: "datetime-local", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reason", children: "Reason" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "reason", name: "reason", rows: 2 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Book" }) })
          ] })
        ] })
      ] })
    ] }) }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "mx-auto mb-3 h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No appointments." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: a.patients?.full_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
            "with Dr. ",
            a.doctors?.full_name,
            " • ",
            a.doctors?.specialization
          ] }),
          a.reason && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm", children: a.reason })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: format(new Date(a.scheduled_at), "PP") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: format(new Date(a.scheduled_at), "p") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `mt-1 capitalize ${STATUS_COLORS[a.status]}`, children: a.status })
        ] })
      ] }),
      isStaff && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2 border-t pt-3", children: [
        a.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => updateStatus(a.id, "approved"), children: "Approve" }),
        (a.status === "approved" || a.status === "pending") && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => updateStatus(a.id, "completed"), children: "Complete" }),
        a.status !== "cancelled" && a.status !== "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => updateStatus(a.id, "cancelled"), children: "Cancel" })
      ] })
    ] }, a.id)) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Appointments, {}) }) });
export {
  SplitComponent as component
};
