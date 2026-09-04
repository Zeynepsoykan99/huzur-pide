"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase-sunucu";
import { oturumAc, oturumKapat, yoneticiGerekli } from "@/lib/oturum";
import { secilebilirTema } from "@/data/tema";
import { FIYAT_PALETI, VURGU_PALETI } from "@/data/renkler";

/**
 * Panelin bütün yazma işlemleri.
 *
 * TARAYICIDAN FIRESTORE'A HİÇ YAZILMIYOR: güvenlik kuralları istemciye sıfır
 * yazma izni veriyor. Yazmalar yalnızca buradan, Admin SDK ile geçiyor ve her
 * eylem `yoneticiGerekli()` ile başlıyor — sayfa korumasına güvenilmiyor,
 * çünkü bir Server Action doğrudan da çağrılabilir.
 *
 * Her yazmadan sonra `revalidatePath`: müşteri menüsü statik kalmaya devam
 * ediyor, yalnızca etkilenen sayfalar bir sonraki ziyarette bir kez yeniden
 * üretiliyor.
 */

/** Menü sayfalarını ve kategori listesini yeniden ürettir. */
function menuyuTazele() {
  revalidatePath("/[dil]/menu/[sayfa]", "page");
  revalidatePath("/[dil]/menu", "page");
}

export type EylemSonucu = { ok: true; mesaj: string } | { ok: false; hata: string };

/* ---------------------------------------------------------------------------
   Giriş / çıkış
   --------------------------------------------------------------------------- */

export async function girisYap(kimlikBelirteci: string): Promise<EylemSonucu> {
  try {
    const yonetici = await oturumAc(kimlikBelirteci);
    if (!yonetici) {
      return {
        ok: false,
        hata: "Bu hesabın panele erişim yetkisi yok.",
      };
    }
    return { ok: true, mesaj: `Hoş geldiniz, ${yonetici.eposta}` };
  } catch {
    return { ok: false, hata: "Giriş doğrulanamadı. Tekrar deneyin." };
  }
}

export async function cikisYap(): Promise<void> {
  await oturumKapat();
}

/* ---------------------------------------------------------------------------
   Tema
   --------------------------------------------------------------------------- */

