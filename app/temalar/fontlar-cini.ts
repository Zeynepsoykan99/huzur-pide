import { Cormorant, IBM_Plex_Sans, IBM_Plex_Sans_Arabic, Reem_Kufi } from "next/font/google";

/**
 * Çini Levha yazı tipleri.
 *
 * DÖRT DİL: tek bir aile Latin, Kiril ve Arapça'yı birlikte kapsamıyor.
 * Bu yüzden iki çift var; hangisinin geçerli olacağını `temalar.css` içindeki
 * `[dir="rtl"]` bloğu seçiyor.
 *
 * Kapsamlar Google Fonts CSS API'sinden doğrulandı:
 *   Cormorant            latin, latin-ext, cyrillic, cyrillic-ext
 *   IBM Plex Sans        latin, latin-ext, cyrillic, cyrillic-ext
 *   Reem Kufi            latin, latin-ext, arabic
 *   IBM Plex Sans Arabic latin, latin-ext, arabic
 */

const cormorant = Cormorant({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
  fallback: ["Georgia", "Cambria", "serif"],
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-reem",
  fallback: ["Tahoma", "sans-serif"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-arabic",
  fallback: ["Segoe UI", "Tahoma", "sans-serif"],
});

/** `<html>` (ya da önizleme sarmalayıcısı) üzerine konacak sınıflar. */
export const CINI_FONTLARI = [
  cormorant.variable,
  plexSans.variable,
  reemKufi.variable,
  plexArabic.variable,
].join(" ");
