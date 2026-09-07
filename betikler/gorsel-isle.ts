/**
 * Ham ürün fotoğraflarını `public/urunler/` için hazırlar.
 *
 * Ayar mevcut fotoğraflarla AYNI: 800×450, webp kalite 78, merkezden kırpma.
 * Böylece yeni gelenler eskilerin yanında aynı ölçüde ve aynı ağırlıkta
 * duruyor; `sizes` ve yuva ölçüleri değişmiyor.
 *
 * Eşleştirme DOSYA ADINA göre, aşağıdaki listede elle yapıldı — betik
 * tahmin yürütmüyor. Adı hangi ürüne ait olduğunu açıkça göstermeyen
 * dosyalar listeye alınmadı, sahibine soruldu.
 *
 * Çıktı adı ÜRÜN KİMLİĞİ: `ezogelin` -> `public/urunler/ezogelin.webp`.
 *
 * Çalıştırma:  npx tsx betikler/gorsel-isle.ts
 */
import { existsSync, mkdirSync } from "node:fs";
import sharp from "sharp";

/** [ham dosya, ürün kimliği] */
const ESLESME: [string, string][] = [
  // --- Çorbalar
  ["ezogelin.webp", "ezogelin"],
  ["Mercimek.jpg", "mercimek"],
  ["tavuksuyu.webp", "tavuksuyu"],
  ["kelle paça.webp", "kelle-paca"],

  // --- Kahvaltı
  ["tek kişilik kahvaltı.jpg", "tek-kisilik-kahvalti"],
  ["serpme kahvaltı iki kişilik.jpg", "serpme-kahvalti-2"],
  ["serpme kahvaltı 4 kişilik.jpg", "serpme-kahvalti-4"],
  // menemen.avif BOZUK: dosya 14.634 bayt ama bitstream 62.313. bayti
  // isaret ediyor ("bad seek to 62313"), yani kesik. Metadata okunuyor
  // (800x600 heif) ama pikseller cozulemiyor. Menemen fotografsiz kaldi,
  // sahibinden yeni dosya bekleniyor.
  ["sucuklu yumurta.jpg", "sucuklu-yumurta"],
  ["patatescips porsiyon.jpg", "patates-cips"],

  // --- Açık Pide
  ["kıymalı açık pide.webp", "acik-kiymali"],
  ["kuşbaşılı açık pide.jpg", "acik-kusbasili"],
  ["kuşbaşılı kaşarlı açık pide.jpg", "acik-kusbasi-kasar"],
  // Adında "açık pide" yazmıyordu; sahibine soruldu, Açık Pide'nin.
  ["kıyma kaşar.jpg", "acik-kiyma-kasar"],
  ["kaşarlı açık pide.jpg", "acik-kasarli"],
  ["pastırmalı açık pide.jpg", "acik-pastirmali"],
  // Uzantısız dosya; sharp içeriğinden biçimi kendisi anlıyor.
  ["kaşar sucuk açık pide", "acik-kasar-sucuk"],
  ["yağlı yumurtalı açık pide.webp", "acik-yagli-yumurtali"],

  // --- Tatlı
  ["künefe.webp", "kunefe"],

  // --- İçecekler
  ["kolaa.jpg", "kola"],
  ["yedigün.jpg", "yedigun"],
  ["lipton ice tea.jpg", "lipton-ice-tea"],
  ["ayrann.avif", "kucuk-ayran"],
  // Bu ikisi MEVCUT fotoğrafın yerine geçiyor (sahibi öyle istedi).
  ["büyük ayran.jpg", "buyuk-ayran"],
  ["su - Kopya.jpg", "su"],
  ["küçük çay.jpg", "kucuk-cay"],
  ["büyük çay.jpg", "buyuk-cay"],
  ["türk kahvesi.webp", "turk-kahvesi"],
];

async function main() {
  mkdirSync("public/urunler", { recursive: true });

  const eksik = ESLESME.filter(([ham]) => !existsSync(`yeni-gorseller/${ham}`));
  if (eksik.length) {
    console.error("Bulunamayan ham dosyalar:");
    for (const [ham] of eksik) console.error(`  ${ham}`);
    process.exit(1);
  }

  // Aynı kimliğe iki dosya yazılmasın.
  const kimlikler = ESLESME.map(([, id]) => id);
  const tekrar = kimlikler.filter((x, i) => kimlikler.indexOf(x) !== i);
  if (tekrar.length) {
    console.error("Ayni kimlige birden fazla dosya:", tekrar);
    process.exit(1);
  }

  console.log(`${ESLESME.length} dosya isleniyor (800x450 webp q78, merkezden kirpma)\n`);

  for (const [ham, id] of ESLESME) {
    const kaynak = `yeni-gorseller/${ham}`;
    const hedef = `public/urunler/${id}.webp`;
    const vardi = existsSync(hedef);

    const once = await sharp(kaynak).metadata();
    await sharp(kaynak)
      .resize(800, 450, { fit: "cover", position: "centre" })
      .webp({ quality: 78 })
      .toFile(hedef);
    const sonra = await sharp(hedef).metadata();

    console.log(
      `  ${id.padEnd(22)} ${String(once.format).padEnd(5)} ` +
        `${String(once.width).padStart(5)}x${String(once.height).padEnd(5)} -> ` +
        `${sonra.width}x${sonra.height}` +
        (vardi ? "  (mevcut fotografin yerine)" : ""),
    );
  }

  console.log(`\nBitti. Simdi: data/menu.ts guncellenmeli, sonra gorsel-guncelle.ts.`);
}

main().catch((e) => {
  console.error("BASARISIZ:", e.message);
  process.exit(1);
});
