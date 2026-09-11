/**
 * İkinci parti fotoğrafları `data/menu.ts` içindeki ürünlere bağlar.
 *
 * `gorsel-ekle-2.ts` dosyaları `public/urunler/` altına üretti; bu betik
 * veri dosyasındaki `gorsel` alanlarını yazıyor. İkisi ayrı: biri diske,
 * diğeri veriye dokunuyor.
 *
 * ALT METİNLER fotoğrafta GERÇEKTEN NE OLDUĞUNU anlatıyor, ürün adını
 * tekrarlamıyorlar — dosyalar tek tek açılıp bakıldı. Kardeş ürünlerin
 * kalıbı korundu.
 *
 * Çalıştırma:  npx tsx betikler/gorsel-veri-2.ts
 * Sonra:       npx tsx betikler/gorsel-guncelle.ts   (Firestore)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

type Alt = { tr: string; en: string; ar: string; ru: string };
type Kayit = { alt: Alt; kenar?: number; not?: string };

/** Fotoğrafı YENİ eklenen ürünler (`gorsel: null` idi). */
const YENI: Record<string, Kayit> = {
  kuymak: {
    alt: {
      tr: "Bakır sahanda kuymak",
      en: "Kuymak in a copper pan",
      ar: "كويماك في مقلاة نحاسية",
      ru: "Куймак в медной сковороде",
    },
  },
  "acik-dortmevsim": {
    // 500x375 kaynaktan buyutmeden cikan en buyuk kare 375.
    kenar: 375,
    alt: {
      tr: "Dört bölmeli açık pide",
      en: "Open pide in four sections",
      ar: "بيدة مفتوحة بأربعة أقسام",
      ru: "Открытая пиде из четырёх частей",
    },
  },
  "acik-spesiyal": {
    /**
     * Alt metin fotoğraftaki MALZEMELERİ sayıyor, biçimini değil.
     *
     * Sebebi açık: fotoğrafta yuvarlak bir pizza var, kayık biçimli açık
     * pide değil. Bu mekân sahibine bildirildi ve fotoğrafın bu hâliyle
     * kullanılmasına onun kararıyla devam edildi. Alt metinde "açık pide"
     * demek, ekran okuyucu kullanan birine görmediği bir şeyi söylemek
     * olurdu; malzemeleri saymak hem doğru hem yararlı.
     */
    alt: {
      tr: "Sucuklu, mantarlı ve biberli spesiyal",
      en: "Special with sucuk, mushrooms and peppers",
      ar: "سبيشال بالسجق والفطر والفلفل",
      ru: "Спесиял с суджуком, грибами и перцем",
    },
  },
  "meyve-suyu": {
    alt: {
      tr: "Şeftali nektarı kutusu",
      en: "Can of peach nectar",
      ar: "علبة رحيق الخوخ",
      ru: "Банка персикового нектара",
    },
  },
  "sade-soda": {
    alt: {
      tr: "Sade maden suyu şişesi",
      en: "Bottle of plain sparkling water",
      ar: "زجاجة مياه معدنية فوارة",
      ru: "Бутылка простой минеральной воды",
    },
  },
  "meyveli-soda": {
    alt: {
      tr: "Elmalı soda şişesi",
      en: "Bottle of apple-flavoured soda",
      ar: "زجاجة صودا بنكهة التفاح",
      ru: "Бутылка содовой с яблоком",
    },
  },
};

/**
 * Fotoğrafı DEĞİŞEN ürün — dosya adı ve ölçü aynı, içerik ve alt metin yeni.
 *
 * Kola'nın fotoğrafı Coca-Cola kutusuydu, artık Pepsi kutusu. ÜRÜN ADI
 * BİLEREK DEĞİŞMİYOR: mekân sahibine soruldu, adın dört dilde de jenerik
 * kalmasına karar verildi ("Kola / Cola / كولا / Кола"). Bu yüzden burada
 * yalnızca alt metin güncelleniyor — alt metin fotoğrafı anlatır, ürünü
 * değil, ve fotoğrafta artık Pepsi var.
 */
