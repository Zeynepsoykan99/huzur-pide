/**
 * `data/menu.ts` içindeki MENU sabitini yeni fiziksel menüye göre yeniden üretir.
 *
 * NEDEN ÜRETİCİ BETİK, ELLE YAZMA DEĞİL: 56 ürünün her birinin adı ve
 * açıklaması dört dilde. Hayatta kalan ürünlerin Arapça ve Rusça metinlerini
 * elle kopyalarken tek bir harfin bozulması yeterdi ve bu gözle fark edilmezdi.
 * Betik eski MENU'yü İÇE AKTARIP (regex'le ayrıştırmadan, tip güvenli) hayatta
 * kalan ürünlerin `ad`, `icerik` ve `gorsel` alanlarını olduğu gibi taşıyor.
 * Yalnızca fiyatlar ve sıralama yeniden yazılıyor.
 *
 * Çalıştırma:  npx tsx betikler/menu-uret.ts
 * Sonra:       npx tsx betikler/menu-yaz.ts   (Firestore'a yazar)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { MENU, type Cevrilebilir, type Gorsel, type Urun } from "../data/menu";

/* -------------------------------------------------------------------------
   Eski veriden taşınacaklar
   ------------------------------------------------------------------------- */

const eski = new Map<string, Urun>();
for (const k of MENU) for (const u of k.urunler) eski.set(u.id, u);

/** Hayatta kalan ürünün eski çevirisi/fotoğrafı. Yoksa hata — sessiz kayıp olmasın. */
function tasi(id: string): { ad: Cevrilebilir; icerik: Cevrilebilir | null; gorsel: Gorsel | null } {
  const u = eski.get(id);
  if (!u) throw new Error(`Eski menude bulunamadi: ${id}`);
  return { ad: u.ad, icerik: u.icerik, gorsel: u.gorsel };
}

/* -------------------------------------------------------------------------
   Yeni menü tanımı
   ------------------------------------------------------------------------- */

type YeniUrun = {
  id: string;
  /** Yeni ürünler için; hayatta kalanlarda `devral` kullanılıyor. */
  ad?: Cevrilebilir;
  icerik?: Cevrilebilir | null;
  gorsel?: Gorsel | null;
  /** Eski üründen ad/icerik/gorsel devral. */
  devral?: string;
  /** Devralınan ada rağmen adı değiştir (yeniden adlandırma). */
  adDegistir?: Cevrilebilir;
  fiyatlar: (number | null)[];
};

type YeniKategori = {
  slug: string;
  ad: Cevrilebilir;
  sutunlar: "PIDE_SUTUNLARI" | "TEK_SUTUN" | "CORBA_SUTUNLARI";
  sutunKodlari: string[];
  yorum?: string;
  urunler: YeniUrun[];
};

