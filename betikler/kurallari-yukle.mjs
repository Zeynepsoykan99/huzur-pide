/**
 * Firestore güvenlik kurallarını yayına alır.
 *
 * Firebase CLI kurmak yerine Rules API'si doğrudan kullanılıyor: iki adım —
 * önce kural kümesi (ruleset) oluşturuluyor, sonra `cloud.firestore` yayını
 * o kümeye bağlanıyor. Yayına bağlanmayan bir küme etkisizdir.
 *
 * Kimlik: servis hesabı (.env.local içindeki FIREBASE_SERVICE_ACCOUNT).
 *
 * Çalıştırma:  node betikler/kurallari-yukle.mjs
 */
import { readFileSync } from "node:fs";
import { GoogleAuth } from "google-auth-library";
import { config } from "dotenv";

config({ path: ".env.local" });

const PROJE = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!PROJE) throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID yok (.env.local)");

const hesap = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const auth = new GoogleAuth({
  credentials: hesap,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});
const client = await auth.getClient();

const kaynak = readFileSync("firestore.rules", "utf8");

// 1) Kural kümesini oluştur
const kume = await client.request({
  url: `https://firebaserules.googleapis.com/v1/projects/${PROJE}/rulesets`,
  method: "POST",
  data: {
    source: { files: [{ name: "firestore.rules", content: kaynak }] },
  },
});
const kumeAdi = kume.data.name;
console.log("Kural kumesi olusturuldu:", kumeAdi);

// 2) Yayını o kümeye bağla. Yayın varsa güncelle, yoksa oluştur.
const yayinAdi = `projects/${PROJE}/releases/cloud.firestore`;
try {
  await client.request({
    url: `https://firebaserules.googleapis.com/v1/${yayinAdi}`,
    method: "PATCH",
    data: { release: { name: yayinAdi, rulesetName: kumeAdi } },
  });
  console.log("Yayin guncellendi:", yayinAdi);
} catch {
  await client.request({
    url: `https://firebaserules.googleapis.com/v1/projects/${PROJE}/releases`,
    method: "POST",
    data: { name: yayinAdi, rulesetName: kumeAdi },
  });
  console.log("Yayin olusturuldu:", yayinAdi);
}

// 3) Gerçekten yayında olanı geri oku — "yükledim" demek yetmez.
const kontrol = await client.request({
  url: `https://firebaserules.googleapis.com/v1/${yayinAdi}`,
});
console.log("Yayindaki kume:", kontrol.data.rulesetName);
console.log(
  kontrol.data.rulesetName === kumeAdi
    ? "DOGRULANDI: yayindaki kume az once yuklenen kume."
    : "UYARI: yayindaki kume farkli!",
);
