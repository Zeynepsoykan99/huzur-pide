/**
 * Ürün fotoğraflarını KARE (384×384) olarak yeniden üretir.
 *
 * Neden: fotoğraflar 800×450 (16:9) saklanıyordu ama menüdeki yuvaların
 * ikisi de KARE (`.gorsel-yuvasi` 4.25rem, `.pide-gorsel-hucre` 5rem).
 * `object-fit: cover` bu yüzden genişliğin %43,75'ini kesiyordu ve
 * tarayıcı `sizes="80px"` sözleşmesine göre GENİŞLİĞİ 80 piksel olan bir
 * aday indirdiğinden, kare yuvayı dolduracak YÜKSEKLİK hiç gelmiyordu:
 * DPR 3'te 256×144 inip 235 piksellik yuvaya 1,63 kat büyütülüyordu.
 * Bulanıklığın sebebi buydu.
 *
 * Kaynak kare olunca tarayıcının sözleşmesi doğruya dönüyor: 96×96 /
 * 256×256 iniyor ve tamamı kullanılıyor. Büyütme bitiyor.
 *
 * 384 keyfi değil: Next'in `imageSizes` dizisinin en büyük değeri (32, 48,
 * 64, 96, 128, 256, 384) ve 47 kaynağın hepsi bunu BÜYÜTMEDEN karşılıyor.
 * Yuva en fazla 80 CSS piksel; DPR 4'te bile 320 piksel isteniyor.
 *
 * KAYNAK SEÇİMİ dosya başına değişiyor:
 *   - Ham dosyası duran 27 fotoğraf  -> `yeni-gorseller/` içindeki orijinal.
 *     Böylece 800×450'ye çevrilirken kesilen üst/alt GERİ GELİYOR; 15'i
 *     zaten 1:1 olduğu için hiç kırpılmıyor.
 *   - Ham dosyası olmayan 20 fotoğraf -> `yedek/urunler-<tarih>/` içindeki
 *     800×450 nüsha. Yanları geri gelmiyor (orijinalleri yok), ama zaten
 *     bugün de görünmüyorlar; kazanç netlikte: 450 piksellik kaynak,
 *     240 piksellik ihtiyaç.
 *
 * Yedekten okumanın ikinci bir sebebi var: hedef yol `public/urunler/` ve
 * o 20 dosyada girdiyle çıktı AYNI dosya. Yerinde yazmak betiği tek
 * kullanımlık yapardı — ikinci çalıştırmada kendi çıktısını kaynak alırdı.
 *
 * Çalıştırma:  npx tsx betikler/gorsel-kare.ts
 * Sonra:       npx tsx betikler/gorsel-guncelle.ts   (Firestore)
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const HEDEF = 384;
const KALITE = 82;
const YEDEK = "yedek/urunler-2026-09-08";

/**
 * Merkezden kırpmanın ürünü kestiği fotoğraflarda pencerenin kayacağı yön.
 *
 * Boş bırakılan her fotoğraf MERKEZDEN kırpılıyor. Buraya yazılanlar
 * üretim sonrası gözle bakılıp tek tek kararlaştırıldı — otomatik
 * (`sharp.strategy.attention`) kırpma denendi ve GÜVENİLİR ÇIKMADI:
 * köfte fotoğrafında pencereyi salataya kaydırıp etin bir kısmını dışarıda
 * bıraktı, lahmacunda merkezden kötü sonuç verdi.
 *
 * Değerler `sharp`'ın konum sabitleri: "top" | "bottom" | "left" |
 * "right" | "centre" ve köşe birleşimleri ("right top" gibi).
 */
const KAYMA: Record<string, string> = {
  // Merkez, tabağın yarısını salataya ayırıp ETİ sağdan kesiyordu. Ürün
  // köfte; pencere sağa alınınca köfteler kadrajın çoğunu kaplıyor.
  "kofte-izgara-bucuk-porsiyon": "right",
  // `karisik-izgara` denendi ve MERKEZDE bırakıldı: sola alınca tabağın
  // sağ yarısı (salata) kesildi, yerine kadraja bulgur kâsesi ve çay
  // girdi. Merkez tabağın tamamını tutuyor.
};