const YENI: YeniKategori[] = [
  {
    slug: "corbalar",
    ad: { tr: "Çorbalar", en: "Soups", ar: "الشوربات", ru: "Супы" },
    sutunlar: "CORBA_SUTUNLARI",
    sutunKodlari: ["az", "tam"],
    urunler: [
      {
        id: "ezogelin",
        ad: {
          tr: "Ezogelin",
          en: "Ezogelin (Red Lentil & Bulgur Soup)",
          ar: "شوربة إيزوغلين (عدس وبرغل)",
          ru: "Эзогелин (суп из чечевицы и булгура)",
        },
        fiyatlar: [100, 170],
      },
      {
        id: "mercimek",
        ad: {
          tr: "Mercimek",
          en: "Mercimek (Lentil Soup)",
          ar: "شوربة العدس",
          ru: "Чечевичный суп",
        },
        fiyatlar: [100, 170],
      },
      {
        id: "tavuksuyu",
        ad: {
          tr: "Tavuksuyu",
          en: "Chicken Soup",
          ar: "شوربة الدجاج",
          ru: "Куриный суп",
        },
        fiyatlar: [100, 170],
      },
      {
        id: "kelle-paca",
        ad: {
          tr: "Kelle Paça",
          en: "Kelle Paça (Lamb Head & Trotter Soup)",
          ar: "كلة باتشا (شوربة رأس وقوائم الخروف)",
          ru: "Келле-пача (суп из головы и ножек)",
        },
        fiyatlar: [120, 250],
      },
    ],
  },

  {
    slug: "kahvalti",
    ad: { tr: "Kahvaltı Çeşitleri", en: "Breakfast", ar: "الفطور", ru: "Завтрак" },
    sutunlar: "TEK_SUTUN",
    sutunKodlari: ["tek"],
    urunler: [
      {
        id: "tek-kisilik-kahvalti",
        ad: {
          tr: "Tek Kişilik Kahvaltı",
          en: "Breakfast for One",
          ar: "فطور لشخص واحد",
          ru: "Завтрак на одного",
        },
        fiyatlar: [380],
      },
      {
        id: "serpme-kahvalti-2",
        ad: {
          tr: "Serpme Kahvaltı 2 Kişilik",
          en: "Spread Breakfast for 2",
          ar: "فطور مفتوح لشخصين",
          ru: "Большой завтрак на двоих",
        },
        fiyatlar: [1000],
      },
      {
        id: "serpme-kahvalti-4",
        ad: {
          tr: "Serpme Kahvaltı 4 Kişilik",
          en: "Spread Breakfast for 4",
          ar: "فطور مفتوح لأربعة أشخاص",
          ru: "Большой завтрак на четверых",
        },
        fiyatlar: [1600],
      },
      {
        id: "menemen",
        ad: {
          tr: "Menemen",
          en: "Menemen (Eggs with Tomato & Pepper)",
          ar: "منمن (بيض بالطماطم والفلفل)",
          ru: "Менемен (яичница с томатами и перцем)",
        },
        fiyatlar: [200],
      },
      {
        id: "sucuklu-yumurta",
        ad: {
          tr: "Sucuklu Yumurta",
          en: "Eggs with Sucuk",
          ar: "بيض بالسجق التركي",
          ru: "Яичница с суджуком",
        },
        fiyatlar: [200],
      },
      {
        id: "kuymak",
        ad: {
          tr: "Kuymak",
          en: "Kuymak (Melted Cheese & Cornmeal)",
          ar: "كويماك (جبن ذائب مع دقيق الذرة)",
          ru: "Куймак (сыр с кукурузной мукой)",
        },
        fiyatlar: [200],
      },
      {
        id: "patates-cips",
        ad: {
          tr: "Patates Cips (Porsiyon)",
          en: "French Fries (Portion)",
          ar: "بطاطس مقلية (حصة)",
          ru: "Картофель фри (порция)",
        },
        fiyatlar: [170],
      },
    ],
  },

  {
    slug: "acik-pide",
    ad: {
      tr: "Açık Pide Çeşitleri",
      en: "Open Pide",
      ar: "البيدة المفتوحة",
      ru: "Открытая пиде",
    },
    sutunlar: "PIDE_SUTUNLARI",
    sutunKodlari: ["hamur1", "hamur15", "duble"],
    yorum:
      "Acik pide ile kapali pidede dort urunun adi ayni (Kiymali, Kasarli,\n    // Kiyma & Kasar, Karisik). Firestore'da urun kimlikleri TEK koleksiyonda\n    // global oldugu icin buradakiler `acik-` onekli: onek olmasaydi kapali\n    // pidenin ayni adli urununun uzerine yazilirdi.",
    urunler: [
      { id: "acik-kiymali", ad: tasi("kiymali").ad, fiyatlar: [390, 550, 700] },
      {
        id: "acik-kusbasili",
        ad: {
          tr: "Kuşbaşılı",
          en: "Kuşbaşılı (Diced Beef)",
          ar: "كوشباشلي (قطع لحم)",
          ru: "Кушбашылы (с кусочками мяса)",
        },
        fiyatlar: [390, 550, 700],
      },
      {
        id: "acik-kusbasi-kasar",
        ad: {
          tr: "Kuşbaşı & Kaşar",
          en: "Kuşbaşı & Kaşar (Diced Beef & Cheese)",
          ar: "كوشباشي وكاشار (قطع لحم وجبن)",
          ru: "Кушбашы и кашар (мясо и сыр)",
        },
        fiyatlar: [410, 570, 750],
      },
      { id: "acik-kiyma-kasar", ad: tasi("kiyma-kasar").ad, fiyatlar: [410, 570, 750] },
      { id: "acik-karisik", ad: tasi("karisik").ad, fiyatlar: [430, 600, 800] },
      {
        id: "acik-spesiyal",
        ad: {
          tr: "Spesiyal",
          en: "Spesiyal (Special)",
          ar: "سبيشال (طبق خاص)",
          ru: "Спесиял (фирменная)",
        },
        fiyatlar: [460, 600, 800],
      },
      {
        id: "acik-kasar-sucuk",
        ad: {
          tr: "Kaşar Sucuk",
          en: "Kaşar & Sucuk (Cheese & Turkish Sausage)",
          ar: "كاشار وسجق (جبن وسجق تركي)",
          ru: "Кашар и суджук (сыр и суджук)",
        },
        fiyatlar: [390, 550, 700],
      },
      {
        id: "acik-pastirmali",
        ad: {
          tr: "Pastırmalı",
          en: "Pastırmalı (Cured Beef)",
          ar: "بسطرمة (لحم مقدد)",
          ru: "Пастырмалы (с пастырмой)",
        },
        fiyatlar: [500, 650, 870],
      },
      {
        id: "acik-dortmevsim",
        ad: {
          tr: "Dörtmevsim",
          en: "Dörtmevsim (Four Seasons)",
          ar: "أربعة فصول",
          ru: "Дёртмевсим (четыре сезона)",
        },
        fiyatlar: [460, 600, 800],
      },
      { id: "acik-kasarli", ad: tasi("kasarli").ad, fiyatlar: [390, 550, 700] },
      {
        id: "acik-yagli-yumurtali",
        ad: {
          tr: "Yağlı Yumurtalı",
          en: "Yağlı Yumurtalı (Butter & Egg)",
          ar: "بالسمن والبيض",
          ru: "Яйлы юмурталы (с маслом и яйцом)",
        },
        fiyatlar: [170, 200, 250],
      },
    ],
  },

  {
    slug: "kapali-pide",
    ad: tasiKategori("kapali-pide"),
    sutunlar: "PIDE_SUTUNLARI",
    sutunKodlari: ["hamur1", "hamur15", "duble"],
    urunler: [
      { id: "kiymali", devral: "kiymali", fiyatlar: [260, 360, 520] },
      { id: "kasarli", devral: "kasarli", fiyatlar: [260, 360, 520] },
      { id: "sucuklu", devral: "sucuklu", fiyatlar: [260, 360, 520] },
      { id: "kiyma-kasar", devral: "kiyma-kasar", fiyatlar: [280, 370, 550] },
      { id: "karisik", devral: "karisik", fiyatlar: [320, 400, 640] },
      { id: "lahmacun", devral: "lahmacun", fiyatlar: [120, null, null] },
    ],
  },

  {
    slug: "izgara",
    ad: tasiKategori("izgara"),
    sutunlar: "TEK_SUTUN",
    sutunKodlari: ["tek"],
    urunler: [
      { id: "et-izgara-kg", devral: "et-izgara-kg", fiyatlar: [1650] },
      { id: "et-izgara-porsiyon", devral: "et-izgara-porsiyon", fiyatlar: [600] },
      { id: "kofte-izgara-kg", devral: "kofte-izgara-kg", fiyatlar: [1400] },
      { id: "kofte-izgara-porsiyon", devral: "kofte-izgara-porsiyon", fiyatlar: [450] },
      {
        id: "kofte-izgara-bucuk-porsiyon",
        devral: "kofte-izgara-bucuk-porsiyon",
        fiyatlar: [600],
      },
      { id: "tavuk-izgara-kg", devral: "tavuk-izgara-kg", fiyatlar: [700] },
      { id: "tavuk-porsiyon", devral: "tavuk-porsiyon", fiyatlar: [350] },
      { id: "karisik-izgara-kg", devral: "karisik-izgara-kg", fiyatlar: [1600] },
      { id: "karisik-izgara-porsiyon", devral: "karisik-izgara-porsiyon", fiyatlar: [750] },
      { id: "sac-kavurma", devral: "sac-kavurma", fiyatlar: [500] },
      { id: "et-sis", devral: "et-sis", fiyatlar: [500] },
      { id: "tavuk-sis", devral: "tavuk-sis", fiyatlar: [300] },
    ],
  },

  {
    slug: "salatalar",
    ad: tasiKategori("salatalar"),
    sutunlar: "TEK_SUTUN",
    sutunKodlari: ["tek"],
    urunler: [{ id: "coban-salata", devral: "coban-salata", fiyatlar: [100] }],
  },

  {
    slug: "tatlilar",
    ad: tasiKategori("tatlilar"),
    sutunlar: "TEK_SUTUN",
    sutunKodlari: ["tek"],
    urunler: [
      { id: "kunefe", devral: "kunefe", fiyatlar: [200] },
      { id: "sutlac", devral: "sutlac", fiyatlar: [170] },
    ],
  },

  {
    slug: "icecekler",
    ad: tasiKategori("icecekler"),
    sutunlar: "TEK_SUTUN",
    sutunKodlari: ["tek"],
    urunler: [
      { id: "kola", devral: "kola", fiyatlar: [60] },
      {
        id: "yedigun",
        ad: {
          tr: "Yedigün",
          en: "Yedigün (Lemon-Lime Soda)",
          ar: "يدي غون (مشروب غازي بالليمون)",
          ru: "Едигюн (лимонад)",
        },
        fiyatlar: [60],
      },
      {
        id: "lipton-ice-tea",
        ad: {
          tr: "Lipton Ice Tea",
          en: "Lipton Ice Tea",
          ar: "ليبتون آيس تي",
          ru: "Lipton Ice Tea",
        },
        fiyatlar: [60],
      },
      {
        id: "meyve-suyu",
        ad: {
          tr: "Meyve Suyu",
          en: "Fruit Juice",
          ar: "عصير فواكه",
          ru: "Фруктовый сок",
        },
        fiyatlar: [60],
      },
      {
        id: "gazoz",
        ad: {
          tr: "Gazoz",
          en: "Gazoz (Turkish Soda)",
          ar: "غازوز (مشروب غازي)",
          ru: "Газоз (лимонад)",
        },
        fiyatlar: [60],
      },
      // Eski `soda` urunu: ceviriler korundu, yalnizca Turkce adi "Sade Soda"
      // oldu (Meyveli Soda ile ciftini kursun diye).
      {
        id: "sade-soda",
        devral: "soda",
        adDegistir: {
          tr: "Sade Soda",
          en: eski.get("soda")!.ad.en,
          ar: eski.get("soda")!.ad.ar,
          ru: eski.get("soda")!.ad.ru,
        },
        fiyatlar: [40],
      },
      { id: "meyveli-soda", devral: "meyveli-soda", fiyatlar: [40] },
      // Ayran ikiye ayrildi. Fotograf (ayran.webp) BUYUK ayrana tasindi;
      // aciklama ayni icecek oldugu icin ikisinde de ayni.
      {
        id: "kucuk-ayran",
        ad: {
          tr: "Küçük Ayran",
          en: "Small Ayran (Yogurt Drink)",
          ar: "عيران صغير (مشروب اللبن)",
          ru: "Айран малый (кисломолочный напиток)",
        },
        icerik: eski.get("ayran")!.icerik,
        gorsel: null,
        fiyatlar: [30],
      },
      {
        id: "buyuk-ayran",
        devral: "ayran",
        adDegistir: {
          tr: "Büyük Ayran",
          en: "Large Ayran (Yogurt Drink)",
          ar: "عيران كبير (مشروب اللبن)",
          ru: "Айран большой (кисломолочный напиток)",
        },
        fiyatlar: [40],
      },
      {
        id: "kucuk-cay",
        ad: { tr: "Küçük Çay", en: "Tea (Small)", ar: "شاي صغير", ru: "Чай (маленький)" },
        fiyatlar: [10],
      },
      {
        id: "buyuk-cay",
        ad: { tr: "Büyük Çay", en: "Tea (Large)", ar: "شاي كبير", ru: "Чай (большой)" },
        fiyatlar: [30],
      },
      {
        id: "turk-kahvesi",
        ad: {
          tr: "Türk Kahvesi",
          en: "Turkish Coffee",
          ar: "قهوة تركية",
          ru: "Турецкий кофе",
        },
        fiyatlar: [70],
      },
      { id: "su", devral: "su", fiyatlar: [10] },
    ],
  },
];

