function requireUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!value) {
    throw new Error(
      "Missing required Supabase environment variable: NEXT_PUBLIC_SUPABASE_URL. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your local .env.local and in Vercel Project Settings > Environment Variables.",
    );
  }

  return value;
}

function requirePublicKey() {
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (publishableKey) {
    return publishableKey;
  }

  if (anonKey) {
    return anonKey;
  }

  throw new Error(
    "Missing required Supabase public key. Configure NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) together with NEXT_PUBLIC_SUPABASE_URL in your local .env.local and in Vercel Project Settings > Environment Variables.",
  );
}

export function getSupabaseConfig() {
  return {
    url: requireUrl(),
    publishableKey: requirePublicKey(),
  };
}
