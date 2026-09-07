/**
 * Firestore'daki menünün tarih damgalı tam yedeğini alır.
 *
 * NEDEN AYRI BİR BETİK: `yedek-al.ts` yalnızca `data/menu.ts`'i yedekliyor.
 * O betik Firestore'a TAŞINMADAN önce yazılmıştı ve dosyanın kendisi o gün
 * içeriğin kaynağıydı. Aşama 17'den beri gerçek kaynak Firestore ve fiyatlar
 * panelden değiştirilebiliyor — yani iki taraf ayrışmış olabilir. Büyük bir
 * içerik değişikliğinden önce yedeklenmesi gereken taraf Firestore.
 *
 * Yazma YOK: yalnızca okuyup dosyaya döküyor.
 *
 * Çalıştırma:  npx tsx betikler/yedek-firestore.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { config } from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

config({ path: ".env.local" });

function baglan() {
  if (getApps().length === 0) {
    const ham = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!ham) throw new Error("FIREBASE_SERVICE_ACCOUNT yok (.env.local)");
    const h = JSON.parse(ham);
    initializeApp({
      credential: cert({
        projectId: h.project_id,
        clientEmail: h.client_email,
        privateKey: h.private_key.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

async function main() {
  const db = baglan();

  const [kategoriAnlik, urunAnlik, ayarAnlik] = await Promise.all([
    db.collection("kategoriler").get(),
    db.collection("urunler").get(),
    db.collection("ayarlar").doc("genel").get(),
  ]);

  const kategoriler = kategoriAnlik.docs
    .map((d) => ({ _id: d.id, ...d.data() }))
    .sort((a, b) => (a as { sira?: number }).sira! - (b as { sira?: number }).sira!);

  const urunler = urunAnlik.docs
    .map((d) => ({ _id: d.id, ...d.data() }))
    .sort((a, b) => {
      const x = a as { kategoriSlug?: string; sira?: number };
      const y = b as { kategoriSlug?: string; sira?: number };
      return x.kategoriSlug! === y.kategoriSlug!
        ? x.sira! - y.sira!
        : x.kategoriSlug!.localeCompare(y.kategoriSlug!);
    });

  const fiyatlar = urunler.flatMap(
    (u) => (u as { fiyatlar?: unknown[] }).fiyatlar ?? [],
  ) as { dogrulandi?: boolean }[];

  const yedek = {
    alindi: new Date().toISOString(),
    kaynak: "firestore",
    ozet: {
      kategoriSayisi: kategoriler.length,
      urunSayisi: urunler.length,
      fiyatHucresiSayisi: fiyatlar.length,
      dogrulanmamisFiyatSayisi: fiyatlar.filter((f) => f.dogrulandi === false).length,
      gorselliUrunSayisi: urunler.filter((u) => (u as { gorsel?: unknown }).gorsel).length,
    },
    ayarlar: ayarAnlik.exists ? ayarAnlik.data() : null,
    kategoriler,
    urunler,
  };

  const bugun = new Date().toISOString().slice(0, 10);
  const hedef = `yedek/firestore-${bugun}.json`;
  mkdirSync("yedek", { recursive: true });
  writeFileSync(hedef, JSON.stringify(yedek, null, 2), "utf8");

  console.log(`Yedek yazildi: ${hedef}`);
  console.table(yedek.ozet);
}

main();
