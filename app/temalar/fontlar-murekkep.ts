import { Cairo, Noto_Kufi_Arabic, Oswald, Source_Sans_3 } from "next/font/google";

/**
 * Murekkep yazi tipleri — matbaa afisi dili.
 *
 * Kapsamlar dogrulandi:
 *   Oswald            latin, latin-ext, cyrillic, cyrillic-ext
 *   Source Sans 3     latin, latin-ext, cyrillic, cyrillic-ext
 *   Cairo             latin, latin-ext, arabic
 *   Noto Kufi Arabic  latin, latin-ext, arabic
 */

const oswald = Oswald({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-oswald",
  fallback: ["Arial Narrow", "sans-serif"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-source-sans",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-cairo",
  fallback: ["Tahoma", "sans-serif"],
});

const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-noto-kufi",
  fallback: ["Segoe UI", "Tahoma", "sans-serif"],
});

export const MUREKKEP_FONTLARI = [
  oswald.variable,
  sourceSans.variable,
  cairo.variable,
  notoKufi.variable,
].join(" ");
