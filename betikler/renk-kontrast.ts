/**
 * Paletteki her rengin WCAG AA'yı geçtiğini doğrular.
 *
 * NEDEN VAR: `data/renkler.ts` içindeki palet, "AA garantisi listenin
 * kendisinde" varsayımına dayanıyor. O varsayım ancak listeye ölçülmemiş
 * bir renk girmediği sürece doğru. Bu betik listeyi ölçüp geçmeyeni
 * söylüyor; palete renk ekleyen herkes çalıştırmalı.
 *
 * ÖLÇÜLEN YERLER — rengin gerçekte indiği zeminler:
 *   vurgu, METİN olarak    → sayfa zemini, yüzey, levha zemini üstünde (4,5:1)
 *   vurgu, ZEMİN olarak    → üstündeki `--t-yuzey` yazıyla (4,5:1)
 *                             (`.dil-secenek-aktif`, menü üst şeridi)
 *   vurgu, odak halkası    → sayfa zemini ve yüzey üstünde (3:1, metin değil)
 *   fiyat, METİN olarak    → yüzey ve levha zemini üstünde (4,5:1)
 *
 * Levha zemini bir tema değişkeninden geliyor ve Çini'de yarı saydam
 * (`color-mix(in srgb, var(--t-yuzey) 86%, transparent)`); o yüzden burada
 * yüzey ile sayfa zemininin karışımı olarak hesaplanıyor. Diğer iki temada
 * `transparent`, yani doğrudan sayfa zemini.
 *
 * Çalıştırma:  npx tsx betikler/renk-kontrast.ts
 */
import { readFileSync } from "node:fs";
import { SECILEBILIR_TEMALAR, type SecilebilirTema } from "../data/tema";
import { FIYAT_PALETI, VURGU_PALETI, type RenkSecenegi } from "../data/renkler";

/**
 * Zeminler `temalar.css`ten OKUNUYOR, buraya kopyalanmıyor.
 *
 * Kopyalansaydı bir temanın zemini değiştiğinde bu betik eski değerle
 * ölçmeye devam eder, "geçti" derken aslında geçmeyen bir rengi onaylardı.
 * Sessiz kayma, ölçüm betiğinde en kötü hata türü.
 */
type Zeminler = { zemin: string; yuzey: string; levhaKarisimi: number | null };

function temaZeminleri(): Record<SecilebilirTema, Zeminler> {
  const css = readFileSync("app/temalar/temalar.css", "utf8");
  const sonuc = {} as Record<SecilebilirTema, Zeminler>;

  for (const tema of SECILEBILIR_TEMALAR) {
    const blok = css.match(
      new RegExp(String.raw`\.tema-${tema}\s*\{([^}]*)\}`),
    );
    if (!blok) throw new Error(`temalar.css içinde .tema-${tema} bloğu yok.`);
    const govde = blok[1];

    const al = (ad: string) => {
      const m = govde.match(new RegExp(String.raw`--t-${ad}:\s*([^;]+);`));
      if (!m) throw new Error(`.tema-${tema} içinde --t-${ad} yok.`);
      return m[1].trim();
    };

    const zemin = al("zemin");
    const yuzey = al("yuzey");

    // Levha zemini iki şekilde yazılıyor: `transparent` (levha doğrudan
    // sayfa zemininde) ya da yüzeyin bir yüzdesiyle karışım.
    const levhaHam = al("levha-zemin");
    let levhaKarisimi: number | null = null;
    if (levhaHam !== "transparent") {
      const m = levhaHam.match(/var\(--t-yuzey\)\s+(\d+)%/);
      if (!m) {
        throw new Error(
          `.tema-${tema} içindeki --t-levha-zemin çözülemedi: ${levhaHam}. ` +
            `Betik ya \`transparent\` ya da \`... var(--t-yuzey) N%, transparent\` bekliyor.`,
        );
      }
      levhaKarisimi = Number(m[1]) / 100;
    }

    if (!/^#[0-9a-fA-F]{6}$/.test(zemin) || !/^#[0-9a-fA-F]{6}$/.test(yuzey)) {
      throw new Error(`.tema-${tema} zemin/yüzey altı haneli hex değil.`);
    }
    sonuc[tema] = { zemin, yuzey, levhaKarisimi };
  }
  return sonuc;
}

