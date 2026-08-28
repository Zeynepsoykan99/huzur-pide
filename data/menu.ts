/**
 * Huzur Pide — menü verisi.
 *
 * Bu dosya menünün TEK kaynağıdır. Kategori adı, ürün adı veya fiyat hiçbir
 * bileşenin içine gömülmez; her şey buradan okunur. İleride admin paneli
 * geldiğinde bu dosyanın yerini bir veritabanı alacak, ama tipler aynı kalacak
 * — panel de aynı `Kategori` / `Urun` şeklini üretecek.
 *
 * DİL DURUMU: Dört dil de dolu (tr/en/ar/ru). Çeviriler işletmeyle onaylanarak
 * girildi. Arapça metinlerin bir ana dili konuşan tarafından gözden geçirilmesi
 * öneriliyor — özellikle Türkçe adın harf çevirisiyle yazıldığı kalemler
 * (Kaşarlı, Karışık, Saç Kavurma gibi).
 *
 * `Cevrilebilir` tipinde `tr` zorunlu, diğerleri isteğe bağlı: eksik çeviri
 * derleme hatası vermez, `metin()` Türkçe'ye düşer, `eksikCeviriler()` listeler.
 */

/** Uygulamanın desteklediği diller. */
export type DilKodu = "tr" | "en" | "ar" | "ru";

export const DILLER: readonly DilKodu[] = ["tr", "en", "ar", "ru"] as const;

/** Yazma yönü. Yalnızca Arapça sağdan sola. */
export const DIL_YONU: Record<DilKodu, "ltr" | "rtl"> = {
  tr: "ltr",
  en: "ltr",
  ar: "rtl",
  ru: "ltr",
};

/** Dil seçim ekranında ve dil değiştirme kontrolünde görünen kısa ad. */
export const DIL_KISA_AD: Record<DilKodu, string> = {
  tr: "TR",
  en: "EN",
  ar: "AR",
  ru: "RU",
};

/** Dilin kendi adı — dil seçim ekranındaki buton etiketi. */
export const DIL_ADI: Record<DilKodu, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
  ru: "Русский",
};

/** Dili temsil eden bayrak dosyası (ISO 3166 ülke kodu, dil kodu değil). */
export const DIL_BAYRAGI: Record<DilKodu, { kod: string; ulke: Cevrilebilir }> = {
  tr: { kod: "tr", ulke: { tr: "Türkiye", en: "Türkiye", ar: "تركيا", ru: "Турция" } },
  en: {
    kod: "gb",
    ulke: {
      tr: "Birleşik Krallık",
      en: "United Kingdom",
      ar: "المملكة المتحدة",
      ru: "Великобритания",
    },
  },
  ar: {
    kod: "ae",
    ulke: {
      tr: "Birleşik Arap Emirlikleri",
      en: "United Arab Emirates",
      ar: "الإمارات العربية المتحدة",
      ru: "ОАЭ",
    },
  },
  ru: { kod: "ru", ulke: { tr: "Rusya", en: "Russia", ar: "روسيا", ru: "Россия" } },
};

/** URL'den gelen değerin geçerli bir dil kodu olup olmadığını doğrular. */
export function gecerliDil(deger: string): deger is DilKodu {
  return (DILLER as readonly string[]).includes(deger);
}

/**
 * Çok dilli metin. `tr` zorunlu (elimizde olan tek dil), diğerleri opsiyonel.
 * Çeviri girilene kadar alan hiç yazılmaz — boş string yazmak "çevrildi ama
 * boş" ile "henüz çevrilmedi" ayrımını kaybettirirdi.
 */
export type Cevrilebilir = {
  tr: string;
} & Partial<Record<Exclude<DilKodu, "tr">, string>>;

/**
 * Fiyat sütunu. Kapalı pidelerde üç sütun var (1 Hamur / 1,5 Hamur / Duble),
 * diğer kategorilerde tek sütun. Sütun başlıkları da çevrilebilir.
 */
export type FiyatSutunu = {
  /** Sütunun kod adı — veri içinde referans için, ekranda görünmez. */
  kod: string;
  /** Sütun başlığı. Tek sütunlu kategorilerde başlık gösterilmez. */
  baslik: Cevrilebilir;
};

/**
 * Bir ürünün tek bir sütundaki fiyatı.
 * `null` = o ürün o sütunda satılmıyor (örn. Lahmacun'un 1,5 Hamur karşılığı yok).
 */
export type Fiyat = {
  sutun: string;
  /** Türk Lirası, tam sayı. Ekranda ₺ ile gösterilir. */
  tutar: number | null;
  /**
   * Fiyatın işletmeyle teyit edilip edilmediği.
   * `false` olanlar admin panelinde öne çıkarılacak.
   */
  dogrulandi: boolean;
};

export type Gorsel = {
  /** public/ altındaki yol. */
  src: string;
  /** Görselin ekran okuyucuya okunacak açıklaması. */
  alt: Cevrilebilir;
  genislik: number;
  yukseklik: number;
};

