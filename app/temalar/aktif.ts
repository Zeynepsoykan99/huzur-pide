/**
 * Aktif temanin yazi tipleri.
 *
 * Bu dosya BILEREK tek bir tema modulu import ediyor: next/font cagrilari
 * modul seviyesinde calistigi icin, dort temanin dosyasi da import edilseydi
 * dort takim yazi tipi yayina girerdi. Boylece uretimde yalnizca aktif
 * temanin fontlari iniyor.
 *
 * Tema degistirirken burasi ve `data/tema.ts` icindeki AKTIF_TEMA birlikte
 * guncellenmeli.
 */
export { CINI_FONTLARI as AKTIF_TEMA_FONTLARI } from "./fontlar-cini";
