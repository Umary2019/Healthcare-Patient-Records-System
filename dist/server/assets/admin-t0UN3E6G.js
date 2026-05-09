import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-CYQJekC1.js";
import { u as useAuth, s as supabase, t as toast } from "./router-CTu-sRtw.js";
import { P as ProtectedRoute, A as AppShell, a as PageHeader } from "./PageHeader-D2XCUBu7.js";
import { I as Input } from "./input-FUnIe9ab.js";
import { B as Badge } from "./badge-BAE1RQy8.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C6Z6DS6s.js";
import { S as Search } from "./search-CAMX_dYD.js";
import { L as LoaderCircle } from "./index-VI4E7ysD.js";
import { a as ShieldCheck } from "./stethoscope-U1M9GSyd.js";
import { f as format } from "./format-NdAr1oQf.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./button-DOu4fBLP.js";
import "./users-CK4E6vm0.js";
const ROLES = ["admin", "doctor", "receptionist", "patient"];
function Admin() {
  const {
    user: me
  } = useAuth();
  const [rows, setRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [q, setQ] = reactExports.useState("");
  const [busyId, setBusyId] = reactExports.useState(null);
  const syncMissingRoleRecords = async (profiles, roles) => {
    const roleMap = /* @__PURE__ */ new Map();
    roles.forEach((r) => roleMap.set(r.user_id, r.role));
    const [{
      data: existingPatients
    }, {
      data: existingDoctors
    }] = await Promise.all([supabase.from("patients").select("user_id"), supabase.from("doctors").select("user_id")]);
    const patientIds = new Set((existingPatients ?? []).map((row) => row.user_id).filter((id) => Boolean(id)));
    const doctorIds = new Set((existingDoctors ?? []).map((row) => row.user_id).filter((id) => Boolean(id)));
    const missingPatients = profiles.filter((profile) => roleMap.get(profile.id) === "patient" && !patientIds.has(profile.id)).map((profile) => ({
      user_id: profile.id,
      full_name: profile.full_name ?? "Unnamed user",
      phone: null,
      created_by: profile.id
    }));
    const missingDoctors = profiles.filter((profile) => roleMap.get(profile.id) === "doctor" && !doctorIds.has(profile.id)).map((profile) => ({
      user_id: profile.id,
      full_name: profile.full_name ?? "Unnamed user",
      specialization: "General Practice",
      phone: null,
      email: null
    }));
    if (missingPatients.length > 0) {
      const {
        error
      } = await supabase.from("patients").insert(missingPatients);
      if (error) toast.error(error.message);
    }
    if (missingDoctors.length > 0) {
      const {
        error
      } = await supabase.from("doctors").insert(missingDoctors);
      if (error) toast.error(error.message);
    }
  };
  const load = async () => {
    setLoading(true);
    const [{
      data: profiles,
      error: pErr
    }, {
      data: roles,
      error: rErr
    }] = await Promise.all([supabase.from("profiles").select("id, full_name, created_at").order("created_at", {
      ascending: false
    }), supabase.from("user_roles").select("user_id, role")]);
    if (pErr) toast.error(pErr.message);
    if (rErr) toast.error(rErr.message);
    const map = /* @__PURE__ */ new Map();
    (roles ?? []).forEach((r) => map.set(r.user_id, r.role));
    setRows((profiles ?? []).map((p) => ({
      ...p,
      role: map.get(p.id) ?? null
    })));
    if (profiles && roles) {
      await syncMissingRoleRecords(profiles, roles);
    }
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const changeRole = async (userId, next) => {
    if (userId === me?.id && next !== "admin") {
      const ok = confirm("You're about to remove your own admin access. Continue?");
      if (!ok) return;
    }
    setBusyId(userId);
    const del = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (del.error) {
      setBusyId(null);
      return toast.error(del.error.message);
    }
    const ins = await supabase.from("user_roles").insert([{
      user_id: userId,
      role: next
    }]);
    setBusyId(null);
    if (ins.error) return toast.error(ins.error.message);
    if (next === "patient") {
      const profile = rows.find((row) => row.id === userId);
      const {
        data: existing
      } = await supabase.from("patients").select("id").eq("user_id", userId).maybeSingle();
      if (!existing) {
        const insertPatient = await supabase.from("patients").insert([{
          user_id: userId,
          full_name: profile?.full_name ?? "Unnamed user",
          phone: null,
          created_by: userId
        }]);
        if (insertPatient.error) toast.error(insertPatient.error.message);
      }
    }
    if (next === "doctor") {
      const profile = rows.find((row) => row.id === userId);
      const {
        data: existing
      } = await supabase.from("doctors").select("id").eq("user_id", userId).maybeSingle();
      if (!existing) {
        const insertDoctor = await supabase.from("doctors").insert([{
          user_id: userId,
          full_name: profile?.full_name ?? "Unnamed user",
          specialization: "General Practice",
          phone: null,
          email: null
        }]);
        if (insertDoctor.error) toast.error(insertDoctor.error.message);
      }
    }
    toast.success(`Role updated to ${next}`);
    load();
  };
  const filtered = rows.filter((r) => !q || (r.full_name ?? "").toLowerCase().includes(q.toLowerCase()) || r.id.includes(q));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "User administration", description: "Promote or demote users. Changes apply immediately and are restricted to admins by row-level security." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search name or user id…", className: "pl-9" })
    ] }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center rounded-xl border bg-card p-12 text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
      " Loading users…"
    ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "mx-auto mb-3 h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No users found." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filtered.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: u.full_name || "Unnamed user" }),
          u.id === me?.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "You" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-mono text-xs text-muted-foreground", children: u.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "Joined ",
          format(new Date(u.created_at), "PP")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: u.role === "admin" ? "border-primary/40 bg-primary/10 text-primary capitalize" : "capitalize", children: u.role ?? "none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: u.role ?? void 0, onValueChange: (v) => changeRole(u.id, v), disabled: busyId === u.id, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Assign role" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, className: "capitalize", children: r }, r)) })
        ] })
      ] })
    ] }, u.id)) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { roles: ["admin"], children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Admin, {}) }) });
export {
  SplitComponent as component
};
