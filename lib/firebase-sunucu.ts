import "server-only";
import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * Firebase Admin SDK — YALNIZCA sunucu tarafı.
 *
 * `server-only` ilk satırda: bu modül yanlışlıkla bir istemci bileşenine
 * import edilirse derleme hata veriyor. Servis hesabı anahtarı tarayıcıya
 * hiçbir koşulda gitmiyor.
 *
 * Admin SDK güvenlik kurallarının DIŞINDA çalışır — bu bilinçli: bütün
 * yazmalar buradan geçtiği için `firestore.rules` istemciye hiç yazma izni
 * vermiyor (bkz. o dosyanın başındaki not).
 *
 * ANAHTAR NEREDE: `FIREBASE_SERVICE_ACCOUNT` ortam değişkeni, tek satırlık
 * JSON olarak. Yerelde `.env.local` (gitignore'da), yayında Vercel ortam
 * değişkeni. Dosya olarak repoya hiç kopyalanmıyor.
 */

/** Ortam değişkeni okunurken eksikse anlaşılır hata ver. */
function gerekli(ad: string): string {
  const deger = process.env[ad];
  if (!deger) {
    throw new Error(
      `Eksik ortam degiskeni: ${ad}. Yerelde .env.local, yayinda Vercel ` +
        `ortam degiskenlerine eklenmeli.`,
    );
  }
  return deger;
}

function uygulama(): App {
  // Next.js geliştirme sunucusu modülleri yeniden yükleyebiliyor; ikinci kez
  // initializeApp çağrılırsa Admin SDK hata veriyor.
  if (getApps().length > 0) return getApp();

  const ham = gerekli("FIREBASE_SERVICE_ACCOUNT");

  let hesap: { project_id: string; client_email: string; private_key: string };
  try {
    hesap = JSON.parse(ham);
  } catch {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT gecerli bir JSON degil. Konsoldan inen " +
        "dosyanin TAMAMI tek satir hâlinde yapistirilmali.",
    );
  }

  return initializeApp({
    credential: cert({
      projectId: hesap.project_id,
      clientEmail: hesap.client_email,
      // Ortam değişkeninde satır sonları `\n` olarak kaçışlı duruyor.
      privateKey: hesap.private_key.replace(/\\n/g, "\n"),
    }),
    storageBucket: gerekli("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  });
}

export function db() {
  return getFirestore(uygulama());
}

export function kimlik() {
  return getAuth(uygulama());
}

export function kova() {
  return getStorage(uygulama()).bucket();
}
