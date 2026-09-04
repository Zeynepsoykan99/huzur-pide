/**
 * Panelden seçilebilen renkler.
 *
 * Mekân sahibi temanın İÇİNDE iki rengi değiştirebiliyor: vurgu rengi
 * (motif, oklar, sıra numarası, ikonlar, aktif dil) ve fiyat rengi.
 *
 * NEDEN SERBEST RENK SEÇİCİ DEĞİL DE HAZIR PALET
 * ----------------------------------------------
 * `--t-vurgu` iki yönde birden kullanılıyor: açık zeminlerde METİN rengi,
 * `.dil-secenek-aktif` içinde ise ZEMİN rengi (üstünde `--t-yuzey` yazı).
 * Bir renk ikisini birden geçmek zorunda. Serbest seçicide bu iki yönlü
 * kısıt her seferinde çalışma anında sınanırdı; buradaki renkler ise
 * `betikler/renk-kontrast.ts` ile ÖLÇÜLÜP eklendi. Geçmeyen renk palete
 * hiç girmiyor, yani AA garantisi çalışma anındaki bir kontrole değil
 * listenin kendisine dayanıyor.
 *
 * Temanın zemini renk seçimini belirliyor: Çini'nin porselen zeminine uyan
 * koyu kobalt, Gece'nin neredeyse siyah zemininde okunmaz. Bu yüzden palet
 * TEMAYA ÖZEL ve seçim de temaya göre saklanıyor (bkz. `ayarlar/genel`).
 *
 * Yeni renk eklemek: buraya ekleyip `npx tsx betikler/renk-kontrast.ts`
 * çalıştırın. Betik geçmeyen rengi söyler.
 */

import type { SecilebilirTema } from "./tema";

export type RenkSecenegi = {
  /** Firestore'da saklanan anahtar. Hex DEĞİL — bkz. `renkleriCoz`. */
  kod: string;
  /** Panelde renk kutusunun altında görünen ad. */
  ad: string;
  hex: string;
};

/**
 * Vurgu rengi seçenekleri.
 *
 * Her listenin İLK ögesi o temanın varsayılanı — `temalar.css` içindeki
 * `--t-vurgu` değeriyle birebir aynı. Böylece "seçim yok" ile "varsayılanı
 * seçtim" aynı görünüyor.
 */
export const VURGU_PALETI: Record<SecilebilirTema, RenkSecenegi[]> = {
  cini: [
    { kod: "kobalt", ad: "Kobalt", hex: "#1a4a8d" },
    { kod: "turkuaz", ad: "Turkuaz", hex: "#1f6b6b" },
    { kod: "mercan", ad: "Mercan", hex: "#b23b26" },
    { kod: "patlican", ad: "Patlıcan", hex: "#6b3a7a" },
    { kod: "yesil", ad: "Yeşil", hex: "#2f6b45" },
  ],
  gece: [
    { kod: "amber", ad: "Amber", hex: "#e59a4a" },
    { kod: "altin", ad: "Altın", hex: "#e5b567" },
    { kod: "bakir", ad: "Bakır", hex: "#d98757" },
    { kod: "fistik", ad: "Fıstık", hex: "#b9c47a" },
    { kod: "gul", ad: "Gül", hex: "#e08a8a" },
  ],
  murekkep: [
    { kod: "kirmizi", ad: "Kırmızı", hex: "#bf3721" },
    { kod: "lacivert", ad: "Lacivert", hex: "#1e3a6b" },
    { kod: "murekkep", ad: "Mürekkep", hex: "#2b2b2b" },
    { kod: "yesil", ad: "Yeşil", hex: "#2f5d3a" },
    { kod: "kahve", ad: "Kahve", hex: "#6b4423" },
  ],
};

/** Fiyat rengi seçenekleri. Fiyat yalnızca METİN, tek yönlü kısıt. */
export const FIYAT_PALETI: Record<SecilebilirTema, RenkSecenegi[]> = {
  cini: [
    { kod: "mercan", ad: "Mercan", hex: "#b23b26" },
    { kod: "kobalt", ad: "Kobalt", hex: "#1a4a8d" },
    { kod: "yesil", ad: "Yeşil", hex: "#2f6b45" },
    { kod: "patlican", ad: "Patlıcan", hex: "#6b3a7a" },
  ],
  gece: [
    { kod: "altin", ad: "Altın", hex: "#e5b567" },
    { kod: "amber", ad: "Amber", hex: "#e59a4a" },
    { kod: "fistik", ad: "Fıstık", hex: "#b9c47a" },
    { kod: "gul", ad: "Gül", hex: "#e08a8a" },
  ],
  murekkep: [
    { kod: "kirmizi", ad: "Kırmızı", hex: "#bf3721" },
    { kod: "lacivert", ad: "Lacivert", hex: "#1e3a6b" },
    { kod: "murekkep", ad: "Mürekkep", hex: "#2b2b2b" },
    { kod: "yesil", ad: "Yeşil", hex: "#2f5d3a" },
  ],
};

/** Firestore'da `ayarlar/genel.renkler[tema]` altında duran şekil. */
export type TemaRenkSecimi = { vurgu?: string; fiyat?: string };

export type CozulmusRenkler = { vurgu: string; fiyat: string };

/**
 * Saklanan ANAHTARLARI hex'e çevirir.
 *
 * Firestore'da hex değil anahtar duruyor. Sebebi savunma: hex saklansaydı
 * oraya düşen bozuk ya da okunmaz bir değer doğrudan sayfaya akardı.
 * Anahtar burada aranıyor, tanınmayan anahtar temanın varsayılanına
 * düşüyor — `gecerliTema()` / `VARSAYILAN_TEMA` ile aynı savunma.
 */
export function renkleriCoz(
  tema: SecilebilirTema,
  secim: TemaRenkSecimi | undefined,
): CozulmusRenkler {
  const vurguListesi = VURGU_PALETI[tema];
  const fiyatListesi = FIYAT_PALETI[tema];
  const vurgu =
    vurguListesi.find((r) => r.kod === secim?.vurgu) ?? vurguListesi[0];
  const fiyat =
    fiyatListesi.find((r) => r.kod === secim?.fiyat) ?? fiyatListesi[0];
  return { vurgu: vurgu.hex, fiyat: fiyat.hex };
}

/** Seçim varsayılandan farklı mı — panelde "varsayılana dön" için. */
export function varsayilanMi(tema: SecilebilirTema, secim: TemaRenkSecimi | undefined): boolean {
  const c = renkleriCoz(tema, secim);
  return c.vurgu === VURGU_PALETI[tema][0].hex && c.fiyat === FIYAT_PALETI[tema][0].hex;
}