function tasiKategori(slug: string): Cevrilebilir {
  const k = MENU.find((x) => x.slug === slug);
  if (!k) throw new Error(`Eski kategori bulunamadi: ${slug}`);
  return k.ad;
}

/* -------------------------------------------------------------------------
   TypeScript kaynağı üretimi
   ------------------------------------------------------------------------- */

const g = (s: string) => JSON.stringify(s);

/**
 * `Cevrilebilir` tipinde yalnizca `tr` zorunlu. Eksik bir dil `undefined`
 * olarak yazilsaydi uretilen dosya derlenmezdi; bu yuzden yalnizca DOLU
 * olanlar yaziliyor. Eksik dili `metin()` zaten Turkce'ye dusuruyor.
 */
function cev(c: Cevrilebilir, girinti: string): string {
  const satirlar = (["tr", "en", "ar", "ru"] as const)
    .filter((d) => c[d] !== undefined)
    .map((d) => `${girinti}  ${d}: ${g(c[d]!)},`);
  return [`{`, ...satirlar, `${girinti}}`].join("\n");
}

function gorselYaz(gr: Gorsel | null, girinti: string): string {
  if (!gr) return "null";
  return [
    `{`,
    `${girinti}  src: ${g(gr.src)},`,
    `${girinti}  alt: ${cev(gr.alt, `${girinti}  `)},`,
    `${girinti}  genislik: ${gr.genislik},`,
    `${girinti}  yukseklik: ${gr.yukseklik},`,
    `${girinti}}`,
  ].join("\n");
}

