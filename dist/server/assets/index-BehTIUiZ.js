import { U as jsxRuntimeExports } from "./worker-entry-Dw-LtZEf.js";
import { u as useAuth, L as Link } from "./router-vpkZZcx8.js";
import { c as createLucideIcon, A as Activity, B as Button } from "./button-CWz-4Pey.js";
import { S as ShieldCheck, F as FileText } from "./shield-check-CJAsWoDW.js";
import { U as Users } from "./users-B6azN2KL.js";
import { S as Stethoscope } from "./stethoscope-lZg6dM85.js";
import { C as CalendarDays } from "./calendar-days-5j4ZdatP.js";
import { R as Receipt } from "./receipt-DbJAZwFN.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
function Landing() {
  const {
    user
  } = useAuth();
  const features = [{
    icon: Users,
    title: "Patient Management",
    desc: "Complete patient records with medical history at your fingertips."
  }, {
    icon: Stethoscope,
    title: "Doctor Profiles",
    desc: "Specializations, schedules, and availability in one place."
  }, {
    icon: CalendarDays,
    title: "Smart Appointments",
    desc: "Book, approve, and track appointments effortlessly."
  }, {
    icon: FileText,
    title: "Medical Records",
    desc: "Digital prescriptions, diagnoses, and lab reports."
  }, {
    icon: Receipt,
    title: "Billing & Payments",
    desc: "Generate invoices and track payment status."
  }, {
    icon: ShieldCheck,
    title: "Role-Based Access",
    desc: "Admin, doctor, receptionist, and patient — secured by RLS."
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "container mx-auto flex items-center justify-between px-4 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold", children: "Health Care Records" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-6 text-sm md:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/services", className: "text-muted-foreground hover:text-foreground", children: "Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "text-muted-foreground hover:text-foreground", children: "About" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "text-muted-foreground hover:text-foreground", children: "Contact" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: user ? "/dashboard" : "/auth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: user ? "Go to dashboard" : "Sign in" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative overflow-hidden border-b", style: {
      background: "var(--gradient-hero)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-20 md:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl text-center text-primary-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
        " Privacy-first • Role-based access"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold tracking-tight md:text-6xl", children: "The complete healthcare experience, in one calm dashboard." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-primary-foreground/85 md:text-xl", children: "Patients, doctors, appointments, records, and billing — unified with bank-grade security." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: user ? "/dashboard" : "/auth", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", variant: "secondary", className: "gap-2", children: [
          user ? "Go to dashboard" : "Get started",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) }),
        !user && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", className: "border-white/30 bg-white/10 text-white hover:bg-white/20", children: "Staff sign in" }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "container mx-auto px-4 py-16 md:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto mb-12 max-w-2xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight md:text-4xl", children: "Everything your healthcare team needs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "From the front desk to the consultation room — built for real workflows." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group rounded-xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: f.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: f.desc })
      ] }, f.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t bg-muted/40 py-8 text-center text-sm text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Health Care Records. Built with care."
    ] })
  ] });
}
export {
  Landing as component
};
