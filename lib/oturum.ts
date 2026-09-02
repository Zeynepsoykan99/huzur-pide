import "server-only";
import { cookies } from "next/headers";
import { db, kimlik } from "@/lib/firebase-sunucu";

/**
 * Panel oturumu.
 *
 * Akış: tarayıcı Firebase Auth ile e-posta/şifre doğrulaması yapıp bir kimlik
 * belirteci alıyor → belirteç sunucuya gönderiliyor → sunucu onu Admin SDK ile
 * DOĞRULAYIP kısa ömürlü bir oturum çerezine çeviriyor.
 *
 * Çerez `httpOnly`: JavaScript okuyamıyor, XSS ile çalınamıyor.
 *
 * İKİ KADEMELİ YETKİ: giriş yapmış olmak yetmiyor. Kullanıcının
 * `yoneticiler/{uid}` belgesi de olmalı. Böylece ileride başka bir amaçla
 * hesap açılsa bile panele giremiyor.
 */

const CEREZ = "huzur_oturum";
/** 5 gün — mekân sahibi her hafta yeniden giriş yapsın. */
const OMUR_MS = 5 * 24 * 60 * 60 * 1000;

export type Yonetici = { uid: string; eposta: string };

/** Firebase kimlik belirtecini oturum çerezine çevirir. Yetkisizse null. */
export async function oturumAc(kimlikBelirteci: string): Promise<Yonetici | null> {
  const cozulen = await kimlik().verifyIdToken(kimlikBelirteci, true);
  const yonetici = await yoneticiMi(cozulen.uid);
  if (!yonetici) return null;

  const cerez = await kimlik().createSessionCookie(kimlikBelirteci, {
    expiresIn: OMUR_MS,
  });
  const kutu = await cookies();
  kutu.set(CEREZ, cerez, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: OMUR_MS / 1000,
  });
  return { uid: cozulen.uid, eposta: cozulen.email ?? "" };
}

export async function oturumKapat(): Promise<void> {
  const kutu = await cookies();
  kutu.delete(CEREZ);
}

/** Yönetici listesinde mi? Liste istemciye hiç açılmıyor (bkz. kurallar). */
async function yoneticiMi(uid: string): Promise<boolean> {
  const belge = await db().collection("yoneticiler").doc(uid).get();
  return belge.exists;
}

/**
 * O anki yöneticiyi döndürür, yoksa null.
 *
 * Her istekte çerez Admin SDK ile yeniden doğrulanıyor (`checkRevoked: true`):
 * konsoldan hesap silinirse ya da oturumlar iptal edilirse panel anında
 * kapanıyor.
 */
export async function mevcutYonetici(): Promise<Yonetici | null> {
  const kutu = await cookies();
  const cerez = kutu.get(CEREZ)?.value;
  if (!cerez) return null;

  try {
    const cozulen = await kimlik().verifySessionCookie(cerez, true);
    if (!(await yoneticiMi(cozulen.uid))) return null;
    return { uid: cozulen.uid, eposta: cozulen.email ?? "" };
  } catch {
    return null;
  }
}

/**
 * Server Action'ların ilk satırı. Yetki yoksa işlemi durduruyor.
 *
 * Sayfa korumasına GÜVENİLMİYOR: bir Server Action doğrudan da çağrılabilir,
 * bu yüzden yetki her eylemde ayrıca doğrulanıyor.
 */
export async function yoneticiGerekli(): Promise<Yonetici> {
  const yonetici = await mevcutYonetici();
  if (!yonetici) throw new Error("Bu işlem için yönetici girişi gerekiyor.");
  return yonetici;
}
