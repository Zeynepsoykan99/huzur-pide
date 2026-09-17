/**
 * Menünün SON eksik fotoğrafı: Açık Pide · Karışık (Aşama 42).
 *
 * Ayar önceki partilerle AYNI: kare, 384×384, webp kalite 82, büyütme yok.
 *
 * KAYNAK: `yeni-gorseller/karışık pide son karar.jpg` — sahibin İndirilenler
 * klasöründeki `karısıkpidesonkarar.jpg`'nin birebir kopyası (MD5 50b8f1a0…).
 * JPEG, 750×752; merkezden 750×750 kare alınıp 384'e küçültülüyor.
 *
 * Tahtada dilimlenmiş, kıymalı ve sebzeli açık pide. Aşama 41'de reddedilen
 * dosyayla (Kuşbaşılı Kaşarlı'nın kopyası) aynı çekim düzeninden ama FARKLI
 * fotoğraf: menüdeki 60 fotoğrafın hiçbirine yakın değil (en yakın fark
 * 37,1/255; reddedilen kopyada 5,3 idi). Sahibi onayladı.
 *
 * KORUMA (işlemeden önce, biri tutmazsa hiçbir şey yazılmıyor):
 *   - bilinen kötü dosyaların MD5'i: bozuk Menemen dosyası ve reddedilen
 *     Karışık kopyası,
 *   - JPEG bitiş işareti (FF D9),
 *   - katı çözme (`failOn: "warning"`), piksel verisinin tamamı.
 *
 * Çalıştırma:  npx tsx betikler/gorsel-ekle-4.ts
 * Sonra:       data/menu.ts → npx tsx betikler/gorsel-guncelle.ts → derleme
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const KALITE = 82;
const HEDEF = 384;
const KAYNAK = "yeni-gorseller/karışık pide son karar.jpg";
const HEDEF_YOL = "public/urunler/acik-karisik.webp";

const KULLANILMAYACAK_MD5 = new Map([
  ["9b882a89ac43318d019dd20fd0929275", "bozuk Menemen dosyasi (Asama 34, 38)"],
  ["b38d0690da5d28f31032c469d689adc8", "Kusbasili Kasarli'nin kopyasi (Asama 41)"],
]);

async function main() {
  const ham = readFileSync(KAYNAK);
  const md5 = createHash("md5").update(ham).digest("hex");
  const neden = KULLANILMAYACAK_MD5.get(md5);
  if (neden) throw new Error(`${KAYNAK}: kullanilmayacak dosya — ${neden}`);

  const bilgi = await sharp(KAYNAK).metadata();
  if (bilgi.format !== "jpeg") throw new Error(`${KAYNAK}: beklenen JPEG, gelen ${bilgi.format}`);
  if (!(ham.at(-2) === 0xff && ham.at(-1) === 0xd9)) {
    throw new Error(`${KAYNAK}: JPEG bitis isareti yok, dosya kesik`);
  }
  const { info, data } = await sharp(KAYNAK, { failOn: "warning" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (data.length !== info.width * info.height * info.channels) {
    throw new Error(`${KAYNAK}: piksel verisi eksik`);
  }
  if (Math.min(info.width, info.height) < HEDEF) {
    throw new Error(`${KAYNAK}: kaynak ${HEDEF}px'e yetmiyor, buyutme yapilmaz`);
  }
  console.log(`  saglam: ${info.width}x${info.height}, MD5 ${md5.slice(0, 8)}…, ${ham.length} bayt`);

  if (existsSync(HEDEF_YOL)) throw new Error(`${HEDEF_YOL} zaten var, ustune yazilmadi`);

  const cikti = await sharp(KAYNAK)
    .resize(HEDEF, HEDEF, { fit: "cover", position: "centre" })
    .webp({ quality: KALITE })
    .toBuffer();
  writeFileSync(HEDEF_YOL, cikti);
  const m = await sharp(cikti).metadata();
  console.log(`  acik-karisik -> ${HEDEF_YOL} ${m.width}x${m.height} ${cikti.length} bayt`);
  console.log(`\nBitti. Simdi: data/menu.ts, sonra gorsel-guncelle.ts, sonra derleme.`);
}

main().catch((e) => {
  console.error("BASARISIZ:", e.message);
  process.exit(1);
});
