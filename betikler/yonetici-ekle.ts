/**
 * Firebase Authentication'daki hesabı panelin yöneticisi yapar.
 *
 * NEDEN AYRI BİR ADIM: giriş yapabilmek panele girebilmek demek değil.
 * `yoneticiler/{uid}` belgesi olmayan bir hesap doğru şifreyle giriş yapsa
 * bile panel açılmıyor. Bu koleksiyon istemciye hiç açılmıyor (kurallarda
 * read de write de kapalı), yalnızca sunucu okuyor.
 *
 * Argümansız çalıştırılırsa Authentication'daki hesapları listeler ve tek
 * hesap varsa onu yönetici yapar. E-posta verilirse yalnızca onu ekler.
 *
 * Çalıştırma:  npx tsx betikler/yonetici-ekle.ts [eposta]
 */
import { config } from "dotenv";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

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
}

async function main() {
  baglan();
  const kimlik = getAuth();
  const db = getFirestore();

  const istenen = process.argv[2];
  const liste = await kimlik.listUsers(100);

  if (liste.users.length === 0) {
    console.error(
      "Authentication'da hic hesap yok. Firebase Console > Authentication > " +
        "Users > Add user ile bir hesap acilmali.",
    );
    process.exit(1);
  }

  console.log("Authentication'daki hesaplar:");
  liste.users.forEach((k) => console.log(`  ${k.email ?? "(e-posta yok)"}  ${k.uid}`));

  const hedefler = istenen
    ? liste.users.filter((k) => k.email === istenen)
    : liste.users;

  if (hedefler.length === 0) {
    console.error(`\n"${istenen}" bulunamadi.`);
    process.exit(1);
  }

  for (const k of hedefler) {
    await db.collection("yoneticiler").doc(k.uid).set({
      eposta: k.email ?? "",
      eklendi: new Date().toISOString(),
    });
    console.log(`\nYonetici yapildi: ${k.email} (${k.uid})`);
  }

  const kayitli = await db.collection("yoneticiler").get();
  console.log(`Toplam yonetici sayisi: ${kayitli.size}`);
}

main().catch((e) => {
  console.error("BASARISIZ:", e.message);
  process.exit(1);
});
