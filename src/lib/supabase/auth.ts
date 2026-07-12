import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/catalog/mode";
import { createServerSupabaseClient } from "./server";

export async function requireAdmin() {
  if (isDemoMode()) redirect("/");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims || claims.app_metadata?.role !== "admin") redirect("/admin/login");
  return { supabase, claims };
}
