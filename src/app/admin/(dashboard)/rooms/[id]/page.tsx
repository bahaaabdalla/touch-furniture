import { notFound } from "next/navigation";
import { ErrorBanner } from "@/components/admin/error-banner";
import { RoomForm } from "@/components/admin/room-form";
import { requireAdmin } from "@/lib/supabase/auth";
export default async function EditRoomPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) { const [{ id }, query, { supabase }] = await Promise.all([params, searchParams, requireAdmin()]); const [room, collections] = await Promise.all([supabase.from("rooms").select("*").eq("id", id).maybeSingle(), supabase.from("collections").select("id, name_ar").order("sort_order")]); if (!room.data) notFound(); return <div className="mx-auto max-w-4xl"><h1 className="text-4xl">تعديل الغرفة</h1><div className="mt-7"><ErrorBanner message={query.error} /></div><div className="mt-6 rounded-2xl bg-white p-6 soft-shadow sm:p-8"><RoomForm collections={collections.data ?? []} value={room.data} /></div></div>; }

