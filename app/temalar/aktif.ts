import { CINI_FONTLARI } from "./fontlar-cini";
import { GECE_FONTLARI } from "./fontlar-gece";
import { MUREKKEP_FONTLARI } from "./fontlar-murekkep";
import type { TemaKodu } from "@/data/tema";

/**
 * Tema -> o temanin yazi tipi degisken siniflari.
 *
 * Tema Firestore'dan okundugu ve next/font cagrilari statik olmak zorunda
 * oldugu icin, her temanin aileleri derlemeye girmek zorunda — hangisinin
 * aktif olacagi derleme aninda bilinmiyor.
 *
 * `Record<TemaKodu, …>`: `data/tema.ts`'e yeni tema eklenip buraya satiri
 * konmazsa derleme hata veriyor. Kodda olup yazi tipi olmayan bir tema
 * kalamiyor.
 *
 * `<html>` uzerine yalnizca AKTIF temanin degiskenleri konuyor; ayrica
 * fontlarda preload kapali (bkz. fontlar-*.ts), bu yuzden tarayici sadece
 * eslesen CSS kuralinin istedigi aileyi indiriyor.
 */
const TEMA_FONTLARI: Record<TemaKodu, string> = {
  cini: CINI_FONTLARI,
  gece: GECE_FONTLARI,
  murekkep: MUREKKEP_FONTLARI,
};

/** Aktif temanin font siniflari. Taninmayan tema Cini'ye dusuyor. */
export function temaFontlari(tema: TemaKodu): string {
  return TEMA_FONTLARI[tema] ?? TEMA_FONTLARI.cini;
}
