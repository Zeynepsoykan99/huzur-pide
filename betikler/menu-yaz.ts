/**
 * `data/menu.ts` içindeki MENU'yü Firestore'a yazar ve ARTIK OLMAYANLARI SİLER.
 *
 * NEDEN `tohum.ts` DEĞİL — iki sebep, ikisi de veri kaybı:
 *
 * 1. `tohum.ts` SİLME YAPMIYOR. Yalnızca üzerine yazıyor. Menüden çıkan
 *    ürünler (Kuzu Izgara, Fanta, Komposto…) Firestore'da kalır ve müşteri
 *    menüsünde görünmeye devam ederdi.
 * 2. `tohum.ts` `ayarlar/genel` belgesini `{ tema: VARSAYILAN_TEMA }` ile
 *    EZİYOR. Mekân sahibinin panelden seçtiği tema ve üç temanın renk
 *    tercihleri silinirdi. Bu betik `ayarlar` koleksiyonuna hiç dokunmuyor.
 *
 * Önce ne yapacağını yazar, `--yaz` verilmedikçe hiçbir şey yazmaz.
 *
 * Çalıştırma:  npx tsx betikler/menu-yaz.ts          (kuru çalışma)
 *              npx tsx betikler/menu-yaz.ts --yaz    (gerçekten yaz)
 * Doğrulama:   npx tsx betikler/tohum-dogrula.ts
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

async function main() {
  const yaz = process.argv.includes("--yaz");
  const db = baglan();

  const [kategoriAnlik, urunAnlik] = await Promise.all([
    db.collection("kategoriler").get(),
    db.collection("urunler").get(),
  ]);

  const olmasiGerekenKategori = new Set(MENU.map((k) => k.slug));
  const olmasiGerekenUrun = new Set(MENU.flatMap((k) => k.urunler.map((u) => u.id)));

  const silinecekKategoriler = kategoriAnlik.docs.filter(
    (d) => !olmasiGerekenKategori.has(d.id),
  );
  const silinecekUrunler = urunAnlik.docs.filter((d) => !olmasiGerekenUrun.has(d.id));

  const mevcutUrun = new Set(urunAnlik.docs.map((d) => d.id));
  const yeniUrunler = [...olmasiGerekenUrun].filter((id) => !mevcutUrun.has(id));

  console.log(`Kategori:  ${kategoriAnlik.size} -> ${MENU.length}`);
  console.log(`Urun:      ${urunAnlik.size} -> ${olmasiGerekenUrun.size}`);
  console.log(`\nYENI URUN (${yeniUrunler.length}):`);
  console.log("  " + (yeniUrunler.join(", ") || "(yok)"));
  console.log(`\nSILINECEK URUN (${silinecekUrunler.length}):`);
  for (const d of silinecekUrunler) {
    const v = d.data();
    console.log(`  ${d.id.padEnd(24)} ${v.ad?.tr ?? "?"}  (${v.kategoriSlug})`);
  }
  console.log(`\nSILINECEK KATEGORI (${silinecekKategoriler.length}):`);
  console.log("  " + (silinecekKategoriler.map((d) => d.id).join(", ") || "(yok)"));

  if (!yaz) {
    console.log("\nKURU CALISMA — hicbir sey yazilmadi. Yazmak icin: --yaz");
    return;
  }

  const toplu = db.batch();
  let fiyatHucresi = 0;

  MENU.forEach((kategori, sira) => {
    toplu.set(db.collection("kategoriler").doc(kategori.slug), {
      slug: kategori.slug,
      ad: kategori.ad,
      sira,
      sutunlar: kategori.sutunlar,
    });

    kategori.urunler.forEach((urun, urunSira) => {
      toplu.set(db.collection("urunler").doc(urun.id), {
        id: urun.id,
        kategoriSlug: kategori.slug,
        sira: urunSira,
        ad: urun.ad,
        icerik: urun.icerik,
        gorsel: urun.gorsel,
        fiyatlar: urun.fiyatlar,
      });
      fiyatHucresi += urun.fiyatlar.length;
    });
  });

  for (const d of silinecekUrunler) toplu.delete(d.ref);
  for (const d of silinecekKategoriler) toplu.delete(d.ref);

  await toplu.commit();

  console.log("\nYAZILDI.");
  console.table({
    kategori: MENU.length,
    urun: olmasiGerekenUrun.size,
    fiyatHucresi,
    silinenUrun: silinecekUrunler.length,
    silinenKategori: silinecekKategoriler.length,
    ayarlaraDokunuldu: "hayir",
  });
  console.log("Dogrulama: npx tsx betikler/tohum-dogrula.ts");
}

main().catch((e) => {
  console.error("BASARISIZ:", e.message);
  process.exit(1);
});
