import { requireAdmin } from "@/lib/supabase/auth";

type Row = { phone: string; room_name: string | null; created_at: string };

function toInternational(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("20")) return digits;
  if (digits.startsWith("0")) return "20" + digits.slice(1);
  return digits;
}

export default async function LeadsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("interests")
    .select("phone, room_name, created_at")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  const groups = new Map<string, { rooms: string[]; last: string }>();
  for (const row of rows) {
    const group = groups.get(row.phone) ?? { rooms: [], last: row.created_at };
    if (row.room_name && !group.rooms.includes(row.room_name)) group.rooms.push(row.room_name);
    groups.set(row.phone, group);
  }
  const leads = [...groups.entries()];

  return (
    <div>
      <div>
        <p className="text-sm text-gold">التسويق</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">العملاء المهتمون</h1>
        <p className="mt-2 text-sm text-muted">كل رقم سجّل اهتمامه من صفحة المفضلة، والغرف اللي عجبته — استهدفهم بعروضك.</p>
      </div>

      {leads.length === 0 ? (
        <p className="mt-8 rounded-2xl border hairline bg-white p-8 text-center text-muted">
          لسه مفيش أي اهتمامات مسجّلة.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {leads.map(([phone, info]) => (
            <div key={phone} className="rounded-2xl bg-white p-5 soft-shadow">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-bold" dir="ltr">{phone}</p>
                <div className="flex items-center gap-2">
                  <a href={`tel:+${toInternational(phone)}`} className="rounded-full border hairline px-4 py-1.5 text-sm">اتصال</a>
                  <a href={`https://wa.me/${toInternational(phone)}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#1f6e4a] px-4 py-1.5 text-sm text-white">واتساب</a>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {info.rooms.map((room) => (
                  <span key={room} className="rounded-full bg-stone-100 px-3 py-1 text-sm">{room}</span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">آخر اهتمام: {new Date(info.last).toLocaleString("ar-EG")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
