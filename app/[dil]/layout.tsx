import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { DILLER, DIL_YONU, gecerliDil } from "@/data/menu";
import "../globals.css";

/**
 * Kök layout.
 *
 * `<html>` bu dosyada basılıyor ve `lang` / `dir` URL'nin ilk parçasından
 * geliyor. Bu yüzden uygulamanın TAMAMI `[dil]` altında: kök layout'un route
 * parametresini okuyabilmesinin tek yolu bu. Sonuç olarak Arapça sayfalar
 * daha ilk baytta `dir="rtl"` ile geliyor — sayfa önce soldan sağa çizilip
 * sonra aynalanmıyor.
 *
 * `/` adresi next.config.ts içinde `/tr`'ye yönlendiriliyor.
 */
const marcellus = localFont({
  src: "../fonts/Marcellus-Regular.woff2",
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

export function generateStaticParams() {
  return DILLER.map((dil) => ({ dil }));
}

export default async function KokLayout({
  children,
  params,
}: LayoutProps<"/[dil]">) {
  const { dil } = await params;
  if (!gecerliDil(dil)) notFound();

  return (
    <html lang={dil} dir={DIL_YONU[dil]} className={marcellus.variable}>
      <body className="min-h-dvh bg-cream-50 bg-gradient-to-b from-cream-50 to-cream-100 font-body text-cocoa-900 antialiased">
        {children}
      </body>
    </html>
  );
}
