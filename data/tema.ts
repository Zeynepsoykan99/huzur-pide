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
 *
 * KODDAKI HER TEMA PANELDE SECILEBILIR VE DENETIMDE. Eskiden dorduncu bir
 * tema (Zeytin) kodda duruyor ama panelde secenek degildi; renk paleti yoktu
 * ve kontrast betigi onu olcmuyordu. Asama 40'ta kaldirildi — geri gerekirse
 * git gecmisinde. Yeni tema eklenirse "denetimsiz tema" durumu tekrar
 * dogmasin: bu listeye giren tema ayni anda panelde (TEMA_TARIFI), renk
 * paletinde (`data/renkler.ts`), yazi tiplerinde (`app/temalar/aktif.ts`)
 * ve kontrast betiginde yer alir; TypeScript eksik olani derlemede soyler.
 */

export const TEMA_KODLARI = ["cini", "gece", "murekkep"] as const;

export type TemaKodu = (typeof TEMA_KODLARI)[number];

/**
 * Panelde secilebilecek temalar — kodda tanimli temalarin TAMAMI.
 *
 * Ayri bir ad olarak duruyor cunku panel, renk paleti ve kontrast betigi bu
 * adla yaziliyor; anlami "secilebilir olan", ve artik secilebilir olmayan
 * tema yok.
 */
export const SECILEBILIR_TEMALAR = TEMA_KODLARI;

export type SecilebilirTema = TemaKodu;

/** Panelde ve onizlemede gorunecek adlar. */
export const TEMA_ADI: Record<TemaKodu, string> = {
  cini: "Çini Levha",
  gece: "Gece Ocağı",
  murekkep: "Mürekkep",
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

/** Panel eylemlerinin kullandigi ad; `gecerliTema` ile ayni kontrol. */
export const secilebilirTema = gecerliTema;

/** Firestore okunamazsa ya da deger taninmazsa kullanilan tema. */
export const VARSAYILAN_TEMA: TemaKodu = "cini";
