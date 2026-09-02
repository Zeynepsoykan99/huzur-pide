/**
 * Firestore'daki ürünlerin YALNIZCA `gorsel` alanını `data/menu.ts` ile eşitler.
 *
 * Neden ayrı bir betik: `tohum.ts` menünün tamamını yazıyor (ad, içerik, bütün
 * fiyat hücreleri, kategori sırası). Panelden yapılmış bir fiyat düzeltmesi
 * varsa onu geri alırdı. Bu betik `update()` ile tek alana dokunuyor, belgenin
 * geri kalanı elinin değmediği yerde kalıyor.
 *
 * Storage kurulana kadar fotoğraflar proje dosyası olarak ekleniyor; yeni bir
 * fotoğraf geldiğinde `data/menu.ts` doldurulup bu betik çalıştırılıyor.
 *
 * Önce ne yapacağını yazar, sonra yapar. Fark yoksa hiçbir yazma yapmaz.
 *
 * Çalıştırma:  npx tsx betikler/gorsel-guncelle.ts
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
        privateKey: h.private_key.replace(/\n/g, "\n"),
      }),
    });
  }
  return getFirestore();
}

async function main() {
  const db = baglan();
  const degisecek: { id: string; eski: string; yeni: string }[] = [];

  for (const kategori of MENU) {
    for (const urun of kategori.urunler) {
      const belge = await db.collection("urunler").doc(urun.id).get();
      if (!belge.exists) throw new Error(`Firestore'da yok: ${urun.id}`);
      const eski = belge.data()?.gorsel ?? null;
      if (JSON.stringify(eski) !== JSON.stringify(urun.gorsel)) {
        degisecek.push({
          id: urun.id,
          eski: eski ? eski.src : "yok",
          yeni: urun.gorsel ? urun.gorsel.src : "yok",
        });
      }
    }
  }

  if (degisecek.length === 0) {
    console.log("Fark yok — Firestore zaten guncel, hicbir yazma yapilmadi.");
    return;
  }

  console.log("Degisecek gorsel alanlari:");
  console.table(degisecek);

  const toplu = db.batch();
  for (const { id } of degisecek) {
    const urun = MENU.flatMap((k) => k.urunler).find((u) => u.id === id)!;
    // update(): yalnizca bu alan yaziliyor, belgenin geri kalani korunuyor.
    toplu.update(db.collection("urunler").doc(id), { gorsel: urun.gorsel });
  }
  await toplu.commit();

  console.log(`${degisecek.length} urunun gorsel alani guncellendi.`);
  console.log("Simdi dogrulama: npx tsx betikler/tohum-dogrula.ts");
}

main().catch((e) => {
  console.error("GUNCELLEME BASARISIZ:", e.message);
  process.exit(1);
});
