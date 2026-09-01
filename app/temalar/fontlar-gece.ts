import { Amiri, Inter, Noto_Sans_Arabic, Playfair_Display } from "next/font/google";

/**
 * Gece Ocagi yazi tipleri.
 *
 * Kapsamlar dogrulandi:
 *   Playfair Display  latin, latin-ext, cyrillic
 *   Inter             latin, latin-ext, cyrillic, cyrillic-ext
 *   Amiri             latin, latin-ext, arabic
 *   Noto Sans Arabic  latin, latin-ext, arabic
 */

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  // preload KAPALI: dort temanin da modulu derlemeye giriyor; acik
  // birakilsaydi Next dordunun de dosyalarini <link rel=preload> ile
  // cagirirdi (olculdu: 46 on yukleme). Kapatilinca tarayici yalnizca
  // eslesen CSS kuralinin istedigi aileyi indiriyor.
  preload: false,
  variable: "--font-playfair",
  fallback: ["Georgia", "Cambria", "serif"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  // preload KAPALI: dort temanin da modulu derlemeye giriyor; acik
  // birakilsaydi Next dordunun de dosyalarini <link rel=preload> ile
  // cagirirdi (olculdu: 46 on yukleme). Kapatilinca tarayici yalnizca
  // eslesen CSS kuralinin istedigi aileyi indiriyor.
  preload: false,
  variable: "--font-inter",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
  // preload KAPALI: dort temanin da modulu derlemeye giriyor; acik
  // birakilsaydi Next dordunun de dosyalarini <link rel=preload> ile
  // cagirirdi (olculdu: 46 on yukleme). Kapatilinca tarayici yalnizca
  // eslesen CSS kuralinin istedigi aileyi indiriyor.
  preload: false,
  variable: "--font-amiri",
  fallback: ["Times New Roman", "serif"],
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  display: "swap",
  // preload KAPALI: dort temanin da modulu derlemeye giriyor; acik
  // birakilsaydi Next dordunun de dosyalarini <link rel=preload> ile
  // cagirirdi (olculdu: 46 on yukleme). Kapatilinca tarayici yalnizca
  // eslesen CSS kuralinin istedigi aileyi indiriyor.
  preload: false,
  variable: "--font-noto-arabic",
  fallback: ["Segoe UI", "Tahoma", "sans-serif"],
});

export const GECE_FONTLARI = [
  playfair.variable,
  inter.variable,
  amiri.variable,
  notoArabic.variable,
].join(" ");