export async function temayiDegistir(tema: string): Promise<EylemSonucu> {
  try {
    await yoneticiGerekli();
    if (!secilebilirTema(tema)) {
      return { ok: false, hata: "Geçersiz tema." };
    }
    await db().collection("ayarlar").doc("genel").set({ tema }, { merge: true });

    // Tema bütün ekranları etkiliyor: yalnızca menü değil, dil seçimi ve ana
    // seçim ekranları da yeniden üretilmeli.
    revalidatePath("/[dil]", "layout");
    return { ok: true, mesaj: "Tema değiştirildi." };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

/* ---------------------------------------------------------------------------
   Renkler
   --------------------------------------------------------------------------- */

/**
 * Temanın içindeki vurgu ve fiyat rengini değiştirir.
 *
 * SAKLANAN DEĞER HEX DEĞİL, PALET ANAHTARI ve anahtar burada paletle
 * doğrulanıyor. Bu iki katmanın ikisi de gerekli: doğrulama olmasaydı
 * Firestore'a düşen tanınmayan bir anahtar sayfada varsayılana düşerdi
 * (sessiz), hex saklansaydı bozuk bir değer doğrudan sayfaya akardı.
 *
 * Paletin tamamı `betikler/renk-kontrast.ts` ile ölçülü olduğundan, buradan
 * geçen her seçim WCAG AA'yı geçiyor — kontrast çalışma anında yeniden
 * hesaplanmıyor, listeye girerken hesaplanmış oluyor.
 *
 * Seçim TEMAYA GÖRE yazılıyor (`renkler.<tema>`): bir temanın rengi başka
 * temaya taşınmıyor, çünkü zeminleri farklı.
 */
export async function renkleriDegistir(
  tema: string,
  secim: { vurgu: string; fiyat: string },
): Promise<EylemSonucu> {
  try {
    await yoneticiGerekli();
    if (!secilebilirTema(tema)) {
      return { ok: false, hata: "Geçersiz tema." };
    }
    if (!VURGU_PALETI[tema].some((r) => r.kod === secim.vurgu)) {
      return { ok: false, hata: "Bu tema için geçersiz vurgu rengi." };
    }
    if (!FIYAT_PALETI[tema].some((r) => r.kod === secim.fiyat)) {
      return { ok: false, hata: "Bu tema için geçersiz fiyat rengi." };
    }

    await db()
      .collection("ayarlar")
      .doc("genel")
      .set({ renkler: { [tema]: secim } }, { merge: true });

    // Renk temayla aynı kapsamda: karşılama sayfası da menü de etkileniyor.
    revalidatePath("/[dil]", "layout");
    return { ok: true, mesaj: "Renkler değiştirildi." };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

/* ---------------------------------------------------------------------------
   Fiyatlar
   --------------------------------------------------------------------------- */

export type FiyatDegisikligi = {
  urunId: string;
  sutun: string;
  yeniTutar: number | null;
};

/**
 * Birden çok fiyatı tek seferde kaydeder.
 *
 * `dogrulandi` işareti: mekân sahibi bir fiyatı elle girip kaydettiğinde o
 * hücre artık teyit edilmiş sayılıyor — "işletmeyle teyit edilmedi" notu
 * kalkıyor. Dokunulmayan hücrelerin işareti olduğu gibi kalıyor.
 */
export async function fiyatlariKaydet(
  degisiklikler: FiyatDegisikligi[],
): Promise<EylemSonucu> {
  try {
    await yoneticiGerekli();
    if (degisiklikler.length === 0) {
      return { ok: false, hata: "Değişiklik yok." };
    }

    const veritabani = db();
    const urunIdleri = [...new Set(degisiklikler.map((d) => d.urunId))];

    await veritabani.runTransaction(async (islem) => {
      const referanslar = urunIdleri.map((id) =>
        veritabani.collection("urunler").doc(id),
      );
      const belgeler = await islem.getAll(...referanslar);

      for (const [i, belge] of belgeler.entries()) {
        if (!belge.exists) throw new Error(`Ürün bulunamadı: ${urunIdleri[i]}`);

        const fiyatlar = (belge.data()?.fiyatlar ?? []) as {
          sutun: string;
          tutar: number | null;
          dogrulandi: boolean;
        }[];

        const buUrun = degisiklikler.filter((d) => d.urunId === urunIdleri[i]);
        const yeni = fiyatlar.map((f) => {
          const d = buUrun.find((x) => x.sutun === f.sutun);
          if (!d) return f;
          return { ...f, tutar: d.yeniTutar, dogrulandi: true };
        });

        islem.update(belge.ref, { fiyatlar: yeni });
      }
    });

    menuyuTazele();
    return {
      ok: true,
      mesaj: `${degisiklikler.length} fiyat güncellendi.`,
    };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

/* ---------------------------------------------------------------------------
   Yeni ürün
   --------------------------------------------------------------------------- */

export type YeniUrun = {
  kategoriSlug: string;
  ad: { tr: string; en?: string; ar?: string; ru?: string };
  icerik: { tr: string; en?: string; ar?: string; ru?: string } | null;
  fiyatlar: { sutun: string; tutar: number | null }[];
};

/** Ürün kimliği: Türkçe addan türetilen, kategori içinde tekil bir slug. */
function kimlikUret(ad: string): string {
  const harita: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return ad
    .split("")
    .map((h) => harita[h] ?? h)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function urunEkle(urun: YeniUrun): Promise<EylemSonucu> {
  try {
    await yoneticiGerekli();

    const trAd = urun.ad.tr?.trim();
    if (!trAd) return { ok: false, hata: "Türkçe ürün adı zorunlu." };
    if (!urun.kategoriSlug) return { ok: false, hata: "Kategori seçilmedi." };

    const veritabani = db();
    const kategori = await veritabani
      .collection("kategoriler")
      .doc(urun.kategoriSlug)
      .get();
    if (!kategori.exists) return { ok: false, hata: "Kategori bulunamadı." };

    // Aynı kategorideki ürünler: sıra numarası ve kimlik çakışması için.
    const kardesler = await veritabani
      .collection("urunler")
      .where("kategoriSlug", "==", urun.kategoriSlug)
      .get();

    let id = kimlikUret(trAd);
    if (!id) return { ok: false, hata: "Üründen geçerli bir kimlik üretilemedi." };
    const mevcutIdler = new Set(kardesler.docs.map((d) => d.id));
    if (mevcutIdler.has(id)) {
      let n = 2;
      while (mevcutIdler.has(`${id}-${n}`)) n += 1;
      id = `${id}-${n}`;
    }

    const sira =
      kardesler.docs.reduce((enB, d) => Math.max(enB, d.data().sira ?? 0), -1) + 1;

    // Boş çeviri alanları YAZILMIYOR: `metin()` eksik alanı Türkçe'ye
    // düşürüyor, boş string yazmak "çevrildi ama boş" ile karışırdı.
    const temizle = (m: Record<string, string | undefined>) =>
      Object.fromEntries(
        Object.entries(m).filter(([, v]) => v && v.trim().length > 0),
      ) as { tr: string };

    await veritabani.collection("urunler").doc(id).set({
      id,
      kategoriSlug: urun.kategoriSlug,
      sira,
      ad: temizle(urun.ad),
      icerik: urun.icerik && urun.icerik.tr?.trim() ? temizle(urun.icerik) : null,
      // Storage henüz yok: ürün fotoğrafsız ekleniyor ve menüde kategorisinin
      // yer tutucusuyla görünüyor. Storage geldiğinde yalnızca bu alan
      // doldurulacak, başka hiçbir yer değişmeyecek.
      gorsel: null,
      fiyatlar: urun.fiyatlar.map((f) => ({
        sutun: f.sutun,
        tutar: f.tutar,
        dogrulandi: true,
      })),
    });

    menuyuTazele();
    return { ok: true, mesaj: `"${trAd}" eklendi.` };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}

/** Panelde eklenen bir ürünü geri almak için — test ve hata düzeltme yolu. */
export async function urunSil(id: string): Promise<EylemSonucu> {
  try {
    await yoneticiGerekli();
    await db().collection("urunler").doc(id).delete();
    menuyuTazele();
    return { ok: true, mesaj: "Ürün silindi." };
  } catch (e) {
    return { ok: false, hata: (e as Error).message };
  }
}
