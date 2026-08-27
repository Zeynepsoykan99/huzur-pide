import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Marcellus, Google Fonts CDN'inden degil repodan servis ediliyor.
 * Tek dosya latin + latin-ext karakter kumesinin tamamini tasiyor (17,9 KB),
 * yani Turkce harfler (ş ğ İ ı) icin ikinci bir istek gerekmiyor.
 *
 * Marcellus'ta kiril ve arap alfabesi yok; o dillerde tarayici asagidaki
 * yedek zincire (Georgia -> serif) duser. Govde metni zaten sistem
 * fontlarinda oldugu icin dil ekranindaki "Русский" ve "العربية"
 * etiketleri bundan etkilenmiyor.
 */
const marcellus = localFont({
  src: "./fonts/Marcellus-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-marcellus",
  fallback: ["Georgia", "Cambria", "serif"],
});

export const metadata: Metadata = {
  title: "Huzur Pide",
  description: "Huzur Pide dijital menü",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#F5EFE6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // lang/dir kokte duruyor. Asama 3'te dil mantigi baglandiginda degisecek
  // tek yer burasi olacak; duzen kendiliginden aynalanir.
  return (
    <html lang="tr" dir="ltr" className={marcellus.variable}>
      <body className="min-h-dvh bg-cream-50 bg-gradient-to-b from-cream-50 to-cream-100 font-body text-cocoa-900 antialiased">
        {children}
      </body>
    </html>
  );
}
