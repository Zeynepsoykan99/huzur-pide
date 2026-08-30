/**
 * Aktif tema.
 *
 * Tema, uygulamanin gorunen dilinin tamami: renkler, yazi tipleri, motif,
 * kose yuvarlakligi, doku. Tanimlari `app/temalar/temalar.css` icinde.
 *
 * Ileride mekan sahibi admin panelinden secebilecek; o gun geldiginde bu
 * sabit veritabanindan okunacak. Bugun tek satir:
 *
 *   AKTIF_TEMA = "gece"  ->  uygulama Gece Ocagi'na doner
 *
 * Font degisimi icin `app/temalar/aktif.ts` icindeki import da ayni temaya
 * cevrilmeli — uretimde yalnizca aktif temanin yazi tipleri insin diye
 * bilincli olarak ayri tutuldu.
 */

export const TEMA_KODLARI = ["cini", "gece", "murekkep", "zeytin"] as const;

export type TemaKodu = (typeof TEMA_KODLARI)[number];

/** Panelde ve onizlemede gorunecek adlar. */
export const TEMA_ADI: Record<TemaKodu, string> = {
  cini: "Cini Levha",
  gece: "Gece Ocagi",
  murekkep: "Murekkep",
  zeytin: "Zeytin",
};

export function gecerliTema(deger: string): deger is TemaKodu {
  return (TEMA_KODLARI as readonly string[]).includes(deger);
}

/** Uygulamanin su anki temasi. */
export const AKTIF_TEMA: TemaKodu = "cini";

/** <html> uzerine konacak sinif. */
export const AKTIF_TEMA_SINIFI = `tema-${AKTIF_TEMA}`;