/** [ham dosya adı, ürün kimliği] — `gorsel-isle.ts`'teki tablonun aynısı. */
function hamEslesme(): Map<string, string> {
  const kaynak = readFileSync("betikler/gorsel-isle.ts", "utf8");
  const harita = new Map<string, string>();
  for (const m of kaynak.matchAll(/\["([^"]+)",\s*"([^"]+)"\]/g)) {
    harita.set(m[2], m[1]);
  }
  return harita;
}

/** `data/menu.ts` içinde gerçekten kullanılan fotoğrafların kimlikleri. */
function menuKimlikleri(): string[] {
  const kaynak = readFileSync("data/menu.ts", "utf8");
  const bulunan = [...kaynak.matchAll(/\/urunler\/([^"]+)\.webp/g)].map((m) => m[1]);
  return [...new Set(bulunan)];
}

async function main() {
  const ham = hamEslesme();
  const idler = menuKimlikleri();

  if (!existsSync(YEDEK)) {
    console.error(`Yedek klasoru yok: ${YEDEK}`);
    console.error("Once mevcut fotograflar yedeklenmeli — bu betik uzerine yaziyor.");
    process.exit(1);
  }

  console.log(`${idler.length} fotograf ${HEDEF}x${HEDEF} webp q${KALITE} olarak uretiliyor\n`);

  let hamli = 0;
  let hamsiz = 0;
  const buyutulen: string[] = [];

  for (const id of idler) {
    const hamAd = ham.get(id);
    const hamYol = hamAd ? `yeni-gorseller/${hamAd}` : null;
    const hamVar = hamYol !== null && existsSync(hamYol);
    const kaynak = hamVar ? hamYol : `${YEDEK}/${id}.webp`;

    if (!existsSync(kaynak)) throw new Error(`Kaynak bulunamadi: ${kaynak}`);
    if (hamVar) hamli++;
    else hamsiz++;

    const bilgi = await sharp(kaynak).metadata();
    const kareKenar = Math.min(bilgi.width!, bilgi.height!);
    if (kareKenar < HEDEF) buyutulen.push(`${id} (${kareKenar}px)`);

    const konum = KAYMA[id] ?? "centre";
    const cikti = await sharp(kaynak)
      .resize(HEDEF, HEDEF, { fit: "cover", position: konum })
      .webp({ quality: KALITE })
      .toBuffer();

    writeFileSync(`public/urunler/${id}.webp`, cikti);

    console.log(
      `  ${id.padEnd(28)} ${(hamVar ? "ham" : "yedek").padEnd(6)} ` +
        `${String(bilgi.width).padStart(5)}x${String(bilgi.height).padEnd(5)} ` +
        `kare${String(kareKenar).padStart(5)} -> ${HEDEF}x${HEDEF} ` +
        `${String(Math.round(cikti.length / 1024)).padStart(3)}KB` +
        (konum === "centre" ? "" : `  [${konum}]`),
    );
  }

  console.log(`\nham kaynaktan: ${hamli}   yedekten: ${hamsiz}`);
  const kaymali = Object.keys(KAYMA).length;
  console.log(`merkezden kirpilan: ${idler.length - kaymali}   kaydirilan: ${kaymali}`);

  if (buyutulen.length) {
    // Buyutme bu asamanin cozdugu sorunun ta kendisiydi; sessizce
    // tekrarlanmasin diye betik burada duruyor.
    console.error(`\nBUYUTME GEREKTI (${HEDEF}px'ten kucuk kare):`);
    for (const b of buyutulen) console.error(`  ${b}`);
    process.exit(1);
  }
  console.log("Hicbir fotograf buyutulmedi.");
}

main().catch((e) => {
  console.error("BASARISIZ:", e.message);
  process.exit(1);
});
