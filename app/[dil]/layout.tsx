import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { temaFontlari } from "@/app/temalar/aktif";
import { DILLER, DIL_YONU, gecerliDil } from "@/data/menu";
import { aktifTema } from "@/data/menuKaynak";
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
 * TEMA da burada: `<html>` üzerindeki `tema-*` sınıfı bütün --t-* renk ve
 * yazı tipi değişkenlerini belirliyor. Ekranların hiçbiri temayı bilmiyor.
 *
 * Hangi temanın geçerli olduğu Firestore'dan (`ayarlar/genel.tema`) okunuyor —
 * panelden değiştirilebilsin diye. Okuma müşteri isteğinde değil, sayfa
 * üretilirken oluyor; tema değişince panel `revalidatePath` ile bütün
 * ekranları yeniden ürettiriyor.
 *
 * Yazı tipleri: dört tema modülü de derlemeye giriyor ama `<html>` üzerine
 * yalnızca aktif temanın değişkenleri konuyor, bu yüzden yalnızca onun
 * dosyaları iniyor.
 *
 * `/` adresi next.config.ts içinde `/tr`'ye yönlendiriliyor.
 */

export const metadata: Metadata = {
  title: "Huzur Pide",
  description: "Huzur Pide dijital menü",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  /* Adres çubuğunun rengi de temadan: Çini Levha'nın porselen zemini. */
  themeColor: "#F6F2E9",
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

  const tema = await aktifTema();

  return (
    <html
      lang={dil}
      dir={DIL_YONU[dil]}
      className={`tema-${tema} ${temaFontlari(tema)}`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
