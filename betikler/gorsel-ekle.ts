/**
 * İşlenmiş fotoğrafları `data/menu.ts` içindeki ürünlere bağlar.
 *
 * `menu-uret.ts` yeniden çalıştırılamıyor: o betik ESKİ menüyü içe aktarıp
 * yenisini kuruyordu ve artık var olmayan kimliklere (`soda`, `ayran`)
 * bakıyor. Tek seferlikti. Bu yüzden görseller ayrı ve dar kapsamlı bir
 * betikle işleniyor.
 *
 * Her ürünün `gorsel` alanı bloğunun SON alanı; kimliği çapa alıp ondan
 * sonraki ilk `gorsel: ...` satırı değiştiriliyor. Kimlikler tekil olduğu
 * için eşleşme belirsizliği yok — betik bunu ayrıca doğruluyor.
 *
 * Çalıştırma:  npx tsx betikler/gorsel-ekle.ts
 * Sonra:       npx tsx betikler/gorsel-guncelle.ts   (Firestore)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

type Alt = { tr: string; en: string; ar: string; ru: string };

/**
 * Alt metinler kardeş ürünlerin kalıbında: fotoğrafta ne görüldüğünü kısaca
 * söylüyorlar, ürün adını tekrarlamıyorlar. Fotoğrafların içeriğini görmeden
 * yazıldıkları için ürünün kendisini tarif ediyorlar; ekranda doğrulandıktan
 * sonra gerekirse zenginleştirilebilir.
 */
const GORSELLER: Record<string, Alt> = {
  // --- Çorbalar
  ezogelin: {
    tr: "Ezogelin çorbası",
    en: "Bowl of ezogelin soup",
    ar: "شوربة إيزوغلين",
    ru: "Суп эзогелин",
  },
  mercimek: {
    tr: "Mercimek çorbası",
    en: "Bowl of lentil soup",
    ar: "شوربة العدس",
    ru: "Чечевичный суп",
  },
  tavuksuyu: {
    tr: "Tavuk suyu çorbası",
    en: "Bowl of chicken soup",
    ar: "شوربة الدجاج",
    ru: "Куриный суп",
  },
  "kelle-paca": {
    tr: "Kelle paça çorbası",
    en: "Bowl of kelle paça soup",
    ar: "شوربة كلة باتشا",
    ru: "Суп келле-пача",
  },

  // --- Kahvaltı
  "tek-kisilik-kahvalti": {
    tr: "Tek kişilik kahvaltı tabağı",
    en: "Breakfast plate for one",
    ar: "طبق فطور لشخص واحد",
    ru: "Завтрак на одного",
  },
  "serpme-kahvalti-2": {
    tr: "İki kişilik serpme kahvaltı sofrası",
    en: "Spread breakfast table for two",
    ar: "مائدة فطور مفتوح لشخصين",
    ru: "Большой завтрак на двоих",
  },
  "serpme-kahvalti-4": {
    tr: "Dört kişilik serpme kahvaltı sofrası",
    en: "Spread breakfast table for four",
    ar: "مائدة فطور مفتوح لأربعة أشخاص",
    ru: "Большой завтрак на четверых",
  },
  "sucuklu-yumurta": {
    tr: "Sahanda sucuklu yumurta",
    en: "Eggs with sucuk in a pan",
    ar: "بيض بالسجق في المقلاة",
    ru: "Яичница с суджуком на сковороде",
  },
  "patates-cips": {
    tr: "Patates kızartması porsiyonu",
    en: "Portion of French fries",
    ar: "حصة بطاطس مقلية",
    ru: "Порция картофеля фри",
  },

  // --- Açık Pide (kalıp kapalı pidedekinin aynısı, "açık" eklenerek)
  "acik-kiymali": {
    tr: "Kıymalı açık pide",
    en: "Open pide with minced beef",
    ar: "بيدة مفتوحة بلحم مفروم",
    ru: "Открытая пиде с фаршем",
  },
  "acik-kusbasili": {
    tr: "Kuşbaşılı açık pide",
    en: "Open pide with diced beef",
    ar: "بيدة مفتوحة بقطع اللحم",
    ru: "Открытая пиде с кусочками мяса",
  },
  "acik-kusbasi-kasar": {
    tr: "Kuşbaşılı kaşarlı açık pide",
    en: "Open pide with diced beef and cheese",
    ar: "بيدة مفتوحة بقطع اللحم والجبن",
    ru: "Открытая пиде с мясом и сыром",
  },
  "acik-kiyma-kasar": {
    tr: "Kıymalı kaşarlı açık pide",
    en: "Open pide with minced beef and cheese",
    ar: "بيدة مفتوحة بلحم مفروم وجبن",
    ru: "Открытая пиде с фаршем и сыром",
  },
  "acik-kasarli": {
    tr: "Kaşarlı açık pide",
    en: "Open pide with kaşar cheese",
    ar: "بيدة مفتوحة بجبن كاشار",
    ru: "Открытая пиде с сыром кашар",
  },
  "acik-pastirmali": {
    tr: "Pastırmalı açık pide",
    en: "Open pide with cured beef",
    ar: "بيدة مفتوحة بالبسطرمة",
    ru: "Открытая пиде с пастырмой",
  },
  "acik-kasar-sucuk": {
    tr: "Kaşarlı sucuklu açık pide",
    en: "Open pide with cheese and Turkish sausage",
    ar: "بيدة مفتوحة بالجبن والسجق التركي",
    ru: "Открытая пиде с сыром и суджуком",
  },
  "acik-yagli-yumurtali": {
    tr: "Yağlı yumurtalı açık pide",
    en: "Open pide with butter and egg",
    ar: "بيدة مفتوحة بالسمن والبيض",
    ru: "Открытая пиде с маслом и яйцом",
  },

  // --- Tatlı
  kunefe: {
    tr: "Künefe",
    en: "Künefe pastry",
    ar: "كنافة",
    ru: "Кюнефе",
  },

  // --- İçecekler
  kola: { tr: "Kola", en: "Cola", ar: "كولا", ru: "Кола" },
  yedigun: {
    tr: "Yedigün gazozu",
    en: "Yedigün soda",
    ar: "مشروب يدي غون الغازي",
    ru: "Газировка Едигюн",
  },
  "lipton-ice-tea": {
    tr: "Lipton Ice Tea",
    en: "Lipton Ice Tea",
    ar: "ليبتون آيس تي",
    ru: "Lipton Ice Tea",
  },
  "kucuk-ayran": {
    tr: "Küçük ayran",
    en: "Small ayran",
    ar: "عيران صغير",
    ru: "Малый айран",
  },
  "kucuk-cay": {
    tr: "Küçük çay",
    en: "Small tea",
    ar: "شاي صغير",
    ru: "Маленький чай",
  },
  "buyuk-cay": {
    tr: "Büyük çay",
    en: "Large tea",
    ar: "شاي كبير",
    ru: "Большой чай",
  },
  "turk-kahvesi": {
    tr: "Türk kahvesi",
    en: "Turkish coffee",
    ar: "قهوة تركية",
    ru: "Турецкий кофе",
  },
};

