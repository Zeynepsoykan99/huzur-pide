/**
 * İkinci parti ürün fotoğraflarını `public/urunler/` için hazırlar.
 *
 * Ayar Aşama 37'dekiyle AYNI: kare, webp kalite 82, `fit: cover`. Kare
 * olmasının sebebi menüdeki yuvaların kare olması; 16:9 saklamak hem
 * bulanıklık hem kırpma doğuruyordu (bkz. Aşama 35).
 *
 * Eşleştirme DOSYA ADINA DEĞİL, DOSYA İÇERİĞİNE bakılarak yapıldı: her
 * dosya açılıp ne olduğu görüldü, filigran ve başka işletme logosu
 * arandı. Aşağıdaki tablo o denetimin sonucu.
 *
 * BU PARTİDE İŞLENMEYENLER
 *   menemenn.avif  Bozuk. Eski `menemen.avif` ile MD5'i birebir aynı
 *                  (9b882a89...), yani yeni dosya değil kopyası.
 *                  Metadata okunuyor (800x600 heif) ama piksel
 *                  cozulemiyor: "bad seek to 62313", dosya 62.281 bayt.
 *                  Menemen fotografsiz kaliyor.
 *
 * Çalıştırma:  npx tsx betikler/gorsel-ekle-2.ts
 * Sonra:       npx tsx betikler/gorsel-guncelle.ts   (Firestore)
 */
import { existsSync, statSync } from "node:fs";
import sharp from "sharp";

const KALITE = 82;
const VARSAYILAN_HEDEF = 384;

type Is = {
  ham: string;
  id: string;
  /** Kırpma kutusu — filigran/logo temizliği için. Yoksa merkezden kare. */
  kirp?: { left: number; top: number; width: number; height: number };
  /** Hedef kenar. Kaynak 384'e yetmiyorsa BÜYÜTMEMEK için düşürülüyor. */
  hedef?: number;
  not: string;
};

const ISLER: Is[] = [
  {
    ham: "pepsi kola.webp",
    id: "kola",
    not: "Pepsi 250 ml kutu. MEVCUT fotografin (Coca-Cola) yerine geciyor. Urun ADI degismiyor: sahibi jenerik kalsin dedi, menude 'Kola/Cola/كولا/Кола' olarak duruyor.",
  },
  {
    ham: "dörtmevsimpide.png",
    id: "acik-dortmevsim",
    // 500x375: cikarilabilecek en buyuk kare 375. BUYUTMEMEK icin hedef 375.
    // Yuva en fazla 80 CSS piksel, DPR 4'te 320 istiyor; 375 fazlasiyla yetiyor.
    hedef: 375,
    not: "Dort bolmeli acik pide (sucuk / kavurma / kasar / pastirma), ahsap tahtada. Filigran yok.",
  },
  {
    ham: "spesiyalpide.jpg",
    id: "acik-spesiyal",
    // Ust ortada baska bir isletmenin "NOS" logosu (y 0-35) ve gorselin
    // cevresinde altin tanitim cercevesi vardi; kirpma ikisini de disarida
    // birakiyor. Pide/pizza ayrimi sahibine soruldu, bu haliyle kullanilmasina
    // KARAR VERILDI (fotografta yuvarlak pizza var, acik pide degil).
    kirp: { left: 40, top: 45, width: 890, height: 890 },
    not: "Yuvarlak pizza. Logo ve cerceve kirpildi.",
  },
  {
    ham: "kuymakk.jpg",
    id: "kuymak",
    // Sol ALTTA yari saydam filigran vardi (y ~1060-1160). Ust 1040 satirdan
    // kare alinca tamamen disarida kaliyor; kaynak yine hedefin 2,7 kati.
    kirp: { left: 80, top: 0, width: 1040, height: 1040 },
    not: "Bakir sahandan cekilen kuymak. Filigran kirpildi.",
  },
  { ham: "meyve suyu.jpg", id: "meyve-suyu", not: "Tamek Seftali Nektari kutusu." },
  { ham: "sade soda.png", id: "sade-soda", not: "Inisdibi dogal mineralli su sisesi." },
  { ham: "meyveli soda.jpg", id: "meyveli-soda", not: "Fresa elmali soda sisesi." },
];

async function main() {
  const eksik = ISLER.filter((i) => !existsSync(`yeni-gorseller/${i.ham}`));
  if (eksik.length) {
    console.error("Bulunamayan ham dosyalar:");
    for (const e of eksik) console.error(`  ${e.ham}`);
    process.exit(1);
  }

  const kimlikler = ISLER.map((i) => i.id);
  const tekrar = kimlikler.filter((x, i) => kimlikler.indexOf(x) !== i);
  if (tekrar.length) {
    console.error("Ayni kimlige birden fazla dosya:", tekrar);
    process.exit(1);
  }

  console.log(`${ISLER.length} dosya isleniyor (kare, webp q${KALITE})\n`);

  for (const is of ISLER) {
    const kaynak = `yeni-gorseller/${is.ham}`;
    const hedefYol = `public/urunler/${is.id}.webp`;
    const vardi = existsSync(hedefYol);

    const bilgi = await sharp(kaynak).metadata();
    let boru = sharp(kaynak);
    if (is.kirp) boru = boru.extract(is.kirp);

    // Kirpma sonrasi elde kalan kare kenar
    const kareKenar = is.kirp
      ? Math.min(is.kirp.width, is.kirp.height)
      : Math.min(bilgi.width!, bilgi.height!);
    const hedef = is.hedef ?? VARSAYILAN_HEDEF;

    if (kareKenar < hedef) {
      // Buyutme Asama 35'te cozulen sorunun ta kendisiydi; sessizce
      // tekrarlanmasin diye betik burada duruyor.
      console.error(
        `BUYUTME GEREKIR: ${is.id} — kaynak kare ${kareKenar}px, hedef ${hedef}px`,
      );
      process.exit(1);
    }

    const cikti = await boru
      .resize(hedef, hedef, { fit: "cover", position: "centre" })
      .webp({ quality: KALITE })
      .toBuffer();

    const { writeFileSync } = await import("node:fs");
    writeFileSync(hedefYol, cikti);

    console.log(
      `  ${is.id.padEnd(18)} ${String(bilgi.format).padEnd(5)} ` +
        `${String(bilgi.width).padStart(5)}x${String(bilgi.height).padEnd(5)}` +
        `${is.kirp ? " kirpildi" : "         "} kare${String(kareKenar).padStart(5)} -> ` +
        `${hedef}x${hedef} ${String(Math.round(cikti.length / 1024)).padStart(3)}KB` +
        (vardi ? "  (mevcut fotografin yerine)" : ""),
    );
  }

  console.log(`\nBitti. Simdi: data/menu.ts, sonra gorsel-guncelle.ts, sonra derleme.`);
  console.log(`Islenmeyen: menemen (dosya bozuk), acik-karisik ve gazoz (dosya yok).`);
  void statSync;
}

main().catch((e) => {
  console.error("BASARISIZ:", e.message);
  process.exit(1);
});
