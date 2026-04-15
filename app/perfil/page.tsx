import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AppNavbar } from "@/components/app-navbar";
import { createClient } from "@/lib/supabase/server";
import { getDictionary, localeCookieName, normalizeLocale } from "@/lib/i18n";
import { rethrowIfNextControlFlow } from "@/lib/next-errors";
import { updatePassword, updateProfileName } from "@/app/perfil/actions";

type ProfilePageProps = {
  searchParams: Promise<{ kind?: string; message?: string }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const { kind, message } = await searchParams;
  const locale = normalizeLocale((await cookies()).get(localeCookieName)?.value);
  const dictionary = getDictionary(locale);
  let supabase;

  try {
    supabase = await createClient();
  } catch (error) {
    rethrowIfNextControlFlow(error);
    console.error("Failed to create Supabase server client on profile page", error);
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
    console.error("Failed to restore Supabase session on profile page", error);
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

        <main className="dashboard">
          <section className="settings-header">
            <div>
              <p className="card__label">{dictionary.profile.title}</p>
              <h1>{profile?.full_name || dictionary.profile.headingFallback}</h1>
            </div>
            <p>{profile?.email ?? user.email}</p>
          </section>

          {message ? (
            <div className={`feedback-banner ${kind === "error" ? "feedback-banner--error" : ""}`}>
              {message}
            </div>
          ) : null}

          <section className="settings-grid">
            <article className="settings-card card">
              <p className="card__label">{dictionary.profile.accountData}</p>
              <h2>{dictionary.profile.profileName}</h2>
              <form action={updateProfileName} className="transaction-form">
                <label>
                  {dictionary.auth.name}
                  <input
                    type="text"
                    name="full_name"
                    defaultValue={profile?.full_name ?? ""}
                    placeholder={dictionary.auth.yourName}
                    required
                  />
                </label>

                <label>
                  {dictionary.auth.email}
                  <input type="email" value={profile?.email ?? user.email ?? ""} readOnly />
                </label>

                <button type="submit" className="button">
                  {dictionary.profile.saveName}
                </button>
              </form>
            </article>

            <article className="settings-card card">
              <p className="card__label">{dictionary.profile.security}</p>
              <h2>{dictionary.profile.changePassword}</h2>
              <form action={updatePassword} className="transaction-form">
                <label>
                  {dictionary.profile.newPassword}
                  <input
                    type="password"
                    name="password"
                    minLength={6}
                    placeholder={dictionary.profile.newPassword}
                    required
                  />
                </label>

                <label>
                  {dictionary.profile.confirmPassword}
                  <input
                    type="password"
                    name="confirm_password"
                    minLength={6}
                    placeholder={dictionary.profile.repeatPassword}
                    required
                  />
                </label>

                <button type="submit" className="button">
                  {dictionary.profile.updatePassword}
                </button>
              </form>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
