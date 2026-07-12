import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, stockState } from "@/lib/catalog/format";

describe("catalog utilities", () => {
  it.each([[0, "out"], [1, "low"], [4, "low"], [5, "available"], [12, "available"]] as const)("maps stock %s to %s", (stock, expected) => {
    expect(stockState(stock)).toBe(expected);
  });

  it("builds a WhatsApp link with the exact room URL", () => {
    const result = buildWhatsAppUrl("+20 114-508-5454", "https://example.com/rooms/linen");
    expect(result).toContain("https://wa.me/201145085454?text=");
    expect(decodeURIComponent(result)).toContain("https://example.com/rooms/linen");
  });
});

