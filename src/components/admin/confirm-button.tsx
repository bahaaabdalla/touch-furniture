"use client";

export function ConfirmButton({ children, message, className = "" }: { children: React.ReactNode; message: string; className?: string }) {
  return <button type="submit" onClick={(event) => { if (!window.confirm(message)) event.preventDefault(); }} className={`rounded-full border border-red-200 px-4 py-2 text-sm text-red-700 transition hover:bg-red-50 ${className}`}>{children}</button>;
}