function urunYaz(u: YeniUrun, kodlar: string[]): string {
  const temel = u.devral ? tasi(u.devral) : null;
  const ad = u.adDegistir ?? u.ad ?? temel!.ad;
  const icerik = u.icerik !== undefined ? u.icerik : (temel?.icerik ?? null);
  const gorsel = u.gorsel !== undefined ? u.gorsel : (temel?.gorsel ?? null);

  const i = "        ";
  const satirlar = [`      {`, `${i}id: ${g(u.id)},`, `${i}ad: ${cev(ad, i)},`];
  satirlar.push(`${i}icerik: ${icerik ? cev(icerik, i) : "null"},`);

  if (kodlar.length === 1) {
    satirlar.push(`${i}fiyatlar: tek(${u.fiyatlar[0]}),`);
  } else {
    satirlar.push(`${i}fiyatlar: [`);
    for (const [n, kod] of kodlar.entries()) {
      satirlar.push(`${i}  { sutun: ${g(kod)}, tutar: ${u.fiyatlar[n]}, dogrulandi: true },`);
    }
    satirlar.push(`${i}],`);
  }

  satirlar.push(`${i}gorsel: ${gorselYaz(gorsel, i)},`);
  satirlar.push(`      },`);
  return satirlar.join("\n");
}

