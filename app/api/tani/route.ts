import { NextResponse } from "next/server";

/**
 * GECICI TESHIS NOKTASI — kullanildiktan hemen sonra silinecek.
 *
 * Yalnizca DEGERLERIN VARLIGINI bildiriyor, iceriklerini asla. Amac,
 * calisma aninda render edilen rotalarin neden 500 verdigini ayirt etmek:
 * ortam degiskeni mi ulasmiyor, yoksa calisma zamaninin kendisi mi bozuk.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const tani: Record<string, unknown> = {
    calismaZamani: "ulasildi",
    node: process.version,
    ortam: {
      FIREBASE_SERVICE_ACCOUNT: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT),
      servisHesabiUzunluk: (process.env.FIREBASE_SERVICE_ACCOUNT ?? "").length,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? null,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: Boolean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    },
  };

  // firebase-admin gercekten yuklenebiliyor mu?
  try {
    const { getApps } = await import("firebase-admin/app");
    tani.firebaseAdminYuklendi = true;
    tani.mevcutUygulamaSayisi = getApps().length;
  } catch (e) {
    tani.firebaseAdminYuklendi = false;
    tani.firebaseAdminHatasi = (e as Error).message;
  }

  // Firestore'a gercekten baglanabiliyor mu?
  try {
    const { db } = await import("@/lib/firebase-sunucu");
    const anlik = await db().collection("ayarlar").doc("genel").get();
    tani.firestoreOkundu = anlik.exists;
  } catch (e) {
    tani.firestoreOkundu = false;
    tani.firestoreHatasi = (e as Error).message;
  }

  return NextResponse.json(tani);
}
