/**
 * Doğrulama için geçici test hesapları açar ve siler.
 *
 * NEDEN: mekân sahibinin hesabının şifresi bende yok ve olmamalı. Girişi
 * uçtan uca sınamak için iki geçici hesap açılıyor:
 *
 *   panel-testi@huzurpide.test        -> yönetici (panele girebilmeli)
 *   panel-yetkisiz@huzurpide.test     -> yönetici DEĞİL (girememeli)
 *
 * İkincisi "giriş yapmak panele girmeye yetmiyor" kuralını kanıtlıyor.
 * Testler bitince `sil` ile ikisi de kaldırılıyor — sahibin hesabına
 * dokunulmuyor.
 *
 * Çalıştırma:  npx tsx betikler/test-hesaplari.ts ac|sil
 */
import { config } from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

config({ path: ".env.local" });

const YONETICI = "panel-testi@huzurpide.test";
const YETKISIZ = "panel-yetkisiz@huzurpide.test";
export const TEST_SIFRE = "Test-Huzur-2026!";

function baglan() {
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
}

async function hesapKur(eposta: string, yoneticiYap: boolean) {
  const kimlik = getAuth();
  const db = getFirestore();

  let uid: string;
  try {
    const mevcut = await kimlik.getUserByEmail(eposta);
    await kimlik.updateUser(mevcut.uid, { password: TEST_SIFRE });
    uid = mevcut.uid;
  } catch {
    const yeni = await kimlik.createUser({ email: eposta, password: TEST_SIFRE });
    uid = yeni.uid;
  }

  if (yoneticiYap) {
    await db.collection("yoneticiler").doc(uid).set({
      eposta,
      eklendi: new Date().toISOString(),
      test: true,
    });
  } else {
    await db.collection("yoneticiler").doc(uid).delete().catch(() => {});
  }
  console.log(`  ${eposta}  uid=${uid}  yonetici=${yoneticiYap}`);
}

async function hesapSil(eposta: string) {
  const kimlik = getAuth();
  const db = getFirestore();
  try {
    const k = await kimlik.getUserByEmail(eposta);
    await db.collection("yoneticiler").doc(k.uid).delete().catch(() => {});
    await kimlik.deleteUser(k.uid);
    console.log(`  silindi: ${eposta}`);
  } catch {
    console.log(`  zaten yok: ${eposta}`);
  }
}

async function main() {
  baglan();
  const komut = process.argv[2];

  if (komut === "ac") {
    console.log("Test hesaplari aciliyor:");
    await hesapKur(YONETICI, true);
    await hesapKur(YETKISIZ, false);
  } else if (komut === "sil") {
    console.log("Test hesaplari siliniyor:");
    await hesapSil(YONETICI);
    await hesapSil(YETKISIZ);
  } else {
    console.error("Kullanim: npx tsx betikler/test-hesaplari.ts ac|sil");
    process.exit(1);
  }

  const kalan = await getFirestore().collection("yoneticiler").get();
  console.log(`Yonetici sayisi: ${kalan.size}`);
  kalan.docs.forEach((d) => console.log(`  ${d.data().eposta}`));
}

main().catch((e) => {
  console.error("BASARISIZ:", e.message);
  process.exit(1);
});
