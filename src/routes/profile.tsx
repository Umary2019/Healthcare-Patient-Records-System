import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My profile — Health Care Records" }] }),
  component: () => (
    <ProtectedRoute>
      <AppShell><Profile /></AppShell>
    </ProtectedRoute>
  ),
});

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      setProfile(data ?? null);
      setLoading(false);
    })();
  }, [user?.id]);

  const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updates = {
      full_name: fd.get("full_name") as string,
      address: fd.get("address") as string,
      phone: fd.get("phone") as string,
    };
    const { error } = await supabase.from("profiles").update(updates).eq("id", user?.id);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    const { data } = await supabase.from("profiles").select("*").eq("id", user?.id).maybeSingle();
    setProfile(data ?? null);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <>
      <PageHeader title="My profile" description="View and edit your profile details." />
      <div className="rounded-xl border bg-card p-6 shadow-[var(--shadow-card)] max-w-2xl">
        <form onSubmit={onSave} className="grid gap-4">
          <div className="grid gap-1.5"><Label>Full name</Label><Input name="full_name" defaultValue={profile?.full_name ?? ""} required /></div>
          <div className="grid gap-1.5"><Label>Phone</Label><Input name="phone" defaultValue={profile?.phone ?? ""} /></div>
          <div className="grid gap-1.5"><Label>Address</Label><Textarea name="address" rows={3} defaultValue={profile?.address ?? ""} /></div>
          <div className="pt-2"><Button type="submit">Save</Button></div>
        </form>
      </div>
    </>
  );
}
