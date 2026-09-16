import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { temaFontlari } from "@/app/temalar/aktif";
import { LEZZETLER_METNI } from "@/data/karsilama";
import { DILLER, DIL_YONU, MEKAN_ADI, gecerliDil, metin } from "@/data/menu";
import { aktifRenkler, aktifTema } from "@/data/menuKaynak";
import { SITE_ADRESI } from "@/data/site";
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
 * Yazı tipleri: üç tema modülü de derlemeye giriyor ama `<html>` üzerine
 * yalnızca aktif temanın değişkenleri konuyor, bu yüzden yalnızca onun
 * dosyaları iniyor.
 *
 * RENKLER de panelden geliyor ama tema sınıfının yerine geçmiyor: yalnızca
 * iki değişken (`--t-vurgu`, `--t-fiyat`) satır içi stille eziliyor, geri
 * kalan her şey temadan. Satır içi stil sınıf kuralını yendiği için ayrı
 * bir CSS sınıfı ya da tema kopyası gerekmiyor. Seçim yoksa temanın
 * varsayılan renkleri yazılıyor — `temalar.css`teki değerlerin aynısı.
 *
 * Renkler yalnızca `data/renkler.ts` paletinden gelebiliyor; o paletin
 * tamamı `betikler/renk-kontrast.ts` ile ölçülü, yani buradan sayfaya
 * kontrastı AA'nın altında bir renk geçemiyor.
 *
 * `/` adresi next.config.ts içinde `/tr`'ye yönlendiriliyor.
 */

/**
 * Varsayılan etiketler. Sayfalar kendi başlığını, canonical adresini ve
 * paylaşım etiketlerini `sayfaEtiketleri()` ile ekliyor; burada kalanlar
 * her sayfada ortak olanlar.
 *
 * `metadataBase`: canonical, hreflang ve Open Graph adresleri sayfalarda
 * GÖRELİ yazılıyor, tam adrese burada tamamlanıyor (bkz. `data/site.ts`).
 *
 * Açıklama dile göre: önceden dört dilde de Türkçe "Huzur Pide dijital
 * menü" yazıyordu. Onaylı Lezzetler metni kullanılıyor, yeni metin yok.
 */
export async function generateMetadata({ params }: LayoutProps<"/[dil]">): Promise<Metadata> {
  const { dil } = await params;
  return {
    metadataBase: new URL(SITE_ADRESI),
    title: MEKAN_ADI,
    description: gecerliDil(dil) ? metin(LEZZETLER_METNI, dil) : undefined,
    icons: { icon: "/favicon.svg" },
  };
}

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

  const [tema, renkler] = await Promise.all([aktifTema(), aktifRenkler()]);

  return (
    <html
      lang={dil}
      dir={DIL_YONU[dil]}
      className={`tema-${tema} ${temaFontlari(tema)}`}
      style={
        {
          "--t-vurgu": renkler.vurgu,
          "--t-fiyat": renkler.fiyat,
        } as React.CSSProperties
      }
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
