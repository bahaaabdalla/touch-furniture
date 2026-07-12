export function isDemoMode() {
  return (process.env.CATALOG_MODE ?? "demo") === "demo";
}

export function requireSupabaseEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are required in supabase mode.");
  }

  return { url, key };
}

