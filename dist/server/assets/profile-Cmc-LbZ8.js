import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-Dw-LtZEf.js";
import { u as useAuth, s as supabase, t as toast } from "./router-vpkZZcx8.js";
import { P as ProtectedRoute, A as AppShell, a as PageHeader } from "./PageHeader-DzC9JfH7.js";
import { B as Button } from "./button-CWz-4Pey.js";
import { I as Input } from "./input-mZUvqWal.js";
import { L as Label } from "./label-CsOweroK.js";
import { T as Textarea } from "./textarea-3-0L2nmI.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CwplnMT2.js";
import "./shield-check-CJAsWoDW.js";
import "./users-B6azN2KL.js";
function Profile() {
  const {
    user
  } = useAuth();
  const [profile, setProfile] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!user) return;
    (async () => {
      const {
        data
      } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      setProfile(data ?? null);
      setLoading(false);
    })();
  }, [user?.id]);
  const onSave = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updates = {
      full_name: fd.get("full_name"),
      address: fd.get("address"),
      phone: fd.get("phone")
    };
    const {
      error
    } = await supabase.from("profiles").update(updates).eq("id", user?.id);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    const {
      data
    } = await supabase.from("profiles").select("*").eq("id", user?.id).maybeSingle();
    setProfile(data ?? null);
  };
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center", children: "Loading..." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "My profile", description: "View and edit your profile details." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border bg-card p-6 shadow-[var(--shadow-card)] max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onSave, className: "grid gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Full name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "full_name", defaultValue: profile?.full_name ?? "", required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "phone", defaultValue: profile?.phone ?? "" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { name: "address", rows: 3, defaultValue: profile?.address ?? "" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Save" }) })
    ] }) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Profile, {}) }) });
export {
  SplitComponent as component
};
