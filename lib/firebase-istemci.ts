"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Firebase istemci SDK'sı — YALNIZCA giriş (Authentication) için.
 *
 * Firestore ve Storage'a tarayıcıdan HİÇ dokunulmuyor: panelin bütün yazma
 * işlemleri Server Action'lardan Admin SDK ile geçiyor. Burada yapılan tek
 * şey, mekân sahibini e-posta/şifre ile doğrulayıp bir kimlik belirteci
 * almak; o belirteç sunucuda tekrar doğrulanıyor.
 *
 * BURADAKİ DEĞERLER GİZLİ DEĞİL. Firebase web yapılandırması tanım gereği
 * tarayıcıya gider; Google da bunu böyle belgeliyor. Korumayı sağlayan şey
 * anahtarın saklanması değil, güvenlik kuralları (istemciye sıfır yazma
 * izni) ve kayıt ekranının hiç olmaması — hesaplar yalnızca konsoldan
 * açılıyor.
 */
const yapilandirma = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function istemciUygulamasi() {
  return getApps().length > 0 ? getApp() : initializeApp(yapilandirma);
}

export function istemciKimligi() {
  return getAuth(istemciUygulamasi());
}
