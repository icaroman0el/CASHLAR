"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { localeCookieName, normalizeLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export async function updateProfileName(formData: FormData) {
  const supabase = await createClient();
  const locale = normalizeLocale((await cookies()).get(localeCookieName)?.value);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const invalidNameMessage = locale === "en" ? "Please enter a valid name." : "Informe um nome válido.";
  const updateNameError = locale === "en"
    ? "Could not update the name."
    : "Não foi possível atualizar o nome.";
  const updateNameSuccess = locale === "en"
    ? "Name updated successfully."
    : "Nome atualizado com sucesso.";

  if (!fullName) {
    redirect(`/perfil?message=${encodeURIComponent(invalidNameMessage)}&kind=error`);
  }

  const [{ error: authError }, { error: profileError }] = await Promise.all([
    supabase.auth.updateUser({
      data: {
        full_name: fullName,
      },
    }),
    supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id),
  ]);

  if (authError || profileError) {
    redirect(`/perfil?message=${encodeURIComponent(authError?.message ?? profileError?.message ?? updateNameError)}&kind=error`);
  }

  revalidatePath("/");
  revalidatePath("/perfil");
  redirect(`/perfil?message=${encodeURIComponent(updateNameSuccess)}&kind=success`);
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const locale = normalizeLocale((await cookies()).get(localeCookieName)?.value);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");
  const passwordLengthMessage = locale === "en"
    ? "The new password must have at least 6 characters."
    : "A nova senha precisa ter ao menos 6 caracteres.";
  const passwordMatchMessage = locale === "en"
    ? "The passwords do not match."
    : "As senhas não conferem.";
  const passwordSuccessMessage = locale === "en"
    ? "Password updated successfully."
    : "Senha atualizada com sucesso.";

  if (password.length < 6) {
    redirect(`/perfil?message=${encodeURIComponent(passwordLengthMessage)}&kind=error`);
  }

  if (password !== confirmPassword) {
    redirect(`/perfil?message=${encodeURIComponent(passwordMatchMessage)}&kind=error`);
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirect(`/perfil?message=${encodeURIComponent(error.message)}&kind=error`);
  }

  redirect(`/perfil?message=${encodeURIComponent(passwordSuccessMessage)}&kind=success`);
}
