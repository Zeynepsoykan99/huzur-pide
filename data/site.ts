import type { Metadata } from "next";
import { SITE_ADRESI } from "./adres";
import { GORSEL_ALT, LEZZETLER_METNI } from "./karsilama";
import { DILLER, MEKAN_ADI, metin, type DilKodu } from "./menu";

/**
 * Arama motoru ve paylaşım etiketleri.
 *
 * ADRES TEK YERDE: `data/adres.ts`. canonical, hreflang, Open Graph,
 * robots.txt ve sitemap.xml hepsi oradan besleniyor; eski adres bir yerde
 * kopya kalıp arama motoruna yanlış adres söylemiyor. Aşama 42'de
 * `huzur-pide.vercel.app` → `www.huzurpidedikbiyik.com` oldu.
 */
export { SITE_ADRESI };

/**
 * Paylaşım önizlemesi görseli — hero fotoğrafının JPEG kopyası.
 *
 * Sayfadaki hero `mekan/dukkan.webp`; önizleme için ayrı bir JPEG var çünkü
 * WhatsApp webp önizlemelerde güvenilir değil. Aynı kaynaktan (1080×1080),
 * KIRPILMADAN üretildi: kare olduğu için WhatsApp küçük önizleme gösteriyor.
 * Geniş önizleme (1200×630) kırpma gerektirirdi, bilerek seçilmedi.
 */
const PAYLASIM_GORSELI = { url: "/og/huzur-pide.jpg", width: 1080, height: 1080 };

/** Open Graph dil kodları (`dil_BÖLGE`). */
const OG_DIL: Record<DilKodu, string> = {
  tr: "tr_TR",
  en: "en_US",
  ar: "ar_AR",
  ru: "ru_RU",
};

/**
 * Bir sayfanın canonical + hreflang + Open Graph etiketleri.
 *
 * `yol` DİL ÖNEKİ OLMADAN verilir ("" karşılama, "/menu", "/menu/izgara");
 * dört dilin adresi aynı yoldan türetiliyor. `x-default` Türkçe sayfa — QR
 * kökü de oraya bakıyor.
 *
 * TEK YARDIMCI, çünkü Next bir sayfanın `openGraph`'ını layout'unkiyle
 * BİRLEŞTİRMİYOR, tamamen değiştiriyor: her sayfa kendi başlığını verirken
 * görseli, site adını ve dili de yeniden vermek zorunda. Üç rotaya ayrı
 * ayrı yazılsaydı biri eksik kalırdı.
 */
export function sayfaEtiketleri({
  dil,
  yol,
  baslik,
}: {
  dil: DilKodu;
  yol: string;
  baslik: string;
}): Metadata {
  const aciklama = metin(LEZZETLER_METNI, dil);
  const diller = Object.fromEntries(DILLER.map((d) => [d, `/${d}${yol}`]));
  return {
    title: baslik,
    description: aciklama,
    alternates: {
      canonical: `/${dil}${yol}`,
      languages: { ...diller, "x-default": `/tr${yol}` },
    },
    openGraph: {
      type: "website",
      siteName: MEKAN_ADI,
      title: baslik,
      description: aciklama,
      url: `/${dil}${yol}`,
      locale: OG_DIL[dil],
      alternateLocale: DILLER.filter((d) => d !== dil).map((d) => OG_DIL[d]),
      images: [{ ...PAYLASIM_GORSELI, alt: metin(GORSEL_ALT.dukkan, dil) }],
    },
    twitter: {
      card: "summary",
      title: baslik,
      description: aciklama,
      images: [PAYLASIM_GORSELI.url],
    },
  };
}
