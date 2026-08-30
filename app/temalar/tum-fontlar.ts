import { CINI_FONTLARI } from "./fontlar-cini";
import { GECE_FONTLARI } from "./fontlar-gece";
import { MUREKKEP_FONTLARI } from "./fontlar-murekkep";
import { ZEYTIN_FONTLARI } from "./fontlar-zeytin";
import type { TemaKodu } from "@/data/tema";

/**
 * Dort temanin yazi tipleri birden.
 *
 * YALNIZCA onizleme rotasi bunu import ediyor. Uretim ekranlari `aktif.ts`
 * uzerinden tek temanin fontlarini yukluyor; bu dosya oraya hic girmiyor.
 */
export const TEMA_FONTLARI: Record<TemaKodu, string> = {
  cini: CINI_FONTLARI,
  gece: GECE_FONTLARI,
  murekkep: MUREKKEP_FONTLARI,
  zeytin: ZEYTIN_FONTLARI,
};

export const TUM_TEMA_FONTLARI = [
  CINI_FONTLARI,
  GECE_FONTLARI,
  MUREKKEP_FONTLARI,
  ZEYTIN_FONTLARI,
].join(" ");
