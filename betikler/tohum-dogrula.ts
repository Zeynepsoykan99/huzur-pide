/**
 * Taşımanın eksiksiz olduğunu kanıtlar.
 *
 * Firestore'dan geri okuyup `data/menu.ts` ile ALAN ALAN karşılaştırır:
 * kategori sayısı, ürün sayısı, her ürünün dört dildeki adı ve açıklaması,
 * bütün fiyat hücreleri ve `dogrulandi` işaretleri, görsel bilgileri.
 *
 * Tek bir fark bile çıkarsa çıkış kodu 1 — taşıma başarısız sayılır.
 * "Sayılar tuttu" yetmiyor; her alanın değeri karşılaştırılıyor.
 *
 * Çalıştırma:  npx tsx betikler/tohum-dogrula.ts
 */
import { config } from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { MENU } from "../data/menu";

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

/** Derin karşılaştırma — sıralamayı da içerir (fiyat dizisi sıralı). */
function ayni(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function main() {
  const db = baglan();
  const farklar: string[] = [];

  const kategoriAnlik = await db.collection("kategoriler").get();
  const urunAnlik = await db.collection("urunler").get();

  const beklenenUrunler = MENU.flatMap((k) => k.urunler);

  if (kategoriAnlik.size !== MENU.length) {
    farklar.push(`kategori sayisi: ${kategoriAnlik.size} != ${MENU.length}`);
  }
  if (urunAnlik.size !== beklenenUrunler.length) {
    farklar.push(`urun sayisi: ${urunAnlik.size} != ${beklenenUrunler.length}`);
  }

  // --- Kategoriler ---
  for (const [sira, kategori] of MENU.entries()) {
    const belge = kategoriAnlik.docs.find((d) => d.id === kategori.slug);
    if (!belge) {
      farklar.push(`kategori eksik: ${kategori.slug}`);
      continue;
    }
    const v = belge.data();
    if (!ayni(v.ad, kategori.ad)) farklar.push(`${kategori.slug}: ad farkli`);
    if (!ayni(v.sutunlar, kategori.sutunlar)) {
      farklar.push(`${kategori.slug}: sutunlar farkli`);
    }
    if (v.sira !== sira) farklar.push(`${kategori.slug}: sira ${v.sira} != ${sira}`);
  }

  // --- Ürünler ---
  let dogrulanmamis = 0;
  for (const kategori of MENU) {
    for (const [urunSira, urun] of kategori.urunler.entries()) {
      const belge = urunAnlik.docs.find((d) => d.id === urun.id);
      if (!belge) {
        farklar.push(`urun eksik: ${urun.id}`);
        continue;
      }
      const v = belge.data();
      if (v.kategoriSlug !== kategori.slug) {
        farklar.push(`${urun.id}: kategoriSlug ${v.kategoriSlug} != ${kategori.slug}`);
      }
      if (v.sira !== urunSira) farklar.push(`${urun.id}: sira farkli`);
      if (!ayni(v.ad, urun.ad)) farklar.push(`${urun.id}: ad farkli`);
      if (!ayni(v.icerik, urun.icerik)) farklar.push(`${urun.id}: icerik farkli`);
      if (!ayni(v.gorsel, urun.gorsel)) farklar.push(`${urun.id}: gorsel farkli`);
      if (!ayni(v.fiyatlar, urun.fiyatlar)) farklar.push(`${urun.id}: fiyatlar farkli`);
    }
  }

  for (const belge of urunAnlik.docs) {
    const fiyatlar = belge.data().fiyatlar as { dogrulandi: boolean }[];
    dogrulanmamis += fiyatlar.filter((f) => !f.dogrulandi).length;
  }

  const beklenenDogrulanmamis = beklenenUrunler
    .flatMap((u) => u.fiyatlar)
    .filter((f) => !f.dogrulandi).length;

  if (dogrulanmamis !== beklenenDogrulanmamis) {
    farklar.push(
      `teyit edilmemis fiyat: ${dogrulanmamis} != ${beklenenDogrulanmamis}`,
    );
  }

  // --- Ayarlar ---
  const ayar = await db.collection("ayarlar").doc("genel").get();
  if (!ayar.exists) farklar.push("ayarlar/genel yok");

  console.table({
    kategori: `${kategoriAnlik.size} / ${MENU.length}`,
    urun: `${urunAnlik.size} / ${beklenenUrunler.length}`,
    teyitEdilmemisFiyat: `${dogrulanmamis} / ${beklenenDogrulanmamis}`,
    tema: ayar.exists ? ayar.data()?.tema : "-",
  });

  if (farklar.length > 0) {
    console.error(`\nTASIMA BASARISIZ — ${farklar.length} fark:`);
    farklar.forEach((f) => console.error("  - " + f));
    process.exit(1);
  }
  console.log("\nTASIMA DOGRULANDI — hicbir alanda fark yok.");
}

main().catch((e) => {
  console.error("DOGRULAMA CALISTIRILAMADI:", e.message);
  process.exit(1);
});
