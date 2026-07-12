export function formatPrice(price: number, currency: string) {
  return `${new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price)} ${currency}`;
}

export function buildWhatsAppUrl(number: string, roomUrl: string) {
  const digits = number.replace(/\D/g, "");
  const message = `مرحباً، مهتم بهذه الغرفة: ${roomUrl}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function stockState(stock: number) {
  if (stock <= 0) return "out" as const;
  if (stock < 5) return "low" as const;
  return "available" as const;
}

export function publicStoragePath(url: string) {
  const marker = "/storage/v1/object/public/catalog-images/";
  const index = url.indexOf(marker);
  return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length));
}

