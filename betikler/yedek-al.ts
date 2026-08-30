/**
 * `data/menu.ts` içindeki menünün makine okunur yedeğini üretir.
 *
 * Taşımadan ÖNCE çalıştırılıyor: Firestore'a geçtikten sonra `data/menu.ts`
 * artık içeriğin kaynağı olmayacak, bu yüzden o günkü hâli hem `.ts` kopyası
 * hem de bu JSON olarak repoda kalıyor. Taşıma doğrulaması da bu dosyayla
 * karşılaştırma yapıyor.
 *
 * Çalıştırma:  npx tsx betikler/yedek-al.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { MENU } from "../data/menu";

const bugun = new Date().toISOString().slice(0, 10);
const hedef = `yedek/menu-${bugun}.json`;

mkdirSync("yedek", { recursive: true });

/** Sayımlar: yedeğin eksiksiz olduğunu tek bakışta göstermek için. */
const urunler = MENU.flatMap((k) => k.urunler);
const fiyatHucreleri = urunler.flatMap((u) => u.fiyatlar);

const ozet = {
  alindi: new Date().toISOString(),
  kategoriSayisi: MENU.length,
  urunSayisi: urunler.length,
  fiyatHucresiSayisi: fiyatHucreleri.length,
  dogrulanmamisFiyatSayisi: fiyatHucreleri.filter((f) => !f.dogrulandi).length,
  gorselliUrunSayisi: urunler.filter((u) => u.gorsel !== null).length,
};

writeFileSync(hedef, JSON.stringify({ ozet, menu: MENU }, null, 2), "utf8");

console.log(`Yedek yazildi: ${hedef}`);
console.table(ozet);
