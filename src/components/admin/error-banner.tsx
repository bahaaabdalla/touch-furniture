export function ErrorBanner({ message }: { message?: string }) {
  return message ? <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">{message}</p> : null;
}

