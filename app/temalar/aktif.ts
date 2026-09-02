import { CINI_FONTLARI } from "./fontlar-cini";
import { GECE_FONTLARI } from "./fontlar-gece";
import { MUREKKEP_FONTLARI } from "./fontlar-murekkep";
import type { SecilebilirTema, TemaKodu } from "@/data/tema";

/**
 * Tema -> o temanin yazi tipi degisken siniflari.
 *
 * YALNIZCA PANELDE SECILEBILEN temalar burada. Tema Firestore'dan okundugu
 * ve next/font cagrilari statik olmak zorunda oldugu icin, secilebilir her
 * temanin aileleri derlemeye girmek zorunda — hangisinin aktif olacagi
 * derleme aninda bilinmiyor.
 *
 * ZEYTIN BILEREK YOK. Panelde secenek degil, dolayisiyla font degiskenleri
 * hicbir zaman uygulanmiyor; import edilseydi dort ailesi bosuna indirilir ve
 * derleme Google Fonts'a bir o kadar daha bagimli olurdu. Temanin kendisi
 * (renkler, motif) `temalar.css` ve `TemaMotifi` icinde duruyor;
 * `fontlar-zeytin.ts` de yerinde. Secilebilir yapmak icin: `data/tema.ts`
 * icindeki SECILEBILIR_TEMALAR'a eklenip asagiya bir satir konmasi yeterli.
 *
 * `<html>` uzerine yalnizca AKTIF temanin degiskenleri konuyor; ayrica
 * fontlarda preload kapali (bkz. fontlar-*.ts), bu yuzden tarayici sadece
 * eslesen CSS kuralinin istedigi aileyi indiriyor.
 */
const SECILEBILIR_FONTLAR: Record<SecilebilirTema, string> = {
  cini: CINI_FONTLARI,
  gece: GECE_FONTLARI,
  murekkep: MUREKKEP_FONTLARI,
};

/** Aktif temanin font siniflari. Taninmayan tema Cini'ye dusuyor. */
export function temaFontlari(tema: TemaKodu): string {
  return SECILEBILIR_FONTLAR[tema as SecilebilirTema] ?? SECILEBILIR_FONTLAR.cini;
}