const ZEMINLER = temaZeminleri();

type Rgb = [number, number, number];

function coz(hex: string): Rgb {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** İki rengi opaklığa göre karıştırır — yarı saydam levha zemini için. */
function karistir(ust: Rgb, alt: Rgb, oran: number): Rgb {
  return [0, 1, 2].map((i) =>
    Math.round(ust[i] * oran + alt[i] * (1 - oran)),
  ) as Rgb;
}

/** sRGB -> doğrusal ışık. WCAG 2.1'in tanımı. */
function dogrusal(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function parlaklik([r, g, b]: Rgb): number {
  return 0.2126 * dogrusal(r) + 0.7152 * dogrusal(g) + 0.0722 * dogrusal(b);
}

function oran(a: Rgb, b: Rgb): number {
  const [x, y] = [parlaklik(a), parlaklik(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

type Olcum = { yer: string; esik: number; sonuc: number };

function vurguyuOlc(renk: RenkSecenegi, tema: SecilebilirTema): Olcum[] {
  const z = ZEMINLER[tema];
  const zemin = coz(z.zemin);
  const yuzey = coz(z.yuzey);
  const levha =
    z.levhaKarisimi === null ? zemin : karistir(yuzey, zemin, z.levhaKarisimi);
  const v = coz(renk.hex);

  return [
    { yer: "metin · sayfa zemini", esik: 4.5, sonuc: oran(v, zemin) },
    { yer: "metin · yüzey", esik: 4.5, sonuc: oran(v, yuzey) },
    { yer: "metin · levha", esik: 4.5, sonuc: oran(v, levha) },
    { yer: "zemin · üstünde yüzey yazı", esik: 4.5, sonuc: oran(yuzey, v) },
    { yer: "odak halkası · zemin", esik: 3, sonuc: oran(v, zemin) },
    { yer: "odak halkası · yüzey", esik: 3, sonuc: oran(v, yuzey) },
  ];
}

function fiyatiOlc(renk: RenkSecenegi, tema: SecilebilirTema): Olcum[] {
  const z = ZEMINLER[tema];
  const zemin = coz(z.zemin);
  const yuzey = coz(z.yuzey);
  const levha =
    z.levhaKarisimi === null ? zemin : karistir(yuzey, zemin, z.levhaKarisimi);
  const f = coz(renk.hex);

  return [
    { yer: "metin · yüzey", esik: 4.5, sonuc: oran(f, yuzey) },
    { yer: "metin · levha", esik: 4.5, sonuc: oran(f, levha) },
  ];
}

function main() {
  let kalan = 0;
  let toplam = 0;

  for (const tema of SECILEBILIR_TEMALAR) {
    console.log(`\n=== ${tema} ===`);

    for (const [baslik, liste, olc] of [
      ["VURGU", VURGU_PALETI[tema], vurguyuOlc],
      ["FİYAT", FIYAT_PALETI[tema], fiyatiOlc],
    ] as const) {
      console.log(`\n  ${baslik}`);
      for (const renk of liste) {
        toplam += 1;
        const olcumler = olc(renk, tema);
        const enDar = olcumler.reduce((a, b) =>
          b.sonuc / b.esik < a.sonuc / a.esik ? b : a,
        );
        const gecti = olcumler.every((o) => o.sonuc >= o.esik);
        if (!gecti) kalan += 1;
        console.log(
          `    ${renk.ad.padEnd(10)} ${renk.hex}  ` +
            `en dar: ${enDar.sonuc.toFixed(2)}:1 (eşik ${enDar.esik}, ${enDar.yer})  ` +
            (gecti ? "GEÇTİ" : "KALDI"),
        );
        if (!gecti) {
          for (const o of olcumler.filter((x) => x.sonuc < x.esik)) {
            console.log(
              `        ✗ ${o.yer}: ${o.sonuc.toFixed(2)}:1 < ${o.esik}:1`,
            );
          }
        }
      }
    }
  }

  console.log(`\n${toplam} renk ölçüldü, ${kalan} tanesi kaldı.`);
  if (kalan > 0) process.exitCode = 1;
}

main();
