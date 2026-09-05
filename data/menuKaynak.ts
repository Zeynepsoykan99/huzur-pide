import "server-only";
import { cache } from "react";
import { db } from "@/lib/firebase-sunucu";
import type { Kategori, MenuSayfasi, Urun } from "@/data/menu";
import { TEMA_KODLARI, secilebilirTema, type TemaKodu } from "@/data/tema";
import { renkleriCoz, type CozulmusRenkler, type TemaRenkSecimi } from "@/data/renkler";

/**
 * Menünün ve aktif temanın KAYNAĞI — Firestore.
 *
 * Eskiden içerik `data/menu.ts` içindeki `MENU` sabitinden geliyordu; artık
 * oradan yalnızca TİPLER ve saf yardımcılar (`metin`, `fiyatYaz`,
 * `icerikMetni`) kullanılıyor. İçerik panelden değiştirilebilsin diye
 * Firestore'a taşındı (bkz. `betikler/tohum.ts`).
 *
 * MÜŞTERİ İSTEĞİNDE FIRESTORE'A GİDİLMİYOR. Menü sayfaları statik üretiliyor;
 * buradaki okuma yalnızca (a) derleme sırasında ve (b) panelden bir şey
 * değişip `revalidatePath` çağrıldıktan sonraki ilk ziyarette çalışıyor.
 *
 * `cache()` aynı render geçişinde tekrar tekrar okunmasını engelliyor:
 * bir sayfa hem `generateStaticParams` hem `generateMetadata` hem de gövde
 * için menüyü isteyebiliyor, üçü tek okumayı paylaşıyor.
 */

/** Kitabın bir yaprağı — `data/menu.ts` içindeki şeklin aynısı. */
export type { MenuSayfasi };

type MenuAnliki = {
  kategoriler: Kategori[];
  sayfalar: MenuSayfasi[];
  tema: TemaKodu;
  /**
   * Aktif temanın renkleri — panelden seçilen ya da temanın varsayılanı.
   *
   * `null` yalnızca aktif tema panelde seçilebilir olmadığında (Zeytin):
   * onun bir paleti yok, temanın kendi renkleri geçerli kalıyor.
   */
  renkler: CozulmusRenkler | null;
};

/**
 * Firestore'dan menünün tamamını okur.
 *
 * İki koleksiyon + bir ayar belgesi = 37 belge okuması. Kategoriler ve
 * ürünler kendi `sira` alanlarına göre sıralanıyor; sıralama veritabanı
 * tarafında değil burada yapılıyor ki dizin (index) gerekmesin.
 */
