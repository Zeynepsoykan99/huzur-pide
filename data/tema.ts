/**
 * Temalar.
 *
 * Tema, uygulamanin gorunen dilinin tamami: renkler, yazi tipleri, motif,
 * kose yuvarlakligi, doku. Tanimlari `app/temalar/temalar.css` icinde.
 *
 * HANGI TEMANIN AKTIF OLDUGU ARTIK BURADA DEGIL: Firestore'da
 * `ayarlar/genel.tema` alaninda duruyor ve panelden degistiriliyor.
 * Sunucu tarafinda `aktifTema()` ile okunuyor (bkz. data/menuKaynak.ts).
 * Buradaki VARSAYILAN_TEMA yalnizca Firestore'da bir deger yoksa ya da
 * taninmayan bir deger varsa devreye giren emniyet degeri.
 */

export const TEMA_KODLARI = ["cini", "gece", "murekkep", "zeytin"] as const;

export type TemaKodu = (typeof TEMA_KODLARI)[number];

/** Panelde secilebilecek temalar. Zeytin kodda duruyor ama secenek degil. */
export const SECILEBILIR_TEMALAR = ["cini", "gece", "murekkep"] as const;

export type SecilebilirTema = (typeof SECILEBILIR_TEMALAR)[number];

/** Panelde ve onizlemede gorunecek adlar. */
export const TEMA_ADI: Record<TemaKodu, string> = {
  cini: "Çini Levha",
  gece: "Gece Ocağı",
  murekkep: "Mürekkep",
  zeytin: "Zeytin",
};

/** Panelde tema kartinin altinda gorunen tek cumlelik tarif. */
export const TEMA_TARIFI: Record<SecilebilirTema, string> = {
  cini: "Porselen zemin, kobalt mavisi, ince bordür.",
  gece: "Koyu ve sıcak; fotoğraflar karanlıkta öne çıkar.",
  murekkep: "Gazete kâğıdı, kalın çizgiler, iri büyük harf başlıklar.",
};

export function gecerliTema(deger: string): deger is TemaKodu {
  return (TEMA_KODLARI as readonly string[]).includes(deger);
}

export function secilebilirTema(deger: string): deger is SecilebilirTema {
  return (SECILEBILIR_TEMALAR as readonly string[]).includes(deger);
}

/** Firestore okunamazsa ya da deger taninmazsa kullanilan tema. */
export const VARSAYILAN_TEMA: TemaKodu = "cini";
