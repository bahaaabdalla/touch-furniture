import { ErrorBanner } from "@/components/admin/error-banner";
import { RoomForm } from "@/components/admin/room-form";
import { requireAdmin } from "@/lib/supabase/auth";
export default async function NewRoomPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const [{ supabase }, query] = await Promise.all([requireAdmin(), searchParams]); const { data } = await supabase.from("collections").select("id, name_ar").order("sort_order"); return <div className="mx-auto max-w-4xl"><h1 className="text-4xl">غرفة جديدة</h1><div className="mt-7"><ErrorBanner message={query.error} /></div><div className="mt-6 rounded-2xl bg-white p-6 soft-shadow sm:p-8"><RoomForm collections={data ?? []} /></div></div>; }

