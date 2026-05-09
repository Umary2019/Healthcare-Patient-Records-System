import { U as jsxRuntimeExports } from "./worker-entry-Dw-LtZEf.js";
import { L as Link } from "./router-vpkZZcx8.js";
import { A as Activity, B as Button } from "./button-CWz-4Pey.js";
import { U as Users } from "./users-B6azN2KL.js";
import { S as Stethoscope } from "./stethoscope-lZg6dM85.js";
import { C as CalendarDays } from "./calendar-days-5j4ZdatP.js";
import { F as FileText, S as ShieldCheck } from "./shield-check-CJAsWoDW.js";
import { R as Receipt } from "./receipt-DbJAZwFN.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function ServicesPage() {
  const services = [{
    icon: Users,
    title: "Patient Management",
    desc: "Comprehensive records with medical history, demographics and contact details."
  }, {
    icon: Stethoscope,
    title: "Doctor Profiles",
    desc: "Specializations, schedules and availability tracked in one place."
  }, {
    icon: CalendarDays,
    title: "Smart Appointments",
    desc: "Book, approve, complete and cancel — with status tracking end-to-end."
  }, {
    icon: FileText,
    title: "Medical Records",
    desc: "Digital prescriptions, diagnoses, notes and secure lab report uploads."
  }, {
    icon: Receipt,
    title: "Billing & Invoicing",
    desc: "Itemized invoices in ₦ Naira with printable receipts and payment status."
  }, {
    icon: ShieldCheck,
    title: "Role-Based Access",
    desc: "Admin, doctor, receptionist and patient — secured by row-level policies."
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto px-4 py-16 md:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto mb-12 max-w-2xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold tracking-tight md:text-5xl", children: "Our Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "From the front desk to the consultation room — built for real workflows." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: s.desc })
      ] }, s.title)) })
    ] })
  ] });
}
function SiteHeader() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "container mx-auto flex items-center justify-between px-4 py-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: "Health Care Records" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-6 text-sm md:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/services", className: "text-muted-foreground hover:text-foreground", activeProps: {
        className: "text-foreground font-medium"
      }, children: "Services" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "text-muted-foreground hover:text-foreground", children: "About" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "text-muted-foreground hover:text-foreground", children: "Contact" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Sign in" }) })
  ] });
}
export {
  ServicesPage as component
};