export type Urun = {
  /** Kategori içinde tekil, URL ve React key olarak kullanılır. */
  id: string;
  ad: Cevrilebilir;
  /**
   * Kısa içerik/malzeme açıklaması. Tek satır, malzeme sıralaması.
   *
   * Türkçe metin burada duruyor ama TÜRKÇE EKRANDA GÖSTERİLMİYOR — yerel
   * müşteri ürünü zaten tanıyor. Açıklama yalnızca en/ar/ru için render
   * ediliyor; Türkçe alan çevirilerin kaynağı ve işletmenin onayladığı metin.
   *
   * `null` = bu ürüne açıklama gerekmiyor (Kola, Fanta, Su).
   */
  icerik: Cevrilebilir | null;
  fiyatlar: Fiyat[];
  /**
   * Ürün görseli. Yalnızca elimizde gerçekten o ürüne ait bir fotoğraf varsa
   * doldurulur; benzer bir ürünün fotoğrafı kullanılmaz.
   *
   * Alan ZORUNLU ve `null` olabilir — opsiyonel değil. Böylece fotoğrafı
   * olmayan her ürün veri dosyasında `gorsel: null,` satırıyla açıkça
   * görünüyor; fotoğraf gelince o satırı doldurmak yetiyor, hangi ürünün
   * eksik olduğunu aramak gerekmiyor. `gorselsizUrunler()` de bunu listeler.
   */
  gorsel: Gorsel | null;
};

export type Kategori = {
  /** URL parçası temeli: kapali-pide → /tr/menu/kapali-pide-1 */
  slug: string;
  ad: Cevrilebilir;
  /**
   * Kategorinin kaç menü sayfasına bölüneceği ve her sayfaya kaç ürün
   * düşeceği. Toplamı `urunler.length` olmak zorunda — `sayfalariUret()`
   * bunu doğruluyor, tutmazsa derleme anında hata veriyor.
   *
   * Bölmenin amacı sıkışıklığı gidermek: sayfa başına düşen ürün azalınca
   * yazılar ve görseller büyüyebiliyor.
   */
  sayfaBolumleri: number[];
  /**
   * Fiyat sütunları. Tek elemanlıysa başlık satırı gösterilmez.
   */
  sutunlar: FiyatSutunu[];
  urunler: Urun[];
};

/**
 * Menünün tek bir sayfası — kitaptaki bir yaprak.
 *
 * Menü artık dikey bir liste değil, yatay kaydırılan 7 sayfalık bir kitap.
 * Sayfa numaraları (1..7) kategori listesinde de gösterilen numaralarla aynı;
 * artık dekoratif değil, gerçek sayfaları işaret ediyor.
 */
export type MenuSayfasi = {
  /** Kitaptaki sıra: 1..7. Ekranda "3 / 7" olarak görünen sayı. */
  no: number;
  /** URL parçası. Tek sayfalık kategoride kategori slug'ının aynısı. */
  slug: string;
  kategori: Kategori;
  urunler: Urun[];
  /** Kategori içindeki kaçıncı sayfa (örn. 2 sayfalık kategoride 1 veya 2). */
  kategoriIcindeNo: number;
  /** Kategorinin toplam sayfa sayısı. */
  kategoriToplamSayfa: number;
};

/* -------------------------------------------------------------------------
   Sütun tanımları
   ------------------------------------------------------------------------- */

/** Kapalı pidelerde kullanılan üç hamur boyu. */
const PIDE_SUTUNLARI: FiyatSutunu[] = [
  {
    kod: "hamur1",
    baslik: { tr: "1 Hamur", en: "1 Dough", ar: "عجينة 1", ru: "1 тесто" },
  },
  {
    kod: "hamur15",
    baslik: { tr: "1,5 Hamur", en: "1.5 Dough", ar: "عجينة 1.5", ru: "1,5 теста" },
  },
  {
    kod: "duble",
    baslik: { tr: "Duble", en: "Double", ar: "دوبل", ru: "Двойная" },
  },
];

/** Tek fiyatlı kategoriler için. Başlık ekranda gösterilmez. */
const TEK_SUTUN: FiyatSutunu[] = [
  { kod: "tek", baslik: { tr: "Fiyat", en: "Price", ar: "السعر", ru: "Цена" } },
];

/** Tek sütunlu kategorilerde fiyat yazmayı kısaltan yardımcı. */
const tek = (tutar: number, dogrulandi = true): Fiyat[] => [
  { sutun: "tek", tutar, dogrulandi },
];

/* -------------------------------------------------------------------------
   Menü
   ------------------------------------------------------------------------- */