export const menuyuOku = cache(async (): Promise<MenuAnliki> => {
  const veritabani = db();

  const [kategoriAnlik, urunAnlik, ayarAnlik] = await Promise.all([
    veritabani.collection("kategoriler").get(),
    veritabani.collection("urunler").get(),
    veritabani.collection("ayarlar").doc("genel").get(),
  ]);

  const urunlerSlugaGore = new Map<string, { sira: number; urun: Urun }[]>();
  for (const belge of urunAnlik.docs) {
    const v = belge.data();
    const liste = urunlerSlugaGore.get(v.kategoriSlug) ?? [];
    liste.push({
      sira: v.sira ?? 0,
      urun: {
        id: v.id ?? belge.id,
        ad: v.ad,
        icerik: v.icerik ?? null,
        fiyatlar: v.fiyatlar ?? [],
        gorsel: v.gorsel ?? null,
      },
    });
    urunlerSlugaGore.set(v.kategoriSlug, liste);
  }

  const kategoriler: Kategori[] = kategoriAnlik.docs
    .map((belge) => {
      const v = belge.data();
      return { sira: v.sira ?? 0, veri: v };
    })
    .sort((a, b) => a.sira - b.sira)
    .map(({ veri }) => ({
      slug: veri.slug,
      ad: veri.ad,
      sutunlar: veri.sutunlar ?? [],
      urunler: (urunlerSlugaGore.get(veri.slug) ?? [])
        .sort((a, b) => a.sira - b.sira)
        .map((x) => x.urun),
    }));

  // Her kategori tek sayfa — sayfa numarası kategorinin sırası.
  const sayfalar: MenuSayfasi[] = kategoriler.map((kategori, i) => ({
    no: i + 1,
    slug: kategori.slug,
    kategori,
    urunler: kategori.urunler,
  }));

  const hamTema = ayarAnlik.exists ? ayarAnlik.data()?.tema : undefined;
  const tema: TemaKodu = (TEMA_KODLARI as readonly string[]).includes(hamTema)
    ? (hamTema as TemaKodu)
    : "cini";

  /**
   * Renk seçimi TEMAYA GÖRE saklanıyor: `renkler[tema]`.
   *
   * Çini'nin porselen zeminine uyan koyu bir renk, Gece'nin neredeyse siyah
   * zemininde okunmuyor. Tek bir alanda saklansaydı tema değiştirildiğinde
   * o renk yeni temaya taşınır ve kontrastı düşürebilirdi. Böylece her tema
   * yalnızca kendisi için ölçülmüş bir seçimle geliyor.
   *
   * Saklanan değer HEX DEĞİL, palet anahtarı; `renkleriCoz` tanımadığı
   * anahtarı temanın varsayılanına düşürüyor.
   */
  const hamRenkler = ayarAnlik.exists ? ayarAnlik.data()?.renkler : undefined;
  const secim: TemaRenkSecimi | undefined = hamRenkler?.[tema];
  const renkler = secilebilirTema(tema) ? renkleriCoz(tema, secim) : null;

  return { kategoriler, sayfalar, tema, renkler };
});

/* ---------------------------------------------------------------------------
   `data/menu.ts` içindeki türetilmiş yardımcıların Firestore karşılıkları.
   Bileşenler bunları aynı şekilde kullanıyor, imzalar korundu.
   --------------------------------------------------------------------------- */

export async function sayfalar(): Promise<MenuSayfasi[]> {
  return (await menuyuOku()).sayfalar;
}

export async function kategoriler(): Promise<Kategori[]> {
  return (await menuyuOku()).kategoriler;
}

export async function sayfaBul(slug: string): Promise<MenuSayfasi | undefined> {
  return (await menuyuOku()).sayfalar.find((s) => s.slug === slug);
}

/** Kategorinin kitaptaki sayfa numarası. Her kategori tek sayfa. */
export async function sayfaNumarasi(kategoriSlug: string): Promise<number> {
  const s = await sayfaBul(kategoriSlug);
  return s?.no ?? 1;
}

/** Uygulamanın o anki teması. */
export async function aktifTema(): Promise<TemaKodu> {
  return (await menuyuOku()).tema;
}

/** Aktif temanın renkleri. Seçilebilir olmayan temada `null`. */
export async function aktifRenkler(): Promise<CozulmusRenkler | null> {
  return (await menuyuOku()).renkler;
}

/**
 * Panelin renk kutularını işaretlemek için — ham seçimler, çözülmemiş hâliyle.
 *
 * TEK TEMANIN DEĞİL HEPSİNİN seçimi dönüyor: panel tema değiştirildiğinde
 * yeni temanın kayıtlı renklerini SUNUCUYA GİTMEDEN gösterebilsin diye.
 * Yalnızca aktif temanınki gönderilseydi her tema tıklamasında bir gidiş
 * dönüş gerekir, önizleme de o kadar gecikirdi.
 */
export const tumRenkSecimleri = cache(
  async (): Promise<Record<string, TemaRenkSecimi>> => {
    const belge = await db().collection("ayarlar").doc("genel").get();
    return (belge.data()?.renkler ?? {}) as Record<string, TemaRenkSecimi>;
  },
);