const bloklar = YENI.map((k, sira) => {
  const basliklar = [
    `  /* ---------------------------------------------------------------- ${sira + 1} */`,
    `  {`,
    `    slug: ${g(k.slug)},`,
    `    ad: ${cev(k.ad, "    ")},`,
  ];
  if (k.yorum) basliklar.push(`    // ${k.yorum}`);
  basliklar.push(`    sutunlar: ${k.sutunlar},`, `    urunler: [`);
  const govde = k.urunler.map((u) => urunYaz(u, k.sutunKodlari));
  return [...basliklar, ...govde, `    ],`, `  },`].join("\n");
});

const yeniMenu = `export const MENU: Kategori[] = [\n${bloklar.join("\n\n")}\n];`;

/* -------------------------------------------------------------------------
   Dosyaya yerleştirme
   ------------------------------------------------------------------------- */

const yol = "data/menu.ts";
let kaynak = readFileSync(yol, "utf8");

// 1) Corba sutunlari: TEK_SUTUN tanimindan hemen once ekleniyor (yoksa).
if (!kaynak.includes("CORBA_SUTUNLARI")) {
  const isaret = "/** Tek fiyatlı kategoriler için. Başlık ekranda gösterilmez. */";
  const corba = `/**
 * Çorbalarda iki porsiyon: az ve tam.
 *
 * Pide sütunlarından ayrı bir sabit — ikisi de üç değil iki sütunlu olsaydı
 * bile aynı şey değiller: başlıklar farklı ve biri değişirse diğeri
 * değişmemeli.
 */
const CORBA_SUTUNLARI: FiyatSutunu[] = [
  {
    kod: "az",
    baslik: { tr: "Az", en: "Small", ar: "صغيرة", ru: "Малая" },
  },
  {
    kod: "tam",
    baslik: { tr: "Tam", en: "Full", ar: "كاملة", ru: "Полная" },
  },
];

`;
  if (!kaynak.includes(isaret)) throw new Error("TEK_SUTUN yorumu bulunamadi");
  kaynak = kaynak.replace(isaret, corba + isaret);
}

// 2) MENU dizisini degistir.
const bas = kaynak.indexOf("export const MENU: Kategori[] = [");
if (bas === -1) throw new Error("MENU tanimi bulunamadi");
const son = kaynak.indexOf("\n];", bas);
if (son === -1) throw new Error("MENU sonu bulunamadi");
kaynak = kaynak.slice(0, bas) + yeniMenu + kaynak.slice(son + 3);

writeFileSync(yol, kaynak, "utf8");

const toplamUrun = YENI.reduce((n, k) => n + k.urunler.length, 0);
const silinen = [...eski.keys()].filter(
  (id) => !YENI.some((k) => k.urunler.some((u) => u.id === id || u.devral === id)),
);
console.log(`data/menu.ts yazildi.`);
console.log(`  kategori: ${MENU.length} -> ${YENI.length}`);
console.log(`  urun:     ${eski.size} -> ${toplamUrun}`);
console.log(`  silinen:  ${silinen.length ? silinen.join(", ") : "(yok)"}`);