const DEGISEN: Record<string, Kayit> = {
  kola: {
    alt: {
      tr: "Pepsi kutusu",
      en: "Can of Pepsi",
      ar: "علبة بيبسي",
      ru: "Банка Pepsi",
    },
  },
};

const g = (s: string) => JSON.stringify(s);

function gorselBlogu(id: string, k: Kayit): string {
  const i = "        ";
  const kenar = k.kenar ?? 384;
  return [
    `${i}gorsel: {`,
    `${i}  src: ${g(`/urunler/${id}.webp`)},`,
    `${i}  alt: {`,
    `${i}    tr: ${g(k.alt.tr)},`,
    `${i}    en: ${g(k.alt.en)},`,
    `${i}    ar: ${g(k.alt.ar)},`,
    `${i}    ru: ${g(k.alt.ru)},`,
    `${i}  },`,
    `${i}  genislik: ${kenar},`,
    `${i}  yukseklik: ${kenar},`,
    `${i}},`,
  ].join("\n");
}

/** Kimliğin `gorsel` bloğunu bulur; başlangıç ve bitiş ofsetini döner. */
function gorselAraligi(kaynak: string, id: string) {
  const capa = `        id: ${g(id)},\n`;
  const nerede = kaynak.indexOf(capa);
  if (nerede === -1) throw new Error(`Urun bulunamadi: ${id}`);
  if (kaynak.indexOf(capa, nerede + 1) !== -1) {
    throw new Error(`Kimlik birden fazla yerde: ${id}`);
  }
  const bas = kaynak.indexOf("        gorsel:", nerede);
  if (bas === -1) throw new Error(`gorsel alani bulunamadi: ${id}`);
  const son = kaynak.indexOf("\n      },", bas);
  if (son === -1) throw new Error(`gorsel sonu bulunamadi: ${id}`);
  return { bas, son, mevcut: kaynak.slice(bas, son) };
}

function main() {
  const yol = "data/menu.ts";
  let kaynak = readFileSync(yol, "utf8");

  for (const [id, k] of Object.entries(YENI)) {
    if (!existsSync(`public/urunler/${id}.webp`)) {
      throw new Error(`Dosya yok: public/urunler/${id}.webp`);
    }
    const { bas, son, mevcut } = gorselAraligi(kaynak, id);
    if (!mevcut.includes("gorsel: null")) {
      throw new Error(`${id} zaten fotografli — beklenmedik, elle bakilmali`);
    }
    kaynak = kaynak.slice(0, bas) + gorselBlogu(id, k) + kaynak.slice(son);
    console.log(`  yeni fotograf : ${id}`);
  }

  for (const [id, k] of Object.entries(DEGISEN)) {
    if (!existsSync(`public/urunler/${id}.webp`)) {
      throw new Error(`Dosya yok: public/urunler/${id}.webp`);
    }
    const { bas, son, mevcut } = gorselAraligi(kaynak, id);
    if (mevcut.includes("gorsel: null")) {
      throw new Error(`${id} fotografsiz gorunuyor — beklenmedik`);
    }
    kaynak = kaynak.slice(0, bas) + gorselBlogu(id, k) + kaynak.slice(son);
    console.log(`  alt metin yenilendi: ${id} (fotograf degisti)`);
  }

  writeFileSync(yol, kaynak, "utf8");

  /**
   * Fotoğrafsız ürün sayımı GİRİNTİYE BAKARAK yapılıyor.
   *
   * Düz `gorsel: null` araması yanıltıyor: bu dize `Urun` türünün ve
   * `gorselsizUrunler()`in açıklama satırlarında da geçiyor, yani iki
   * fazla sayıyor. Ürün girdisindeki hâli her zaman sekiz boşlukla
   * girintili ve satır sonunda virgüllü.
   */
  const kalan = (kaynak.match(/^ {8}gorsel: null,$/gm) ?? []).length;
  console.log(`\ndata/menu.ts guncellendi.`);
  console.log(`  eklenen : ${Object.keys(YENI).length}`);
  console.log(`  degisen : ${Object.keys(DEGISEN).join(", ")}`);
  console.log(`  fotografsiz kalan urun: ${kalan}`);
}

main();
