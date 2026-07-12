import { notFound } from "next/navigation";
import { isDemoMode } from "@/lib/catalog/mode";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  if (isDemoMode()) notFound();
  return <div className="min-h-screen bg-[#f3efe8] text-ink">{children}</div>;
}

