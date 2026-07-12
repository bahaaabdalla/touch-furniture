import { stockState } from "@/lib/catalog/format";

export function StockStatus({ stock, compact = false }: { stock: number; compact?: boolean }) {
  const state = stockState(stock);
  const styles = state === "low" ? "text-red-700" : state === "out" ? "text-stone-500" : "text-emerald-700";
  const label = state === "out" ? "غير متاح / نفذت الكمية" : state === "low" ? `متبقي ${stock} فقط` : `متاح — ${stock} قطع`;
  return (
    <span className={`inline-flex items-center gap-2 ${styles} ${compact ? "text-xs" : "text-sm font-medium"}`}>
      <span className="stock-dot h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}

