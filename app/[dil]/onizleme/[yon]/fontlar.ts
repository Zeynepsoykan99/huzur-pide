import {
  Amiri,
  Cormorant,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
  Inter,
  Noto_Sans_Arabic,
  Playfair_Display,
  Reem_Kufi,
} from "next/font/google";

/**
 * Önizleme yönlerinin yazı tipleri.
 *
 * DÖRT DİL KURALI: menü tr/en/ar/ru çalışıyor. Tek bir aile dört alfabeyi de
 * kapsamıyor, bu yüzden her yönde İKİ aile var — biri Latin+Kiril, biri
 * Arapça. Hangisinin geçerli olacağını CSS `[dir="rtl"]` ile seçiyor.
 *
 * Kapsamlar Google Fonts CSS API'sinden tek tek doğrulandı:
 *   Playfair Display  latin, latin-ext, cyrillic
 *   Inter             latin, latin-ext, cyrillic, cyrillic-ext
 *   Amiri             latin, latin-ext, arabic
 *   Noto Sans Arabic  latin, latin-ext, arabic
 *   Cormorant         latin, latin-ext, cyrillic, cyrillic-ext
 *   IBM Plex Sans     latin, latin-ext, cyrillic, cyrillic-ext
 *   Reem Kufi         latin, latin-ext, arabic
 *   IBM Plex Sans Ar. latin, latin-ext, arabic
 *
 * Not: sitenin bugünkü başlık fontu Marcellus'ta Kiril ve Arapça YOK; Rusça
 * ve Arapça başlıklar sistem serifine düşüyor. İki yön de bunu kapatıyor.
 */

/* --- Yön A: Gece Ocağı --- */

export const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  variable: "--font-playfair",
  fallback: ["Georgia", "Cambria", "serif"],
});

export const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
  fallback: ["Times New Roman", "serif"],
});

export const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-noto-arabic",
  fallback: ["Segoe UI", "Tahoma", "sans-serif"],
});

/* --- Yön B: Çini Levha --- */

export const cormorant = Cormorant({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
  fallback: ["Georgia", "Cambria", "serif"],
});

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-reem",
  fallback: ["Tahoma", "sans-serif"],
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex-arabic",
  fallback: ["Segoe UI", "Tahoma", "sans-serif"],
});

/** Sekiz değişkenin tamamı sarmalayıcıya bir kerede veriliyor. */
export const TUM_FONT_DEGISKENLERI = [
  playfair.variable,
  inter.variable,
  amiri.variable,
  notoArabic.variable,
  cormorant.variable,
  plexSans.variable,
  reemKufi.variable,
  plexArabic.variable,
].join(" ");
