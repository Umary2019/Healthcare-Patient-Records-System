import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Activity, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Health Care Records" }] }),
  component: AuthPage,
});

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Name too short").max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
  confirmPassword: z.string().min(6, "Min 6 characters").max(72),
  role: z.enum(["patient", "doctor", "receptionist", "lab_officer"]),
  specialization: z.string().trim().min(2).max(120).optional(),
  gender: z.enum(["male", "female"]).optional(),
  age: z.number().int().min(0).max(150).optional(),
  address: z.string().trim().min(2).max(500).optional(),
  phone: z.string().trim().min(7).max(30).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const SAFE_ROLES = new Set(["patient", "doctor", "receptionist", "lab_officer"] as const);

async function ensureBootstrapRecords(userId: string, email: string | undefined, metadata: Record<string, unknown>, selectedRole?: string) {
  const fullName = typeof metadata.full_name === "string" ? metadata.full_name.trim() : "";
  const phone = typeof metadata.phone === "string" ? metadata.phone.trim() : null;
  const specialization = typeof metadata.specialization === "string" && metadata.specialization.trim() ? metadata.specialization.trim() : "General Practice";
  const roleValue = typeof selectedRole === "string" ? selectedRole : (typeof metadata.role === "string" ? metadata.role : "patient");
  const role = SAFE_ROLES.has(roleValue as (typeof SAFE_ROLES extends Set<infer T> ? T : never)) ? roleValue : "patient";

  const { data: profileRows } = await supabase.from("profiles").select("id").eq("id", userId).limit(1);
  const existingProfile = profileRows?.[0] ?? null;
  if (!existingProfile) {
    await supabase.from("profiles").insert({ id: userId, full_name: fullName, phone });
  }

  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", role)
    .limit(1);
  const existingRole = roleRows?.[0] ?? null;
  if (!existingRole) {
    await supabase.from("user_roles").insert({
      user_id: userId,
      role: role as "patient" | "doctor" | "receptionist" | "lab_officer",
    });
  }

  if (role === "patient") {
    const { data: patientRows } = await supabase.from("patients").select("id").eq("user_id", userId).order("created_at", { ascending: true }).limit(1);
    const existingPatient = patientRows?.[0] ?? null;
    if (!existingPatient) {
      await supabase.from("patients").insert({
        user_id: userId,
        full_name: fullName || "Patient",
        phone,
        created_by: userId,
      });
    }
  }

  if (role === "doctor") {
    const { data: doctorRows } = await supabase.from("doctors").select("id").eq("user_id", userId).order("created_at", { ascending: true }).limit(1);
    const existingDoctor = doctorRows?.[0] ?? null;
    if (!existingDoctor) {
      await supabase.from("doctors").insert({
        user_id: userId,
        full_name: fullName || "Doctor",
        specialization,
        phone,
        email: email ?? null,
      });
    }
  }
}

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState<"patient" | "doctor" | "receptionist">("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!loading && user) return <Navigate to="/dashboard" />;

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) {
      if (/email not confirmed/i.test(error.message)) {
        toast.error("Please confirm your email in Supabase before signing in, or disable email confirmation in the Supabase Auth settings.");
        return;
      }

      if (/invalid login credentials/i.test(error.message) || error.status === 400) {
        toast.error("Invalid email or password. If you just registered, confirm your email first if email verification is enabled.");
        return;
      }

      return toast.error(error.message);
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const sessionUser = sessionData.session?.user;
    if (sessionUser) {
      await ensureBootstrapRecords(sessionUser.id, sessionUser.email ?? undefined, sessionUser.user_metadata as Record<string, unknown>, sessionUser.user_metadata?.role);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    sessionStorage.setItem("post_login_welcome", "1");
    navigate({ to: "/dashboard" });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ageValue = fd.get("age");
    const age = typeof ageValue === "string" && ageValue.trim() ? Number(ageValue) : undefined;
    const specialization = fd.get("specialization");
    const gender = fd.get("gender");
    const address = fd.get("address");
    const phone = fd.get("phone");
    const confirmPassword = fd.get("confirmPassword");
    const parsed = signUpSchema.safeParse({
      fullName: fd.get("fullName"),
      email: fd.get("email"),
      password: fd.get("password"),
      confirmPassword,
      role,
      specialization: typeof specialization === "string" && specialization.trim() ? specialization : undefined,
      gender: gender === "male" || gender === "female" ? gender : undefined,
      age,
      address: typeof address === "string" && address.trim() ? address : undefined,
      phone: typeof phone === "string" && phone.trim() ? phone : undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (parsed.data.role === "patient") {
      if (parsed.data.gender !== "male" && parsed.data.gender !== "female") return toast.error("Gender is required for patient accounts.");
      if (typeof parsed.data.age !== "number" || Number.isNaN(parsed.data.age)) return toast.error("Age is required for patient accounts.");
      if (!parsed.data.address) return toast.error("Address is required for patient accounts.");
      if (!parsed.data.phone) return toast.error("Phone number is required for patient accounts.");

      const phoneValue = parsed.data.phone.replace(/\s+/g, "").trim();
      const { data: duplicatePhoneRows, error: duplicatePhoneError } = await supabase
        .from("patients")
        .select("id")
        .eq("phone", phoneValue)
        .limit(1);
      if (duplicatePhoneError) {
        toast.error(duplicatePhoneError.message);
        return;
      }
      if ((duplicatePhoneRows ?? []).length > 0) {
        toast.error("That phone number is already registered. Please use a different phone number.");
        return;
      }
    }
    if (parsed.data.role === "doctor" && !parsed.data.specialization) {
      toast.error("Specialization is required for doctor accounts.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: parsed.data.fullName,
          role: parsed.data.role,
          specialization: parsed.data.specialization,
          age: parsed.data.role === "patient" ? parsed.data.age : undefined,
          gender: parsed.data.role === "patient" ? parsed.data.gender : undefined,
          address: parsed.data.role === "patient" ? parsed.data.address : undefined,
          phone: parsed.data.role === "patient" ? parsed.data.phone : undefined,
        },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);

    if (data.user) {
      await ensureBootstrapRecords(data.user.id, data.user.email ?? undefined, data.user.user_metadata as Record<string, unknown>, parsed.data.role);
    }

    if (!data.session) {
      toast.success(
        `Account created as ${parsed.data.role}. If email confirmation is enabled in Supabase, check your inbox before signing in.`
      );
      return;
    }

    toast.success(`Account created as ${parsed.data.role} — you are signed in.`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-accent/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[var(--shadow-elegant)]">
            <Activity className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Health Care Records</h1>
          <p className="text-sm text-muted-foreground">Healthcare Management System</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-[var(--shadow-card)]">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="si-password">Password</Label>
                  <Input id="si-password" name="password" type="password" required autoComplete="current-password" />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign in
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="su-name">Full name</Label>
                  <Input id="su-name" name="fullName" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="su-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      minLength={6}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-confirm-password">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="su-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      minLength={6}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-role">Register as</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                    <SelectTrigger id="su-role"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="receptionist">Receptionist</SelectItem>
                        <SelectItem value="lab_officer">Lab Officer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {role === "doctor" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="su-specialization">Specialization</Label>
                    <Input id="su-specialization" name="specialization" placeholder="Cardiology, Pediatrics..." required />
                  </div>
                )}
                {role === "patient" && (
                  <div className="grid gap-4 rounded-lg border bg-muted/20 p-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="su-gender">Gender</Label>
                      <Select name="gender" required>
                        <SelectTrigger id="su-gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="su-age">Age</Label>
                      <Input id="su-age" name="age" type="number" min={0} max={150} required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="su-address">Address</Label>
                      <Textarea id="su-address" name="address" rows={3} required />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="su-phone">Phone number</Label>
                      <Input id="su-phone" name="phone" type="tel" required autoComplete="tel" />
                    </div>
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
