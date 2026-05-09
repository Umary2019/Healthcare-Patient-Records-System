import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  FileText,
  Receipt,
  ShieldCheck,
  LogOut,
  Activity,
  Menu,
} from "lucide-react";
import { useAuth, type AppRole } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: AppRole[];
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "doctor", "receptionist", "lab_officer", "patient"] },
  { to: "/admin", label: "Admin", icon: ShieldCheck, roles: ["admin"] },
  { to: "/patients", label: "Patients", icon: Users, roles: ["doctor", "receptionist", "lab_officer", "admin"] },
  { to: "/records", label: "Medical Records", icon: FileText, roles: ["doctor", "patient"] },
  { to: "/lab-results", label: "Lab Results", icon: Activity, roles: ["doctor", "lab_officer"] },
  { to: "/profile", label: "My Profile", icon: Activity, roles: ["admin", "doctor", "receptionist", "patient", "lab_officer"] },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { roles, primaryRole, user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const items = NAV.filter((i) => i.roles.some((r) => roles.includes(r)));

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <div className="font-bold leading-tight">CareRecords</div>
          <div className="text-xs text-muted-foreground">Healthcare Management</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const active = location.pathname === item.to || location.pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 truncate text-xs">
          <div className="font-medium">{user?.email}</div>
          <div className="capitalize text-muted-foreground">{primaryRole}</div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={async () => {
            await signOut();
            navigate({ to: "/auth" });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border md:block">
        <SidebarContent />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b bg-card px-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="font-semibold">CareRecords</div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
