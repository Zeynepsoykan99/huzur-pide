/**
 * Güvenlik kurallarının GERÇEKTEN çalıştığını kanıtlar.
 *
 * "Kuralları yükledim" demek yetmiyor: burada istemci SDK'sı ile —
 * yani mekân sahibinin tarayıcısındaki koşullarda — okuma ve yazma
 * deneniyor. Beklenen:
 *
 *   okuma  -> BAŞARILI  (menü zaten herkese açık)
 *   yazma  -> REDDEDİLİR (permission-denied)
 *
 * Yazma denemesi başarılı olursa test başarısız sayılıyor: o durumda
 * herhangi biri menüyü değiştirebilirdi.
 *
 * Çalıştırma:  node betikler/kural-testi.mjs
 */
import { config } from "dotenv";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";

config({ path: ".env.local" });

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});
const db = getFirestore(app);

const sonuclar = [];

/** Okuma serbest olmalı. */
try {
  const anlik = await getDocs(collection(db, "urunler"));
  sonuclar.push({
    deneme: "istemciden urun okuma",
    beklenen: "izin verilir",
    sonuc: `${anlik.size} belge okundu`,
    gecti: anlik.size > 0,
  });
} catch (e) {
  sonuclar.push({
    deneme: "istemciden urun okuma",
    beklenen: "izin verilir",
    sonuc: `HATA: ${e.code}`,
    gecti: false,
  });
}

/** Yazma denemeleri — hepsi reddedilmeli. */
const yazmaDenemeleri = [
  ["urunler", "kural-testi-sahte", { ad: { tr: "sahte" } }],
  ["ayarlar", "genel", { tema: "gece" }],
  ["kategoriler", "kural-testi-sahte", { slug: "sahte" }],
  ["yoneticiler", "kural-testi-sahte", { eposta: "sahte@example.com" }],
];

for (const [koleksiyon, belge, veri] of yazmaDenemeleri) {
  try {
    await setDoc(doc(db, koleksiyon, belge), veri);
    sonuclar.push({
      deneme: `istemciden ${koleksiyon} yazma`,
      beklenen: "REDDEDILIR",
      sonuc: "YAZILDI (!)",
      gecti: false,
    });
  } catch (e) {
    sonuclar.push({
      deneme: `istemciden ${koleksiyon} yazma`,
      beklenen: "REDDEDILIR",
      sonuc: e.code,
      gecti: e.code === "permission-denied",
    });
  }
}

/** Yönetici listesi istemciye hiç açılmamalı. */
try {
  await getDocs(collection(db, "yoneticiler"));
  sonuclar.push({
    deneme: "istemciden yoneticiler okuma",
    beklenen: "REDDEDILIR",
    sonuc: "OKUNDU (!)",
    gecti: false,
  });
} catch (e) {
  sonuclar.push({
    deneme: "istemciden yoneticiler okuma",
    beklenen: "REDDEDILIR",
    sonuc: e.code,
    gecti: e.code === "permission-denied",
  });
}

console.table(sonuclar);

const kalan = sonuclar.filter((s) => !s.gecti);
if (kalan.length > 0) {
  console.error(`\nKURAL TESTI BASARISIZ — ${kalan.length} deneme beklendigi gibi bitmedi.`);
  process.exit(1);
}
console.log("\nKURAL TESTI GECTI: okuma serbest, her turlu istemci yazmasi reddedildi.");
process.exit(0);
