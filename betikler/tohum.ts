/**
 * `data/menu.ts` içindeki menüyü Firestore'a taşır.
 *
 * TEK SEFERLİK — ama idempotent: belge kimlikleri mevcut `slug` ve `id`
 * değerleri olduğu için iki kez çalıştırılsa kopya oluşmuyor, aynı belgeler
 * üzerine yazılıyor.
 *
 * Taşınanlar aynen korunuyor: dört dildeki adlar ve açıklamalar, bütün fiyat
 * hücreleri ve `dogrulandi` işaretleri, görsel bilgileri, kategori sırası.
 * Hiçbir alan yeniden yazılmıyor, uydurulmuyor.
 *
 * Çalıştırma:  npx tsx betikler/tohum.ts
 * Gerekli:     .env.local içinde FIREBASE_SERVICE_ACCOUNT ve
 *              NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 */
import { config } from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { MENU } from "../data/menu";
import { VARSAYILAN_TEMA } from "../data/tema";

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
  const toplu = db.batch();

  let kategoriSayisi = 0;
  let urunSayisi = 0;
  let fiyatHucresi = 0;

  MENU.forEach((kategori, sira) => {
    toplu.set(db.collection("kategoriler").doc(kategori.slug), {
      slug: kategori.slug,
      ad: kategori.ad,
      sira,
      sutunlar: kategori.sutunlar,
    });
    kategoriSayisi += 1;

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
      urunSayisi += 1;
      fiyatHucresi += urun.fiyatlar.length;
    });
  });

  // Aktif tema: bugünkü sabit değer taşınıyor.
  toplu.set(db.collection("ayarlar").doc("genel"), { tema: VARSAYILAN_TEMA });

  await toplu.commit();

  console.log("Firestore'a yazildi:");
  console.table({ kategoriSayisi, urunSayisi, fiyatHucresi, tema: VARSAYILAN_TEMA });
  console.log("Simdi dogrulama: npx tsx betikler/tohum-dogrula.ts");
}

main().catch((e) => {
  console.error("TOHUMLAMA BASARISIZ:", e.message);
  process.exit(1);
});
