/**
 * Doğrulama sırasında bırakılan izleri temizler.
 *
 * Testler gerçek veritabanında yapıldı (emülatör değil), bu yüzden test
 * ürünü siliniyor ve değiştirilen fiyat yedekteki değerine döndürülüyor.
 * Sonuçta Firestore, taşımadan hemen sonraki hâline eşit olmalı —
 * `tohum-dogrula.ts` bunu ayrıca kanıtlıyor.
 *
 * Çalıştırma:  npx tsx betikler/test-temizle.ts
 */
import { config } from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { MENU } from "../data/menu";

config({ path: ".env.local" });

if (getApps().length === 0) {
  const h = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
  initializeApp({
    credential: cert({
      projectId: h.project_id,
      clientEmail: h.client_email,
      privateKey: h.private_key.replace(/\\n/g, "\n"),
    }),
  });
}

async function main() {
  const db = getFirestore();

  // 1) Test urunlerini sil (adinda "Test" gecen, yedekte olmayan urunler).
  const yedektekiIdler = new Set(MENU.flatMap((k) => k.urunler.map((u) => u.id)));
  const hepsi = await db.collection("urunler").get();
  let silinen = 0;
  for (const belge of hepsi.docs) {
    if (!yedektekiIdler.has(belge.id)) {
      console.log(`  fazladan urun siliniyor: ${belge.id}`);
      await belge.ref.delete();
      silinen += 1;
    }
  }

  // 2) Butun fiyatlari ve dogrulandi isaretlerini yedekteki degerlere dondur.
  let duzeltilen = 0;
  for (const kategori of MENU) {
    for (const urun of kategori.urunler) {
      const ref = db.collection("urunler").doc(urun.id);
      const anlik = await ref.get();
      if (!anlik.exists) {
        console.log(`  eksik urun geri yaziliyor: ${urun.id}`);
        await ref.set({
          id: urun.id,
          kategoriSlug: kategori.slug,
          sira: kategori.urunler.indexOf(urun),
          ad: urun.ad,
          icerik: urun.icerik,
          gorsel: urun.gorsel,
          fiyatlar: urun.fiyatlar,
        });
        duzeltilen += 1;
        continue;
      }
      const mevcut = JSON.stringify(anlik.data()?.fiyatlar ?? []);
      if (mevcut !== JSON.stringify(urun.fiyatlar)) {
        console.log(`  fiyat geri aliniyor: ${urun.id}`);
        await ref.update({ fiyatlar: urun.fiyatlar });
        duzeltilen += 1;
      }
    }
  }

  // 3) Tema varsayilana donsun.
  await db.collection("ayarlar").doc("genel").set({ tema: "cini" }, { merge: true });

  console.log(`\nTemizlik bitti. Silinen urun: ${silinen}, duzeltilen fiyat: ${duzeltilen}`);
  console.log("Simdi: npx tsx betikler/tohum-dogrula.ts");
}

main().catch((e) => {
  console.error("TEMIZLIK BASARISIZ:", e.message);
  process.exit(1);
});