/**
 * Fotoğrafı DEĞİŞEN ama alt metni duran ürünler.
 *
 * Büyük Ayran'ın görseli eskiden `ayran.webp` idi; kimlik değiştiği için
 * dosya adı da `buyuk-ayran.webp` oldu. Su'nun dosya adı aynı kaldı, yalnızca
 * içeriği yenilendi. İkisinin de alt metni fotoğrafı hâlâ doğru anlatıyor.
 */
const YALNIZCA_YOL: Record<string, true> = { "buyuk-ayran": true, su: true };

const g = (s: string) => JSON.stringify(s);

function gorselBlogu(id: string, alt: Alt): string {
  const i = "        ";
  return [
    `${i}gorsel: {`,
    `${i}  src: ${g(`/urunler/${id}.webp`)},`,
    `${i}  alt: {`,
    `${i}    tr: ${g(alt.tr)},`,
    `${i}    en: ${g(alt.en)},`,
    `${i}    ar: ${g(alt.ar)},`,
    `${i}    ru: ${g(alt.ru)},`,
    `${i}  },`,
    `${i}  genislik: 800,`,
    `${i}  yukseklik: 450,`,
    `${i}},`,
  ].join("\n");
}

function main() {
  const yol = "data/menu.ts";
  let kaynak = readFileSync(yol, "utf8");
  let yazilan = 0;

  for (const [id, alt] of Object.entries(GORSELLER)) {
    if (!existsSync(`public/urunler/${id}.webp`)) {
      throw new Error(`Dosya yok: public/urunler/${id}.webp`);
    }

    const capa = `        id: ${g(id)},\n`;
    const nerede = kaynak.indexOf(capa);
    if (nerede === -1) throw new Error(`Urun bulunamadi: ${id}`);
    if (kaynak.indexOf(capa, nerede + 1) !== -1) {
      throw new Error(`Kimlik birden fazla yerde: ${id}`);
    }

    // Bloğun son alanı `gorsel`. Kimlikten sonraki ilk `gorsel:` satırı.
    const gBas = kaynak.indexOf("        gorsel:", nerede);
    if (gBas === -1) throw new Error(`gorsel alani bulunamadi: ${id}`);
    const gSon = kaynak.indexOf("\n      },", gBas);
    if (gSon === -1) throw new Error(`gorsel sonu bulunamadi: ${id}`);

    const eski = kaynak.slice(gBas, gSon);
    if (!eski.includes("gorsel: null")) {
      throw new Error(`${id} zaten fotografli — beklenmedik, elle bakilmali`);
    }

    kaynak = kaynak.slice(0, gBas) + gorselBlogu(id, alt) + kaynak.slice(gSon);
    yazilan += 1;
  }

  // Fotoğrafı yenilenenler: yalnızca `src` güncelleniyor, alt metin duruyor.
  for (const id of Object.keys(YALNIZCA_YOL)) {
    const capa = `        id: ${g(id)},\n`;
    const nerede = kaynak.indexOf(capa);
    if (nerede === -1) throw new Error(`Urun bulunamadi: ${id}`);
    const sBas = kaynak.indexOf("          src: ", nerede);
    if (sBas === -1) throw new Error(`src bulunamadi: ${id}`);
    const sSon = kaynak.indexOf("\n", sBas);
    const yeni = `          src: ${g(`/urunler/${id}.webp`)},`;
    if (kaynak.slice(sBas, sSon) !== yeni) yazilan += 1;
    kaynak = kaynak.slice(0, sBas) + yeni + kaynak.slice(sSon);
  }

  writeFileSync(yol, kaynak, "utf8");
  console.log(`data/menu.ts guncellendi: ${yazilan} urunun gorseli yazildi.`);
  console.log(`  yeni fotograf : ${Object.keys(GORSELLER).length}`);
  console.log(`  yol duzeltmesi: ${Object.keys(YALNIZCA_YOL).join(", ")}`);
}

main();
