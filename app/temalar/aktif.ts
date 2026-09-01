import { CINI_FONTLARI } from "./fontlar-cini";
import { GECE_FONTLARI } from "./fontlar-gece";
import { MUREKKEP_FONTLARI } from "./fontlar-murekkep";
import { ZEYTIN_FONTLARI } from "./fontlar-zeytin";
import type { TemaKodu } from "@/data/tema";

/**
 * Tema -> o temanin yazi tipi degisken sinifları.
 *
 * Tema artik panelden degistigi icin dort tema modulu de import ediliyor.
 * ANCAK <html> uzerine YALNIZCA aktif temanin degiskenleri konuyor: tarayici
 * bir yazi tipi dosyasini ancak eslesen bir CSS kurali onu kullandiginda
 * indiriyor, bu yuzden pasif temalarin dosyalari inmiyor. Yayina giden HTML'de
 * font on yukleme sayisi olculerek dogrulandi.
 */
export const TEMA_FONTLARI: Record<TemaKodu, string> = {
  cini: CINI_FONTLARI,
  gece: GECE_FONTLARI,
  murekkep: MUREKKEP_FONTLARI,
  zeytin: ZEYTIN_FONTLARI,
};
