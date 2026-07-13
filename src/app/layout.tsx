import type { Metadata } from "next";
import { Cormorant_Garamond, Tajawal, Reem_Kufi, Amiri } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Distinctive geometric Kufi for section headings / brand mark
const reemKufi = Reem_Kufi({
  variable: "--font-reem",
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Classical Naskh with full tashkeel support for the voweled brand name
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: { default: "تاتش فرنتشر | Touch Furniture", template: "%s | Touch Furniture" },
  description: "كتالوج تاتش فرنتشر — غرف نوم، صالونات، سفرة، انتريهات وركنات بتفاصيل مختارة.",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "Touch Furniture",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cormorant.variable} ${reemKufi.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}

