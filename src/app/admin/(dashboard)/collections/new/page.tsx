import { CollectionForm } from "@/components/admin/collection-form";
import { ErrorBanner } from "@/components/admin/error-banner";
export default async function NewCollectionPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const { error } = await searchParams; return <div className="mx-auto max-w-3xl"><h1 className="text-4xl">مجموعة جديدة</h1><div className="mt-7"><ErrorBanner message={error} /></div><div className="mt-6 rounded-2xl bg-white p-6 soft-shadow sm:p-8"><CollectionForm /></div></div>; }

