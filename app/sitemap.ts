import type { MetadataRoute } from "next";
import { DILLER } from "@/data/menu";
import { sayfalar } from "@/data/menuKaynak";
import { SITE_ADRESI } from "@/data/site";

/**
 * sitemap.xml — dört dilde karşılama, menü ve her kategori.
 *
 * Kategoriler Firestore'dan okunuyor, elle yazılmıyor: kategori rotaları da
 * derleme anında oradan üretiliyor (`generateStaticParams`), ikisi aynı
 * listeden besleniyor. Yeni kategori bir sonraki derlemede ikisine birden
 * giriyor.
 *
 * Her adres dört dildeki karşılığını `hreflang` olarak taşıyor; sayfalardaki
 * `alternates` etiketiyle aynı eşleme (bkz. `data/site.ts`).
 *
 * `lastModified` bilerek YOK: fiyatlar panelden değişiyor ve bu dosya
 * derleme anında üretiliyor; derleme tarihini yazmak arama motoruna yanlış
 * bir "son değişiklik" söylerdi.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const liste = await sayfalar();
  const yollar = ["", "/menu", ...liste.map((s) => `/menu/${s.slug}`)];

  return yollar.flatMap((yol) => {
    const diller = Object.fromEntries(
      DILLER.map((d) => [d, `${SITE_ADRESI}/${d}${yol}`]),
    );
    return DILLER.map((dil) => ({
      url: `${SITE_ADRESI}/${dil}${yol}`,
      alternates: { languages: { ...diller, "x-default": `${SITE_ADRESI}/tr${yol}` } },
    }));
  });
}
