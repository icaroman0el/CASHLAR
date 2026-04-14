"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { localeCookieName, normalizeLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}&kind=error`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const locale = normalizeLocale((await cookies()).get(localeCookieName)?.value);

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/confirm`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(`/cadastro?message=${encodeURIComponent(error.message)}&kind=error`);
  }

  const successMessage = locale === "en"
    ? "Check your email to confirm your account."
    : "Confira seu e-mail para confirmar a conta.";

  redirect(`/login?message=${encodeURIComponent(successMessage)}&kind=success`);
}
