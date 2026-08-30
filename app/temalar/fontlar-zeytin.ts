import { Lora, Noto_Naskh_Arabic, Noto_Sans_Arabic, Nunito_Sans } from "next/font/google";

/**
 * Zeytin yazi tipleri — bahce ve sofra dili.
 *
 * Kapsamlar dogrulandi:
 *   Lora              latin, latin-ext, cyrillic, cyrillic-ext
 *   Nunito Sans       latin, latin-ext, cyrillic, cyrillic-ext
 *   Noto Naskh Arabic latin, latin-ext, arabic
 *   Noto Sans Arabic  latin, latin-ext, arabic
 *
 * Noto Sans Arabic Gece temasiyla paylasiliyor: ayni aileyi iki temada
 * kullanmak sorun degil, next/font tekilleştiriyor.
 */

const lora = Lora({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-lora",
  fallback: ["Georgia", "Cambria", "serif"],
});

const nunito = Nunito_Sans({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-nunito",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-naskh",
  fallback: ["Times New Roman", "serif"],
});

const notoArabicZ = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-noto-arabic",
  fallback: ["Segoe UI", "Tahoma", "sans-serif"],
});

export const ZEYTIN_FONTLARI = [
  lora.variable,
  nunito.variable,
  naskh.variable,
  notoArabicZ.variable,
].join(" ");
