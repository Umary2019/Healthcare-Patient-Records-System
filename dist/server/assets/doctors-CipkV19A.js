import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-Dw-LtZEf.js";
import { u as useAuth, s as supabase, t as toast } from "./router-vpkZZcx8.js";
import { P as ProtectedRoute, A as AppShell, a as PageHeader } from "./PageHeader-DzC9JfH7.js";
import { B as Button } from "./button-CWz-4Pey.js";
import { I as Input } from "./input-mZUvqWal.js";
import { L as Label } from "./label-CsOweroK.js";
import { T as Textarea } from "./textarea-3-0L2nmI.js";
import { D as Dialog, a as DialogTrigger, P as Plus, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-CoGYsTGl.js";
import { S as Stethoscope } from "./stethoscope-lZg6dM85.js";
import { T as Trash2 } from "./trash-2-CsN1WGgM.js";
import { o as objectType, s as stringType, l as literalType } from "./types-Bg68Gs7j.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CwplnMT2.js";
import "./shield-check-CJAsWoDW.js";
import "./users-B6azN2KL.js";
const schema = objectType({
  full_name: stringType().trim().min(2).max(120),
  specialization: stringType().trim().min(2).max(120),
  phone: stringType().trim().max(30).optional().nullable(),
  email: stringType().trim().email().max(255).optional().or(literalType("")).nullable(),
  bio: stringType().trim().max(2e3).optional().nullable()
});
function Doctors() {
  const {
    hasRole,
    user,
    primaryRole
  } = useAuth();
  const [list, setList] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const ensureOwnDoctorRecord = async () => {
    if (!user || primaryRole !== "doctor") return;
    const {
      data: existing
    } = await supabase.from("doctors").select("id").eq("user_id", user.id).maybeSingle();
    if (existing) return;
    const {
      data: profile
    } = await supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle();
    const metadata = user.user_metadata;
    const fullName = profile?.full_name ?? (typeof metadata?.full_name === "string" ? metadata.full_name : "Doctor");
    const specialization = typeof metadata?.specialization === "string" && metadata.specialization.trim() ? metadata.specialization : "General Practice";
    const phone = profile?.phone ?? (typeof metadata?.phone === "string" ? metadata.phone : null);
    const {
      error
    } = await supabase.from("doctors").insert([{
      user_id: user.id,
      full_name: fullName,
      specialization,
      phone,
      email: user.email
    }]);
    if (error) toast.error(error.message);
  };
  const load = async () => {
    const {
      data,
      error
    } = await supabase.from("doctors").select("*").order("created_at", {
      ascending: false
    });
    if (error) toast.error(error.message);
    else setList(data ?? []);
  };
  reactExports.useEffect(() => {
    (async () => {
      await ensureOwnDoctorRecord();
      await load();
    })();
  }, [user?.id, primaryRole]);
  const onSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      full_name: fd.get("full_name"),
      specialization: fd.get("specialization"),
      phone: fd.get("phone") || null,
      email: fd.get("email") || null,
      bio: fd.get("bio") || null
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const {
      error
    } = await supabase.from("doctors").insert([parsed.data]);
    if (error) return toast.error(error.message);
    toast.success("Doctor added");
    setOpen(false);
    load();
  };
  const onDelete = async (id) => {
    if (!confirm("Delete this doctor?")) return;
    const {
      error
    } = await supabase.from("doctors").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Doctors", description: "Specialists and their contact details.", actions: hasRole("admin") && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
        " Add doctor"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New doctor" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "grid gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "full_name", children: "Full name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "full_name", name: "full_name", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "specialization", children: "Specialization" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "specialization", name: "specialization", required: true, placeholder: "Cardiology, Pediatrics..." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", name: "phone" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", name: "email", type: "email" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bio", children: "Bio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "bio", name: "bio", rows: 3 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Create" }) })
        ] })
      ] })
    ] }) }),
    list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border bg-card p-12 text-center text-muted-foreground", children: "No doctors yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: list.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elegant)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
            "Dr. ",
            d.full_name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-primary", children: d.specialization })
        ] }),
        hasRole("admin") && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => onDelete(d.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
      ] }),
      (d.phone || d.email) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-1 text-xs text-muted-foreground", children: [
        d.email && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: d.email }),
        d.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: d.phone })
      ] }),
      d.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground line-clamp-3", children: d.bio })
    ] }, d.id)) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Doctors, {}) }) });
export {
  SplitComponent as component
};
