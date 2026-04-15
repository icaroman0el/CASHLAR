import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/app-navbar";
import { SettingsView } from "@/components/settings-view";
import { rethrowIfNextControlFlow } from "@/lib/next-errors";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  let supabase;

  try {
    supabase = await createClient();
  } catch (error) {
    rethrowIfNextControlFlow(error);
    console.error("Failed to create Supabase server client on settings page", error);
    redirect("/login");
  }

  let user = null;

  try {
    const {
      data: { user: authenticatedUser },
    } = await supabase.auth.getUser();

    user = authenticatedUser;
  } catch (error) {
    rethrowIfNextControlFlow(error);
    console.error("Failed to restore Supabase session on settings page", error);
  }

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