export const MENU: Kategori[] = [
  /* ---------------------------------------------------------------- 1 */
  {
    slug: "kapali-pide",
    ad: {
      tr: "Kapalı Pide Çeşitleri",
      en: "Closed Pide",
      ar: "البيدة المغلقة",
      ru: "Закрытая пиде",
    },
    // Iki sayfa, 3'er urun.
    //
    // Sigma bedeli olculdu: Turkce ve Arapca hedefteki butun telefonlarda
    // sigiyor, Ingilizce 2. sayfa 800px, Rusca 2. sayfa 707px istiyor —
    // hedefteki en kisa cihaz (iPhone 13 mini) 629px. Sebep Lahmacun'un uzun
    // Ingilizce adinin dar ad sutununda alti satira sarmasi.
    sayfaBolumleri: [3, 3],
    sutunlar: PIDE_SUTUNLARI,
    urunler: [
      {
        id: "kiymali",
        ad: {
          tr: "Kıymalı",
          en: "Kıymalı (Minced Beef)",
          ar: "كيمالي (لحم مفروم)",
          ru: "Кыймалы (с фаршем)",
        },
        icerik: {
          tr: "Dana kıyma, soğan, domates, biber, maydanoz",
          en: "Minced beef, onion, tomato, pepper, parsley",
          ar: "لحم بقري مفروم، بصل، طماطم، فلفل، بقدونس",
          ru: "Говяжий фарш, лук, помидоры, перец, петрушка",
        },
        fiyatlar: [
          // 1 Hamur fiyatı işletmeyle teyit edilmedi.
          { sutun: "hamur1", tutar: 200, dogrulandi: false },
          { sutun: "hamur15", tutar: 300, dogrulandi: true },
          { sutun: "duble", tutar: 400, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/kiymali-pide.webp",
          alt: {
            tr: "Kıymalı pide",
            en: "Pide with minced beef",
            ar: "بيدة بلحم مفروم",
            ru: "Пиде с фаршем",
          },
          genislik: 800,
          yukseklik: 450,
        },
      },
      {
        id: "kasarli",
        ad: {
          tr: "Kaşarlı",
          en: "Kaşarlı (Cheese)",
          ar: "كاشارلي (جبن)",
          ru: "Кашарлы (с сыром)",
        },
        icerik: {
          tr: "Kaşar peyniri",
          en: "Kaşar cheese",
          ar: "جبن كاشار",
          ru: "Сыр кашар",
        },
        fiyatlar: [
          // 1 Hamur ve Duble fiyatları işletmeyle teyit edilmedi.
          { sutun: "hamur1", tutar: 200, dogrulandi: false },
          { sutun: "hamur15", tutar: 300, dogrulandi: true },
          { sutun: "duble", tutar: 400, dogrulandi: false },
        ],
        // Sitede "Peynirli Pide" görseli var ama o farklı bir ürün; kullanılmadı.
              gorsel: null,
      },
      {
        id: "sucuklu",
        ad: {
          tr: "Sucuklu",
          en: "Sucuklu (Turkish Sausage)",
          ar: "سوجوكلو (سجق تركي)",
          ru: "Суджуклу (с суджуком)",
        },
        icerik: {
          tr: "Dilimlenmiş sucuk, kaşar peyniri",
          en: "Sliced Turkish sausage, kaşar cheese",
          ar: "شرائح السجق التركي، جبن كاشار",
          ru: "Ломтики суджука, сыр кашар",
        },
        fiyatlar: [
          { sutun: "hamur1", tutar: 200, dogrulandi: true },
          { sutun: "hamur15", tutar: 300, dogrulandi: true },
          { sutun: "duble", tutar: 400, dogrulandi: true },
        ],
              gorsel: null,
      },
      {
        id: "kiyma-kasar",
        ad: {
          tr: "Kıyma & Kaşar",
          en: "Kıyma & Kaşar (Minced Beef & Cheese)",
          ar: "كيما وكاشار (لحم مفروم وجبن)",
          ru: "Кыйма и кашар (фарш и сыр)",
        },
        icerik: {
          tr: "Dana kıyma, kaşar peyniri",
          en: "Minced beef, kaşar cheese",
          ar: "لحم بقري مفروم، جبن كاشار",
          ru: "Говяжий фарш, сыр кашар",
        },
        fiyatlar: [
          { sutun: "hamur1", tutar: 220, dogrulandi: true },
          { sutun: "hamur15", tutar: 330, dogrulandi: true },
          { sutun: "duble", tutar: 440, dogrulandi: true },
        ],
              gorsel: null,
      },
      {
        id: "karisik",
        ad: {
          tr: "Karışık",
          en: "Karışık (Mixed)",
          ar: "كاريشيك (مشكل)",
          ru: "Карышык (ассорти)",
        },
        icerik: {
          tr: "Dana kıyma, sucuk, kaşar peyniri",
          en: "Minced beef, Turkish sausage, kaşar cheese",
          ar: "لحم بقري مفروم، سجق تركي، جبن كاشار",
          ru: "Говяжий фарш, суджук, сыр кашар",
        },
        fiyatlar: [
          { sutun: "hamur1", tutar: 240, dogrulandi: true },
          { sutun: "hamur15", tutar: 350, dogrulandi: true },
          { sutun: "duble", tutar: 480, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/karisik-pide.webp",
          alt: {
            tr: "Karışık pide",
            en: "Mixed pide",
            ar: "بيدة مشكلة",
            ru: "Пиде ассорти",
          },
          genislik: 800,
          yukseklik: 450,
        },
      },
      {
        id: "lahmacun",
        ad: {
          tr: "Lahmacun",
          en: "Lahmacun (Thin Flatbread with Minced Meat)",
          ar: "لحم بعجين",
          ru: "Лахмаджун (тонкая лепёшка с фаршем)",
        },
        icerik: {
          tr: "İnce hamur, dana kıyma, soğan, domates, biber, maydanoz",
          en: "Thin dough, minced beef, onion, tomato, pepper, parsley",
          ar: "عجينة رقيقة، لحم بقري مفروم، بصل، طماطم، فلفل، بقدونس",
          ru: "Тонкое тесто, говяжий фарш, лук, помидоры, перец, петрушка",
        },
        fiyatlar: [
          { sutun: "hamur1", tutar: 100, dogrulandi: true },
          // Lahmacun'un 1,5 Hamur ve Duble karşılığı yok.
          { sutun: "hamur15", tutar: null, dogrulandi: true },
          { sutun: "duble", tutar: null, dogrulandi: true },
        ],
              gorsel: null,
      },
    ],
  },

  /* ---------------------------------------------------------------- 2 */
  {
    slug: "izgara",
    ad: {
      tr: "Izgara Çeşitleri",
      en: "Grilled Dishes",
      ar: "المشويات",
      ru: "Блюда на гриле",
    },
    // 4+3+4+3, esit degil: bolum sinirlari urun gruplarina gore secildi.
    // et+kuzu | kofte | tavuk+karisik | sac+sis — hicbir grup sayfa ortasinda
    // bolunmuyor. Sayfa basina en fazla 4 satir: 390px'te satirlara kalan
    // yukseklik 522px, bir izgara satiri 112px (5 satir sigmiyor, 4 siğiyor).
    sayfaBolumleri: [4, 3, 4, 3],
    sutunlar: TEK_SUTUN,
    urunler: [
      { id: "et-izgara-kg", ad: {
          tr: "Et Izgara 1 KG",
          en: "Grilled Beef 1 KG",
          ar: "لحم بقري مشوي 1 كغ",
          ru: "Говядина на гриле 1 кг",
        }, icerik: {
          tr: "Izgarada dana eti",
          en: "Grilled beef",
          ar: "لحم بقري مشوي",
          ru: "Говядина на гриле",
        }, fiyatlar: tek(1500), gorsel: null },
      { id: "et-izgara-porsiyon", ad: {
          tr: "Et Izgara Porsiyon",
          en: "Grilled Beef Portion",
          ar: "لحم بقري مشوي حصة",
          ru: "Говядина на гриле, порция",
        }, icerik: {
          tr: "Izgarada dana eti",
          en: "Grilled beef",
          ar: "لحم بقري مشوي",
          ru: "Говядина на гриле",
        }, fiyatlar: tek(500), gorsel: null },
      { id: "kuzu-izgara-kg", ad: {
          tr: "Kuzu Izgara 1 KG",
          en: "Grilled Lamb 1 KG",
          ar: "لحم ضأن مشوي 1 كغ",
          ru: "Баранина на гриле 1 кг",
        }, icerik: {
          tr: "Izgarada kuzu eti",
          en: "Grilled lamb",
          ar: "لحم ضأن مشوي",
          ru: "Баранина на гриле",
        }, fiyatlar: tek(1700), gorsel: null },
      { id: "kuzu-izgara-porsiyon", ad: {
          tr: "Kuzu Izgara Porsiyon",
          en: "Grilled Lamb Portion",
          ar: "لحم ضأن مشوي حصة",
          ru: "Баранина на гриле, порция",
        }, icerik: {
          tr: "Izgarada kuzu eti",
          en: "Grilled lamb",
          ar: "لحم ضأن مشوي",
          ru: "Баранина на гриле",
        }, fiyatlar: tek(550), gorsel: null },
      { id: "kofte-izgara-kg", ad: {
          tr: "Köfte Izgara 1 KG",
          en: "Grilled Köfte 1 KG (Meatballs)",
          ar: "كفتة مشوية 1 كغ",
          ru: "Кёфте на гриле 1 кг (котлетки)",
        }, icerik: {
          tr: "Izgarada dana kıymalı köfte",
          en: "Grilled beef meatballs",
          ar: "كفتة لحم بقري مشوية",
          ru: "Котлетки из говяжьего фарша на гриле",
        }, fiyatlar: tek(1300), gorsel: null },
      {
        id: "kofte-izgara-porsiyon",
        ad: {
          tr: "Köfte Izgara Porsiyon (6 adet köfte)",
          en: "Grilled Köfte Portion (6 pieces)",
          ar: "كفتة مشوية حصة (6 قطع)",
          ru: "Кёфте на гриле, порция (6 шт.)",
        },
        icerik: {
          tr: "Izgarada dana kıymalı köfte, 6 adet",
          en: "Grilled beef meatballs, 6 pieces",
          ar: "كفتة لحم بقري مشوية، 6 قطع",
          ru: "Котлетки из говяжьего фарша на гриле, 6 шт.",
        },
        fiyatlar: tek(400),
        gorsel: {
          src: "/urunler/kofte-izgara.webp",
          alt: {
            tr: "Izgara köfte porsiyonu",
            en: "Grilled köfte portion",
            ar: "حصة كفتة مشوية",
            ru: "Порция кёфте на гриле",
          },
          genislik: 800,
          yukseklik: 450,
        },
      },
      {
        id: "kofte-izgara-bucuk-porsiyon",
        ad: {
          tr: "Köfte Izgara 1,5 Porsiyon (8-9 adet)",
          en: "Grilled Köfte 1.5 Portion (8-9 pieces)",
          ar: "كفتة مشوية حصة ونصف (8-9 قطع)",
          ru: "Кёфте на гриле, 1,5 порции (8-9 шт.)",
        },
        icerik: {
          tr: "Izgarada dana kıymalı köfte, 8-9 adet",
          en: "Grilled beef meatballs, 8-9 pieces",
          ar: "كفتة لحم بقري مشوية، 8-9 قطع",
          ru: "Котлетки из говяжьего фарша на гриле, 8-9 шт.",
        },
        fiyatlar: tek(500),
              gorsel: null,
      },
      { id: "tavuk-izgara-kg", ad: {
          tr: "Tavuk Izgara 1 KG",
          en: "Grilled Chicken 1 KG",
          ar: "دجاج مشوي 1 كغ",
          ru: "Курица на гриле 1 кг",
        }, icerik: {
          tr: "Izgarada tavuk eti",
          en: "Grilled chicken",
          ar: "دجاج مشوي",
          ru: "Курица на гриле",
        }, fiyatlar: tek(700), gorsel: null },
      { id: "tavuk-porsiyon", ad: {
          tr: "Tavuk Porsiyon",
          en: "Chicken Portion",
          ar: "دجاج حصة",
          ru: "Курица, порция",
        }, icerik: {
          tr: "Izgarada tavuk eti",
          en: "Grilled chicken",
          ar: "دجاج مشوي",
          ru: "Курица на гриле",
        }, fiyatlar: tek(350), gorsel: null },
      {
        id: "karisik-izgara-kg",
        ad: {
          tr: "Karışık Izgara 1 KG",
          en: "Mixed Grill 1 KG",
          ar: "مشاوي مشكلة 1 كغ",
          ru: "Ассорти на гриле 1 кг",
        },
        icerik: {
          tr: "Izgarada dana eti, kuzu eti, köfte ve tavuk",
          en: "Grilled beef, lamb, meatballs and chicken",
          ar: "لحم بقري وضأن وكفتة ودجاج مشوية",
          ru: "Говядина, баранина, котлетки и курица на гриле",
        },
        fiyatlar: tek(1700),
              gorsel: null,
      },
      {
        id: "karisik-izgara-porsiyon",
        ad: {
          tr: "Karışık Izgara Porsiyon",
          en: "Mixed Grill Portion",
          ar: "مشاوي مشكلة حصة",
          ru: "Ассорти на гриле, порция",
        },
        icerik: {
          tr: "Izgarada dana eti, kuzu eti, köfte ve tavuk",
          en: "Grilled beef, lamb, meatballs and chicken",
          ar: "لحم بقري وضأن وكفتة ودجاج مشوية",
          ru: "Говядина, баранина, котлетки и курица на гриле",
        },
        fiyatlar: tek(600),
        gorsel: {
          src: "/urunler/karisik-izgara.webp",
          alt: {
            tr: "Karışık ızgara tabağı",
            en: "Mixed grill plate",
            ar: "طبق مشاوي مشكلة",
            ru: "Тарелка ассорти на гриле",
          },
          genislik: 800,
          yukseklik: 450,
        },
      },
      { id: "sac-kavurma", ad: {
          tr: "Saç Kavurma",
          en: "Saç Kavurma (Beef Sautéed on a Griddle)",
          ar: "ساتش كافورما (لحم مقلي على الصاج)",
          ru: "Сач кавурма (мясо с саджа)",
        }, icerik: {
          tr: "Sacda kavrulmuş dana eti, biber, domates, soğan",
          en: "Beef sautéed on a griddle with pepper, tomato and onion",
          ar: "لحم بقري مقلي على الصاج مع الفلفل والطماطم والبصل",
          ru: "Говядина, жаренная на садже с перцем, помидорами и луком",
        }, fiyatlar: tek(500), gorsel: null },
      {
        id: "et-sis",
        ad: {
          tr: "Et Şiş",
          en: "Et Şiş (Beef Skewer)",
          ar: "شيش لحم",
          ru: "Эт шиш (шашлык из говядины)",
        },
        icerik: {
          tr: "Şişe dizilmiş dana eti, ızgarada",
          en: "Grilled beef on skewers",
          ar: "قطع لحم بقري مشوية على السيخ",
          ru: "Говядина на шампуре, на гриле",
        },
        fiyatlar: tek(500),
        gorsel: {
          src: "/urunler/et-sis.webp",
          alt: {
            tr: "Et şiş",
            en: "Beef skewer",
            ar: "شيش لحم",
            ru: "Шашлык из говядины",
          },
          genislik: 800,
          yukseklik: 450,
        },
      },
      { id: "tavuk-sis", ad: {
          tr: "Tavuk Şiş",
          en: "Tavuk Şiş (Chicken Skewer)",
          ar: "شيش دجاج",
          ru: "Тавук шиш (шашлык из курицы)",
        }, icerik: {
          tr: "Şişe dizilmiş tavuk eti, ızgarada",
          en: "Grilled chicken on skewers",
          ar: "قطع دجاج مشوية على السيخ",
          ru: "Курица на шампуре, на гриле",
        }, fiyatlar: tek(300), gorsel: null },
    ],
  },

  /* ---------------------------------------------------------------- 3 */
  {
    slug: "salatalar",
    ad: { tr: "Salatalar", en: "Salads", ar: "السلطات", ru: "Салаты" },
    sayfaBolumleri: [1],
    sutunlar: TEK_SUTUN,
    urunler: [{ id: "coban-salata", ad: {
          tr: "Çoban Salata",
          en: "Çoban Salata (Shepherd's Salad)",
          ar: "سلطة الراعي",
          ru: "Чобан салата (пастуший салат)",
        }, icerik: {
          tr: "Domates, salatalık, soğan, yeşil biber, maydanoz, zeytinyağı",
          en: "Tomato, cucumber, onion, green pepper, parsley, olive oil",
          ar: "طماطم، خيار، بصل، فلفل أخضر، بقدونس، زيت زيتون",
          ru: "Помидоры, огурцы, лук, зелёный перец, петрушка, оливковое масло",
        }, fiyatlar: tek(100), gorsel: null }],
  },

  /* ---------------------------------------------------------------- 4 */
  {
    slug: "tatlilar",
    ad: {
      tr: "Tatlı Çeşitleri",
      en: "Desserts",
      ar: "الحلويات",
      ru: "Десерты",
    },
    sayfaBolumleri: [3],
    sutunlar: TEK_SUTUN,
    urunler: [
      { id: "kunefe", ad: {
          tr: "Künefe",
          en: "Künefe (Cheese-filled Shredded Pastry)",
          ar: "كنافة",
          ru: "Кюнефе (десерт из теста кадаиф с сыром)",
        }, icerik: {
          tr: "Kadayıf, tel peynir, şerbet, üzerine antep fıstığı",
          en: "Shredded kadayıf pastry, stringy cheese, syrup, topped with pistachio",
          ar: "عجينة الكنافة، جبن، قطر، مع الفستق الحلبي",
          ru: "Тесто кадаиф, сыр, сироп, сверху фисташки",
        }, fiyatlar: tek(200), gorsel: null },
      {
        id: "sutlac",
        ad: {
          tr: "Sütlaç",
          en: "Sütlaç (Rice Pudding)",
          ar: "سوتلاتش (أرز بالحليب)",
          ru: "Сютлач (рисовый пудинг)",
        },
        icerik: {
          tr: "Süt, pirinç, şeker, fırında",
          en: "Milk, rice, sugar, baked in the oven",
          ar: "حليب، أرز، سكر، مخبوز في الفرن",
          ru: "Молоко, рис, сахар, запечённый в духовке",
        },
        fiyatlar: tek(170),
        gorsel: {
          src: "/urunler/sutlac.webp",
          alt: {
            tr: "Sütlaç",
            en: "Rice pudding",
            ar: "أرز بالحليب",
            ru: "Рисовый пудинг",
          },
          genislik: 800,
          yukseklik: 450,
        },
      },
      {
        id: "kabak-tatlisi",
        ad: {
          tr: "Kabak Tatlısı",
          en: "Kabak Tatlısı (Candied Pumpkin)",
          ar: "حلوى اليقطين",
          ru: "Кабак татлысы (тыква в сиропе)",
        },
        icerik: {
          tr: "Balkabağı, şeker, üzerine ceviz",
          en: "Pumpkin, sugar, topped with walnut",
          ar: "يقطين، سكر، مع الجوز",
          ru: "Тыква, сахар, сверху грецкий орех",
        },
        // Fiyat işletmeyle teyit edilmedi.
        fiyatlar: tek(150, false),
        gorsel: {
          src: "/urunler/kabak-tatlisi.webp",
          alt: {
            tr: "Kabak tatlısı",
            en: "Candied pumpkin",
            ar: "حلوى اليقطين",
            ru: "Тыква в сиропе",
          },
          genislik: 800,
          yukseklik: 450,
        },
      },
    ],
  },

  /* ---------------------------------------------------------------- 5 */
  {
    slug: "icecekler",
    ad: { tr: "İçecekler", en: "Drinks", ar: "المشروبات", ru: "Напитки" },
    sayfaBolumleri: [4, 3],
    sutunlar: TEK_SUTUN,
    // Bu kategorinin içeriği huzurpide.com.tr/menu adresinden alındı.
    urunler: [
      { id: "kola", ad: {
          tr: "Kola",
          en: "Cola",
          ar: "كولا",
          ru: "Кола",
        }, icerik: null, fiyatlar: tek(80), gorsel: null },
      { id: "fanta", ad: {
          tr: "Fanta",
          en: "Fanta",
          ar: "فانتا",
          ru: "Фанта",
        }, icerik: null, fiyatlar: tek(80), gorsel: null },
      { id: "soda", ad: {
          tr: "Soda",
          en: "Sparkling Mineral Water",
          ar: "مياه معدنية فوارة",
          ru: "Газированная минеральная вода",
        }, icerik: {
          tr: "Maden suyu",
          en: "Sparkling mineral water",
          ar: "مياه معدنية فوارة",
          ru: "Газированная минеральная вода",
        }, fiyatlar: tek(40), gorsel: null },
      { id: "ayran", ad: {
          tr: "Ayran",
          en: "Ayran (Yogurt Drink)",
          ar: "عيران (مشروب اللبن)",
          ru: "Айран (кисломолочный напиток)",
        }, icerik: {
          tr: "Yoğurt, su, tuz",
          en: "Yogurt, water, salt",
          ar: "لبن، ماء، ملح",
          ru: "Йогурт, вода, соль",
        }, fiyatlar: tek(50), gorsel: null },
      { id: "komposto", ad: {
          tr: "Komposto",
          en: "Komposto (Fruit Compote)",
          ar: "كومبوستو (شراب الفاكهة المسلوقة)",
          ru: "Компот",
        }, icerik: {
          tr: "Kaynatılmış meyve ve şerbeti",
          en: "Boiled fruit with its syrup",
          ar: "فاكهة مسلوقة مع شرابها",
          ru: "Отварные фрукты с сиропом",
        }, fiyatlar: tek(80), gorsel: null },
      { id: "meyveli-soda", ad: {
          tr: "Meyveli Soda",
          en: "Fruit-flavoured Sparkling Water",
          ar: "مياه فوارة بنكهة الفواكه",
          ru: "Газированная вода с фруктовым вкусом",
        }, icerik: {
          tr: "Meyve aromalı maden suyu",
          en: "Fruit-flavoured sparkling mineral water",
          ar: "مياه معدنية فوارة بنكهة الفواكه",
          ru: "Газированная минеральная вода с фруктовым вкусом",
        }, fiyatlar: tek(40), gorsel: null },
      { id: "su", ad: {
          tr: "Su",
          en: "Water",
          ar: "ماء",
          ru: "Вода",
        }, icerik: null, fiyatlar: tek(10), gorsel: null },
    ],
  },
];

/* -------------------------------------------------------------------------
   Yardımcılar
   ------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------
   Menü sayfaları — kitabın yaprakları
   ------------------------------------------------------------------------- */

/**
 * MENU'yü `sayfaBolumleri`'ne göre düz bir sayfa dizisine çevirir.
 *
 * Sonuç kitabın kendisi: 7 yaprak, sırayla numaralanmış. Sayfa numaraları
 * hem yatay kaydırmada hem kategori listesinde aynı numaralar.
 *
 * Bölüm toplamı ürün sayısını tutmuyorsa burada hata fırlatılıyor; hata
 * derleme anında çıkıyor, canlıya eksik ürünle çıkılamıyor.
 */
function sayfalariUret(): MenuSayfasi[] {
  const sayfalar: MenuSayfasi[] = [];
  let no = 0;

  for (const kategori of MENU) {
    const toplam = kategori.sayfaBolumleri.reduce((a, b) => a + b, 0);
    if (toplam !== kategori.urunler.length) {
      throw new Error(
        `${kategori.slug}: sayfaBolumleri toplamı ${toplam}, ürün sayısı ${kategori.urunler.length}`,
      );
    }

    const kategoriToplamSayfa = kategori.sayfaBolumleri.length;
    let imlec = 0;

    kategori.sayfaBolumleri.forEach((adet, i) => {
      no += 1;
      sayfalar.push({
        no,
        // Tek sayfalık kategoride ek yok: /tr/menu/salatalar eskisi gibi çalışır.
        slug: kategoriToplamSayfa === 1 ? kategori.slug : `${kategori.slug}-${i + 1}`,
        kategori,
        urunler: kategori.urunler.slice(imlec, imlec + adet),
        kategoriIcindeNo: i + 1,
        kategoriToplamSayfa,
      });
      imlec += adet;
    });
  }

  return sayfalar;
}

/** Kitabın tamamı — yatay kaydırmada bu sırayla diziliyor. */
export const SAYFALAR: MenuSayfasi[] = sayfalariUret();

export function sayfaBul(slug: string): MenuSayfasi | undefined {
  return SAYFALAR.find((s) => s.slug === slug);
}

/** Kategorinin ilk sayfası — kategori listesinden buraya bağlanılıyor. */
export function kategorininIlkSayfasi(kategori: Kategori): MenuSayfasi {
  return SAYFALAR.find((s) => s.kategori.slug === kategori.slug)!;
}

/**
 * Kategorinin kapladığı sayfa aralığı: tek sayfaysa "5", iki sayfaysa "1-2".
 * Kategori listesinde noktalı ayracın sağında görünen değer.
 */
export function sayfaAraligi(kategori: Kategori): string {
  const kendi = SAYFALAR.filter((s) => s.kategori.slug === kategori.slug);
  const ilk = kendi[0].no;
  const son = kendi[kendi.length - 1].no;
  return ilk === son ? `${ilk}` : `${ilk}-${son}`;
}

/** Para birimi. Tek yerde tutuluyor ki değişirse tek satır düzenlensin. */
export const PARA_BIRIMI = "₺";

/**
 * Bir metni istenen dilde döndürür. Çeviri girilmemişse Türkçe'ye düşer —
 * ekranda boşluk görünmesindense kaynak dil görünsün.
 */
export function metin(alan: Cevrilebilir, dil: DilKodu): string {
  return alan[dil] ?? alan.tr;
}

/**
 * Ürünün o dilde gösterilecek içerik açıklaması.
 *
 * Türkçe'de HER ZAMAN null döner: yerel müşteri ürünü zaten tanıyor, açıklama
 * yalnızca yabancı dillerde gösteriliyor. Ürünün açıklaması yoksa da null.
 */
export function icerikMetni(urun: Urun, dil: DilKodu): string | null {
  if (dil === "tr" || urun.icerik === null) return null;
  return metin(urun.icerik, dil);
}

/** Fiyatı ekranda gösterilecek biçime çevirir. `null` ise tire döner. */
export function fiyatYaz(tutar: number | null): string {
  if (tutar === null) return "—";
  return `${tutar.toLocaleString("tr-TR")} ${PARA_BIRIMI}`;
}

export function kategoriBul(slug: string): Kategori | undefined {
  return MENU.find((k) => k.slug === slug);
}

/**
 * Fiyatı işletmeyle teyit edilmemiş kalemleri listeler.
 * Admin panelinde "önce bunları doğrula" uyarısı bu listeden beslenecek.
 */
export function dogrulanmamisFiyatlar(): {
  kategori: string;
  urun: string;
  sutun: string;
}[] {
  const sonuc: { kategori: string; urun: string; sutun: string }[] = [];
  for (const kategori of MENU) {
    for (const urun of kategori.urunler) {
      for (const fiyat of urun.fiyatlar) {
        if (!fiyat.dogrulandi) {
          const sutun = kategori.sutunlar.find((s) => s.kod === fiyat.sutun);
          sonuc.push({
            kategori: kategori.ad.tr,
            urun: urun.ad.tr,
            sutun: sutun?.baslik.tr ?? fiyat.sutun,
          });
        }
      }
    }
  }
  return sonuc;
}

/**
 * Henüz çevrilmemiş alanları listeler. Aşama 3'te çeviriler girilirken
 * "nesi eksik" sorusunun cevabı buradan gelecek.
 */
export function eksikCeviriler(dil: Exclude<DilKodu, "tr">): string[] {
  const eksik: string[] = [];
  for (const kategori of MENU) {
    if (!kategori.ad[dil]) eksik.push(`kategori:${kategori.slug}`);
    for (const sutun of kategori.sutunlar) {
      if (!sutun.baslik[dil]) eksik.push(`sutun:${kategori.slug}/${sutun.kod}`);
    }
    for (const urun of kategori.urunler) {
      if (!urun.ad[dil]) eksik.push(`urun:${kategori.slug}/${urun.id}`);
      if (urun.icerik && !urun.icerik[dil]) {
        eksik.push(`icerik:${kategori.slug}/${urun.id}`);
      }
      if (urun.gorsel && !urun.gorsel.alt[dil]) {
        eksik.push(`gorsel-alt:${kategori.slug}/${urun.id}`);
      }
    }
  }
  return eksik;
}

/**
 * Fotoğrafı henüz olmayan ürünleri listeler. Ekranda yer tutucu gösteriliyor;
 * fotoğraf geldiğinde ilgili ürünün `gorsel: null` satırını doldurmak yeterli.
 */
export function gorselsizUrunler(): { kategori: string; urunId: string; urun: string }[] {
  const sonuc: { kategori: string; urunId: string; urun: string }[] = [];
  for (const kategori of MENU) {
    for (const urun of kategori.urunler) {
      if (urun.gorsel === null) {
        sonuc.push({ kategori: kategori.slug, urunId: urun.id, urun: urun.ad.tr });
      }
    }
  }
  return sonuc;
}
