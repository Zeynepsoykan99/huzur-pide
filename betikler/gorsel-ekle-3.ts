/**
 * Üçüncü parti ürün fotoğrafları: Menemen ve Gazoz (Aşama 41).
 *
 * Ayar önceki partilerle AYNI: kare, webp kalite 82, 384×384, büyütme yok.
 *
 * MENEMEN — DÖRDÜNCÜ DENEME, KORUMALI.
 *   Önceki üç dosya bozuktu ve aynı bozuk dosyanın kopyalarıydı (MD5
 *   9b882a89…; 800×600 bilgisi taşıyıp 62 KB'ta kesiliyordu). Bu betik
 *   işlemeden ÖNCE:
 *     - dosyanın MD5'ini bilinen bozuk listeyle karşılaştırıyor,
 *     - pikselleri en katı modda (`failOn: "warning"`) sonuna kadar çözüyor,
 *     - JPEG ise bitiş işaretinin (FF D9) yerinde olduğuna bakıyor.
 *   Biri tutmazsa HİÇBİR ŞEY YAZMADAN duruyor.
 *   Gelen dosyanın adı `menemenson` idi (uzantısız, içeriği JPEG); `.jpg`
 *   eklendi.
 *
 * GAZOZ — ÖZEL KADRAJ (onaylandı).
 *   Kaynak 283×581 bir ekran görüntüsü: şişe saf beyaz bir iç panelde,
 *   çevresinde çok açık mavimsi bir kenar (#f7fbfc) ve soluk bir çerçeve
 *   çizgisi var. Merkezden kare kırpma şişenin tepesini ve dibini keserdi.
 *   Bunun yerine iç panel alınıyor (x 16–235, y 10–559; şişenin kapladığı
 *   kutu x 59–201, y 32–538, tamamen içeride), iki yana SAF BEYAZ eklenip
 *   550×550 kare yapılıyor ve 384'e KÜÇÜLTÜLÜYOR. Şişenin tamamı, diğer
 *   içecekler gibi beyaz zeminde görünüyor.
 *
 * BU PARTİDE İŞLENMEYEN
 *   karısıkpideson.jpg  Kuşbaşılı Kaşarlı'nın mevcut fotoğrafının küçük
 *                       kopyası (ortalama fark 5,3/255). Sahibinin kararıyla
 *                       Karışık fotoğrafsız kaldı; yeni dosya bekleniyor.
 *
 * Çalıştırma:  npx tsx betikler/gorsel-ekle-3.ts
 * Sonra:       data/menu.ts → npx tsx betikler/gorsel-guncelle.ts → derleme
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const KALITE = 82;
const HEDEF = 384;

/** Menemen için daha önce gelmiş bozuk dosyaların MD5'i. */
const BILINEN_BOZUK_MD5 = new Set(["9b882a89ac43318d019dd20fd0929275"]);

async function saglamMi(yol: string): Promise<void> {
  const ham = readFileSync(yol);
  const md5 = createHash("md5").update(ham).digest("hex");
  if (BILINEN_BOZUK_MD5.has(md5)) {
    throw new Error(`${yol}: bilinen BOZUK dosyanin kopyasi (MD5 ${md5})`);
  }
  const bilgi = await sharp(yol).metadata();
  if (bilgi.format === "jpeg" && !(ham.at(-2) === 0xff && ham.at(-1) === 0xd9)) {
    throw new Error(`${yol}: JPEG bitis isareti yok, dosya kesik`);
  }
  // Katı çözme: ilk uyarıda hata. Pikseller sonuna kadar okunamazsa burada durur.
  const { info, data } = await sharp(yol, { failOn: "warning" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const beklenen = info.width * info.height * info.channels;
  if (data.length !== beklenen) {
    throw new Error(`${yol}: piksel verisi eksik (${data.length} / ${beklenen})`);
  }
  console.log(
    `  saglam: ${yol} — ${bilgi.format} ${info.width}x${info.height}, ` +
      `MD5 ${md5.slice(0, 8)}…, ${ham.length} bayt`,
  );
}

async function menemen(): Promise<Buffer> {
  const kaynak = "yeni-gorseller/menemenson.jpg";
  await saglamMi(kaynak);
  // 800x600: merkezden 600x600 kare, 384'e küçültme.
  return sharp(kaynak)
    .resize(HEDEF, HEDEF, { fit: "cover", position: "centre" })
    .webp({ quality: KALITE })
    .toBuffer();
}

async function gazoz(): Promise<Buffer> {
  const kaynak = "yeni-gorseller/gazozson.jpg";
  await saglamMi(kaynak);
  const ic = { left: 16, top: 10, width: 220, height: 550 };
  const panel = await sharp(kaynak).extract(ic).toBuffer();
  const yan = (ic.height - ic.width) / 2; // 165 + 165 → 550x550
  const kare = await sharp(panel)
    .extend({ left: yan, right: yan, top: 0, bottom: 0, background: "#ffffff" })
    .toBuffer();
  return sharp(kare).resize(HEDEF, HEDEF).webp({ quality: KALITE }).toBuffer();
}

async function main() {
  const isler: [string, () => Promise<Buffer>][] = [
    ["menemen", menemen],
    ["gazoz", gazoz],
  ];
  console.log(`${isler.length} dosya isleniyor (kare ${HEDEF}, webp q${KALITE})\n`);

  // Önce İKİSİ de hazırlanıyor; biri başarısızsa hiçbir dosya yazılmıyor.
  const ciktilar: [string, Buffer][] = [];
  for (const [id, hazirla] of isler) ciktilar.push([id, await hazirla()]);

  for (const [id, cikti] of ciktilar) {
    const hedefYol = `public/urunler/${id}.webp`;
    if (existsSync(hedefYol)) throw new Error(`${hedefYol} zaten var, ustune yazilmadi`);
    writeFileSync(hedefYol, cikti);
    const m = await sharp(cikti).metadata();
    console.log(`  ${id.padEnd(8)} -> ${hedefYol} ${m.width}x${m.height} ${cikti.length} bayt`);
  }

  console.log(`\nBitti. Simdi: data/menu.ts, sonra gorsel-guncelle.ts, sonra derleme.`);
  console.log(`Islenmeyen: acik-karisik (gelen dosya Kusbasili Kasarli'nin kopyasi).`);
}

main().catch((e) => {
  console.error("BASARISIZ:", e.message);
  process.exit(1);
});
