import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/app-navbar";
import { SettingsView } from "@/components/settings-view";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="app-shell">
      <div className="page-shell">
        <AppNavbar
          userName={profile?.full_name ?? null}
          userEmail={profile?.email ?? user.email ?? null}
        />
        <SettingsView />
      </div>
    </div>
  );
}
