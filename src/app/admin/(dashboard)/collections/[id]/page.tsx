import { notFound } from "next/navigation";
import { CollectionForm } from "@/components/admin/collection-form";
import { ErrorBanner } from "@/components/admin/error-banner";
import { requireAdmin } from "@/lib/supabase/auth";
export default async function EditCollectionPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) { const [{ id }, query, { supabase }] = await Promise.all([params, searchParams, requireAdmin()]); const { data } = await supabase.from("collections").select("*").eq("id", id).maybeSingle(); if (!data) notFound(); return <div className="mx-auto max-w-3xl"><h1 className="text-4xl">تعديل المجموعة</h1><div className="mt-7"><ErrorBanner message={query.error} /></div><div className="mt-6 rounded-2xl bg-white p-6 soft-shadow sm:p-8"><CollectionForm value={data} /></div></div>; }

