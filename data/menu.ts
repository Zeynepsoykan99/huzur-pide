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
  /** URL parçası: kapali-pide → /tr/menu/kapali-pide */
  slug: string;
  ad: Cevrilebilir;
  /**
   * Fiyat sütunları. Tek elemanlıysa başlık satırı gösterilmez.
   */
  sutunlar: FiyatSutunu[];
  urunler: Urun[];
};

/**
 * Menünün tek bir sayfası — kitaptaki bir yaprak.
 *
 * Menü yatay kaydırılan bir kitap ve HER KATEGORİ TEK SAYFA: sayfa sayısı
 * kategori sayısına eşit. Kategori içi bölme kaldırıldı — bölmenin tek amacı
 * her sayfayı telefon ekranına sığdırmaktı, o hedef bırakıldı. Sayfa ekrana
 * sığmazsa sayfa kendi içinde dikey kayıyor.
 *
 * Sayfa numaraları kategori listesinde gösterilen numaralarla aynı.
 */
export type MenuSayfasi = {
  /** Kitaptaki sıra: 1..5. Ekranda "3 / 5" olarak görünen sayı. */
  no: number;
  /** URL parçası — kategori slug'ının aynısı. */
  slug: string;
  kategori: Kategori;
  urunler: Urun[];
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

/**
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
    slug: "corbalar",
    ad: {
      tr: "Çorbalar",
      en: "Soups",
      ar: "الشوربات",
      ru: "Супы",
    },
    sutunlar: CORBA_SUTUNLARI,
    urunler: [
      {
        id: "ezogelin",
        ad: {
          tr: "Ezogelin",
          en: "Ezogelin (Red Lentil & Bulgur Soup)",
          ar: "شوربة إيزوغلين (عدس وبرغل)",
          ru: "Эзогелин (суп из чечевицы и булгура)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "az", tutar: 100, dogrulandi: true },
          { sutun: "tam", tutar: 170, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/ezogelin.webp",
          alt: {
            tr: "Ezogelin çorbası",
            en: "Bowl of ezogelin soup",
            ar: "شوربة إيزوغلين",
            ru: "Суп эзогелин",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "mercimek",
        ad: {
          tr: "Mercimek",
          en: "Mercimek (Lentil Soup)",
          ar: "شوربة العدس",
          ru: "Чечевичный суп",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "az", tutar: 100, dogrulandi: true },
          { sutun: "tam", tutar: 170, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/mercimek.webp",
          alt: {
            tr: "Mercimek çorbası",
            en: "Bowl of lentil soup",
            ar: "شوربة العدس",
            ru: "Чечевичный суп",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "tavuksuyu",
        ad: {
          tr: "Tavuksuyu",
          en: "Chicken Soup",
          ar: "شوربة الدجاج",
          ru: "Куриный суп",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "az", tutar: 100, dogrulandi: true },
          { sutun: "tam", tutar: 170, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/tavuksuyu.webp",
          alt: {
            tr: "Tavuk suyu çorbası",
            en: "Bowl of chicken soup",
            ar: "شوربة الدجاج",
            ru: "Куриный суп",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "kelle-paca",
        ad: {
          tr: "Kelle Paça",
          en: "Kelle Paça (Lamb Head & Trotter Soup)",
          ar: "كلة باتشا (شوربة رأس وقوائم الخروف)",
          ru: "Келле-пача (суп из головы и ножек)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "az", tutar: 120, dogrulandi: true },
          { sutun: "tam", tutar: 250, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/kelle-paca.webp",
          alt: {
            tr: "Kelle paça çorbası",
            en: "Bowl of kelle paça soup",
            ar: "شوربة كلة باتشا",
            ru: "Суп келле-пача",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
    ],
  },

  /* ---------------------------------------------------------------- 2 */
  {
    slug: "kahvalti",
    ad: {
      tr: "Kahvaltı Çeşitleri",
      en: "Breakfast",
      ar: "الفطور",
      ru: "Завтрак",
    },
    sutunlar: TEK_SUTUN,
    urunler: [
      {
        id: "tek-kisilik-kahvalti",
        ad: {
          tr: "Tek Kişilik Kahvaltı",
          en: "Breakfast for One",
          ar: "فطور لشخص واحد",
          ru: "Завтрак на одного",
        },
        icerik: null,
        fiyatlar: tek(380),
        gorsel: {
          src: "/urunler/tek-kisilik-kahvalti.webp",
          alt: {
            tr: "Tek kişilik kahvaltı tabağı",
            en: "Breakfast plate for one",
            ar: "طبق فطور لشخص واحد",
            ru: "Завтрак на одного",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "serpme-kahvalti-2",
        ad: {
          tr: "Serpme Kahvaltı 2 Kişilik",
          en: "Spread Breakfast for 2",
          ar: "فطور مفتوح لشخصين",
          ru: "Большой завтрак на двоих",
        },
        icerik: null,
        fiyatlar: tek(1000),
        gorsel: {
          src: "/urunler/serpme-kahvalti-2.webp",
          alt: {
            tr: "İki kişilik serpme kahvaltı sofrası",
            en: "Spread breakfast table for two",
            ar: "مائدة فطور مفتوح لشخصين",
            ru: "Большой завтрак на двоих",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "serpme-kahvalti-4",
        ad: {
          tr: "Serpme Kahvaltı 4 Kişilik",
          en: "Spread Breakfast for 4",
          ar: "فطور مفتوح لأربعة أشخاص",
          ru: "Большой завтрак на четверых",
        },
        icerik: null,
        fiyatlar: tek(1600),
        gorsel: {
          src: "/urunler/serpme-kahvalti-4.webp",
          alt: {
            tr: "Dört kişilik serpme kahvaltı sofrası",
            en: "Spread breakfast table for four",
            ar: "مائدة فطور مفتوح لأربعة أشخاص",
            ru: "Большой завтрак на четверых",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "menemen",
        ad: {
          tr: "Menemen",
          en: "Menemen (Eggs with Tomato & Pepper)",
          ar: "منمن (بيض بالطماطم والفلفل)",
          ru: "Менемен (яичница с томатами и перцем)",
        },
        icerik: null,
        fiyatlar: tek(200),
        gorsel: null,
      },
      {
        id: "sucuklu-yumurta",
        ad: {
          tr: "Sucuklu Yumurta",
          en: "Eggs with Sucuk",
          ar: "بيض بالسجق التركي",
          ru: "Яичница с суджуком",
        },
        icerik: null,
        fiyatlar: tek(200),
        gorsel: {
          src: "/urunler/sucuklu-yumurta.webp",
          alt: {
            tr: "Sahanda sucuklu yumurta",
            en: "Eggs with sucuk in a pan",
            ar: "بيض بالسجق في المقلاة",
            ru: "Яичница с суджуком на сковороде",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "kuymak",
        ad: {
          tr: "Kuymak",
          en: "Kuymak (Melted Cheese & Cornmeal)",
          ar: "كويماك (جبن ذائب مع دقيق الذرة)",
          ru: "Куймак (сыр с кукурузной мукой)",
        },
        icerik: null,
        fiyatlar: tek(200),
        gorsel: null,
      },
      {
        id: "patates-cips",
        ad: {
          tr: "Patates Cips (Porsiyon)",
          en: "French Fries (Portion)",
          ar: "بطاطس مقلية (حصة)",
          ru: "Картофель фри (порция)",
        },
        icerik: null,
        fiyatlar: tek(170),
        gorsel: {
          src: "/urunler/patates-cips.webp",
          alt: {
            tr: "Patates kızartması porsiyonu",
            en: "Portion of French fries",
            ar: "حصة بطاطس مقلية",
            ru: "Порция картофеля фри",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
    ],
  },

  /* ---------------------------------------------------------------- 3 */
  {
    slug: "acik-pide",
    ad: {
      tr: "Açık Pide Çeşitleri",
      en: "Open Pide",
      ar: "البيدة المفتوحة",
      ru: "Открытая пиде",
    },
    // Acik pide ile kapali pidede dort urunun adi ayni (Kiymali, Kasarli,
    // Kiyma & Kasar, Karisik). Firestore'da urun kimlikleri TEK koleksiyonda
    // global oldugu icin buradakiler `acik-` onekli: onek olmasaydi kapali
    // pidenin ayni adli urununun uzerine yazilirdi.
    sutunlar: PIDE_SUTUNLARI,
    urunler: [
      {
        id: "acik-kiymali",
        ad: {
          tr: "Kıymalı",
          en: "Kıymalı (Minced Beef)",
          ar: "كيمالي (لحم مفروم)",
          ru: "Кыймалы (с фаршем)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "hamur1", tutar: 390, dogrulandi: true },
          { sutun: "hamur15", tutar: 550, dogrulandi: true },
          { sutun: "duble", tutar: 700, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/acik-kiymali.webp",
          alt: {
            tr: "Kıymalı açık pide",
            en: "Open pide with minced beef",
            ar: "بيدة مفتوحة بلحم مفروم",
            ru: "Открытая пиде с фаршем",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "acik-kusbasili",
        ad: {
          tr: "Kuşbaşılı",
          en: "Kuşbaşılı (Diced Beef)",
          ar: "كوشباشلي (قطع لحم)",
          ru: "Кушбашылы (с кусочками мяса)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "hamur1", tutar: 390, dogrulandi: true },
          { sutun: "hamur15", tutar: 550, dogrulandi: true },
          { sutun: "duble", tutar: 700, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/acik-kusbasili.webp",
          alt: {
            tr: "Kuşbaşılı açık pide",
            en: "Open pide with diced beef",
            ar: "بيدة مفتوحة بقطع اللحم",
            ru: "Открытая пиде с кусочками мяса",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "acik-kusbasi-kasar",
        ad: {
          tr: "Kuşbaşı & Kaşar",
          en: "Kuşbaşı & Kaşar (Diced Beef & Cheese)",
          ar: "كوشباشي وكاشار (قطع لحم وجبن)",
          ru: "Кушбашы и кашар (мясо и сыр)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "hamur1", tutar: 410, dogrulandi: true },
          { sutun: "hamur15", tutar: 570, dogrulandi: true },
          { sutun: "duble", tutar: 750, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/acik-kusbasi-kasar.webp",
          alt: {
            tr: "Kuşbaşılı kaşarlı açık pide",
            en: "Open pide with diced beef and cheese",
            ar: "بيدة مفتوحة بقطع اللحم والجبن",
            ru: "Открытая пиде с мясом и сыром",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "acik-kiyma-kasar",
        ad: {
          tr: "Kıyma & Kaşar",
          en: "Kıyma & Kaşar (Minced Beef & Cheese)",
          ar: "كيما وكاشار (لحم مفروم وجبن)",
          ru: "Кыйма и кашар (фарш и сыр)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "hamur1", tutar: 410, dogrulandi: true },
          { sutun: "hamur15", tutar: 570, dogrulandi: true },
          { sutun: "duble", tutar: 750, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/acik-kiyma-kasar.webp",
          alt: {
            tr: "Kıymalı kaşarlı açık pide",
            en: "Open pide with minced beef and cheese",
            ar: "بيدة مفتوحة بلحم مفروم وجبن",
            ru: "Открытая пиде с фаршем и сыром",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "acik-karisik",
        ad: {
          tr: "Karışık",
          en: "Karışık (Mixed)",
          ar: "كاريشيك (مشكل)",
          ru: "Карышык (ассорти)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "hamur1", tutar: 430, dogrulandi: true },
          { sutun: "hamur15", tutar: 600, dogrulandi: true },
          { sutun: "duble", tutar: 800, dogrulandi: true },
        ],
        gorsel: null,
      },
      {
        id: "acik-spesiyal",
        ad: {
          tr: "Spesiyal",
          en: "Spesiyal (Special)",
          ar: "سبيشال (طبق خاص)",
          ru: "Спесиял (фирменная)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "hamur1", tutar: 460, dogrulandi: true },
          { sutun: "hamur15", tutar: 600, dogrulandi: true },
          { sutun: "duble", tutar: 800, dogrulandi: true },
        ],
        gorsel: null,
      },
      {
        id: "acik-kasar-sucuk",
        ad: {
          tr: "Kaşar Sucuk",
          en: "Kaşar & Sucuk (Cheese & Turkish Sausage)",
          ar: "كاشار وسجق (جبن وسجق تركي)",
          ru: "Кашар и суджук (сыр и суджук)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "hamur1", tutar: 390, dogrulandi: true },
          { sutun: "hamur15", tutar: 550, dogrulandi: true },
          { sutun: "duble", tutar: 700, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/acik-kasar-sucuk.webp",
          alt: {
            tr: "Kaşarlı sucuklu açık pide",
            en: "Open pide with cheese and Turkish sausage",
            ar: "بيدة مفتوحة بالجبن والسجق التركي",
            ru: "Открытая пиде с сыром и суджуком",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "acik-pastirmali",
        ad: {
          tr: "Pastırmalı",
          en: "Pastırmalı (Cured Beef)",
          ar: "بسطرمة (لحم مقدد)",
          ru: "Пастырмалы (с пастырмой)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "hamur1", tutar: 500, dogrulandi: true },
          { sutun: "hamur15", tutar: 650, dogrulandi: true },
          { sutun: "duble", tutar: 870, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/acik-pastirmali.webp",
          alt: {
            tr: "Pastırmalı açık pide",
            en: "Open pide with cured beef",
            ar: "بيدة مفتوحة بالبسطرمة",
            ru: "Открытая пиде с пастырмой",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "acik-dortmevsim",
        ad: {
          tr: "Dörtmevsim",
          en: "Dörtmevsim (Four Seasons)",
          ar: "أربعة فصول",
          ru: "Дёртмевсим (четыре сезона)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "hamur1", tutar: 460, dogrulandi: true },
          { sutun: "hamur15", tutar: 600, dogrulandi: true },
          { sutun: "duble", tutar: 800, dogrulandi: true },
        ],
        gorsel: null,
      },
      {
        id: "acik-kasarli",
        ad: {
          tr: "Kaşarlı",
          en: "Kaşarlı (Cheese)",
          ar: "كاشارلي (جبن)",
          ru: "Кашарлы (с сыром)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "hamur1", tutar: 390, dogrulandi: true },
          { sutun: "hamur15", tutar: 550, dogrulandi: true },
          { sutun: "duble", tutar: 700, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/acik-kasarli.webp",
          alt: {
            tr: "Kaşarlı açık pide",
            en: "Open pide with kaşar cheese",
            ar: "بيدة مفتوحة بجبن كاشار",
            ru: "Открытая пиде с сыром кашар",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "acik-yagli-yumurtali",
        ad: {
          tr: "Yağlı Yumurtalı",
          en: "Yağlı Yumurtalı (Butter & Egg)",
          ar: "بالسمن والبيض",
          ru: "Яйлы юмурталы (с маслом и яйцом)",
        },
        icerik: null,
        fiyatlar: [
          { sutun: "hamur1", tutar: 170, dogrulandi: true },
          { sutun: "hamur15", tutar: 200, dogrulandi: true },
          { sutun: "duble", tutar: 250, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/acik-yagli-yumurtali.webp",
          alt: {
            tr: "Yağlı yumurtalı açık pide",
            en: "Open pide with butter and egg",
            ar: "بيدة مفتوحة بالسمن والبيض",
            ru: "Открытая пиде с маслом и яйцом",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
    ],
  },

  /* ---------------------------------------------------------------- 4 */
  {
    slug: "kapali-pide",
    ad: {
      tr: "Kapalı Pide Çeşitleri",
      en: "Closed Pide",
      ar: "البيدة المغلقة",
      ru: "Закрытая пиде",
    },
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
          { sutun: "hamur1", tutar: 260, dogrulandi: true },
          { sutun: "hamur15", tutar: 360, dogrulandi: true },
          { sutun: "duble", tutar: 520, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/kiymali-pide.webp",
          alt: {
            tr: "Kıymalı pide",
            en: "Pide with minced beef",
            ar: "بيدة بلحم مفروم",
            ru: "Пиде с фаршем",
          },
          genislik: 384,
          yukseklik: 384,
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
          { sutun: "hamur1", tutar: 260, dogrulandi: true },
          { sutun: "hamur15", tutar: 360, dogrulandi: true },
          { sutun: "duble", tutar: 520, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/kasarli-pide.webp",
          alt: {
            tr: "Kaşarlı pide",
            en: "Pide with kaşar cheese",
            ar: "بيدة بجبن كاشار",
            ru: "Пиде с сыром кашар",
          },
          genislik: 384,
          yukseklik: 384,
        },
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
          { sutun: "hamur1", tutar: 260, dogrulandi: true },
          { sutun: "hamur15", tutar: 360, dogrulandi: true },
          { sutun: "duble", tutar: 520, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/sucuklu-pide.webp",
          alt: {
            tr: "Sucuklu pide",
            en: "Pide with Turkish sausage",
            ar: "بيدة بالسجق التركي",
            ru: "Пиде с суджуком",
          },
          genislik: 384,
          yukseklik: 384,
        },
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
          { sutun: "hamur1", tutar: 280, dogrulandi: true },
          { sutun: "hamur15", tutar: 370, dogrulandi: true },
          { sutun: "duble", tutar: 550, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/kiyma-kasar-pide.webp",
          alt: {
            tr: "Kıymalı kaşarlı pide",
            en: "Pide with minced beef and cheese",
            ar: "بيدة بلحم مفروم وجبن",
            ru: "Пиде с фаршем и сыром",
          },
          genislik: 384,
          yukseklik: 384,
        },
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
          { sutun: "hamur1", tutar: 320, dogrulandi: true },
          { sutun: "hamur15", tutar: 400, dogrulandi: true },
          { sutun: "duble", tutar: 640, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/karisik-pide.webp",
          alt: {
            tr: "Karışık pide",
            en: "Mixed pide",
            ar: "بيدة مشكلة",
            ru: "Пиде ассорти",
          },
          genislik: 384,
          yukseklik: 384,
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
          { sutun: "hamur1", tutar: 120, dogrulandi: true },
          { sutun: "hamur15", tutar: null, dogrulandi: true },
          { sutun: "duble", tutar: null, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/lahmacun.webp",
          alt: {
            tr: "Lahmacun",
            en: "Thin flatbread with minced meat",
            ar: "لحم بعجين",
            ru: "Тонкая лепёшка с фаршем",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
    ],
  },

  /* ---------------------------------------------------------------- 5 */
  {
    slug: "izgara",
    ad: {
      tr: "Izgara Çeşitleri",
      en: "Grilled Dishes",
      ar: "المشويات",
      ru: "Блюда на гриле",
    },
    sutunlar: TEK_SUTUN,
    urunler: [
      {
        id: "et-izgara-kg",
        ad: {
          tr: "Et Izgara 1 KG",
          en: "Grilled Beef 1 KG",
          ar: "لحم بقري مشوي 1 كغ",
          ru: "Говядина на гриле 1 кг",
        },
        icerik: {
          tr: "Izgarada dana eti",
          en: "Grilled beef",
          ar: "لحم بقري مشوي",
          ru: "Говядина на гриле",
        },
        fiyatlar: tek(1650),
        gorsel: {
          src: "/urunler/et-izgara-kg.webp",
          alt: {
            tr: "Izgarada dana eti",
            en: "Beef on the grill",
            ar: "لحم بقري على الشواية",
            ru: "Говядина на гриле",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "et-izgara-porsiyon",
        ad: {
          tr: "Et Izgara Porsiyon",
          en: "Grilled Beef Portion",
          ar: "لحم بقري مشوي حصة",
          ru: "Говядина на гриле, порция",
        },
        icerik: {
          tr: "Izgarada dana eti",
          en: "Grilled beef",
          ar: "لحم بقري مشوي",
          ru: "Говядина на гриле",
        },
        fiyatlar: tek(600),
        gorsel: {
          src: "/urunler/et-izgara-porsiyon.webp",
          alt: {
            tr: "Tabakta ızgara dana eti",
            en: "Grilled beef on a plate",
            ar: "لحم بقري مشوي في طبق",
            ru: "Говядина на гриле на тарелке",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "kofte-izgara-kg",
        ad: {
          tr: "Köfte Izgara 1 KG",
          en: "Grilled Köfte 1 KG (Meatballs)",
          ar: "كفتة مشوية 1 كغ",
          ru: "Кёфте на гриле 1 кг (котлетки)",
        },
        icerik: {
          tr: "Izgarada dana kıymalı köfte",
          en: "Grilled beef meatballs",
          ar: "كفتة لحم بقري مشوية",
          ru: "Котлетки из говяжьего фарша на гриле",
        },
        fiyatlar: tek(1400),
        gorsel: {
          src: "/urunler/kofte-izgara-kg.webp",
          alt: {
            tr: "Izgarada pişen köfteler",
            en: "Köfte cooking on the grill",
            ar: "كفتة تُشوى على الشواية",
            ru: "Кёфте жарятся на гриле",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
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
        fiyatlar: tek(450),
        gorsel: {
          src: "/urunler/kofte-izgara.webp",
          alt: {
            tr: "Izgara köfte porsiyonu",
            en: "Grilled köfte portion",
            ar: "حصة كفتة مشوية",
            ru: "Порция кёфте на гриле",
          },
          genislik: 384,
          yukseklik: 384,
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
        fiyatlar: tek(600),
        gorsel: {
          src: "/urunler/kofte-izgara-bucuk-porsiyon.webp",
          alt: {
            tr: "Salatalı ızgara köfte tabağı",
            en: "Grilled köfte plate with salad",
            ar: "طبق كفتة مشوية مع سلطة",
            ru: "Тарелка кёфте на гриле с салатом",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "tavuk-izgara-kg",
        ad: {
          tr: "Tavuk Izgara 1 KG",
          en: "Grilled Chicken 1 KG",
          ar: "دجاج مشوي 1 كغ",
          ru: "Курица на гриле 1 кг",
        },
        icerik: {
          tr: "Izgarada tavuk eti",
          en: "Grilled chicken",
          ar: "دجاج مشوي",
          ru: "Курица на гриле",
        },
        fiyatlar: tek(700),
        gorsel: {
          src: "/urunler/tavuk-izgara-kg.webp",
          alt: {
            tr: "Izgarada tavuk parçaları",
            en: "Chicken pieces on the grill",
            ar: "قطع دجاج على الشواية",
            ru: "Кусочки курицы на гриле",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "tavuk-porsiyon",
        ad: {
          tr: "Tavuk Porsiyon",
          en: "Chicken Portion",
          ar: "دجاج حصة",
          ru: "Курица, порция",
        },
        icerik: {
          tr: "Izgarada tavuk eti",
          en: "Grilled chicken",
          ar: "دجاج مشوي",
          ru: "Курица на гриле",
        },
        fiyatlar: tek(350),
        gorsel: {
          src: "/urunler/tavuk-porsiyon.webp",
          alt: {
            tr: "Lavaşlı ızgara tavuk porsiyonu",
            en: "Grilled chicken portion with flatbread",
            ar: "حصة دجاج مشوي مع خبز اللافاش",
            ru: "Порция курицы на гриле с лавашем",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
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
        fiyatlar: tek(1600),
        gorsel: {
          src: "/urunler/karisik-izgara-kg.webp",
          alt: {
            tr: "Bulgur pilavlı karışık ızgara",
            en: "Mixed grill with bulgur pilaf",
            ar: "مشاوي مشكلة مع برغل",
            ru: "Ассорти на гриле с булгуром",
          },
          genislik: 384,
          yukseklik: 384,
        },
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
        fiyatlar: tek(750),
        gorsel: {
          src: "/urunler/karisik-izgara.webp",
          alt: {
            tr: "Karışık ızgara tabağı",
            en: "Mixed grill plate",
            ar: "طبق مشاوي مشكلة",
            ru: "Тарелка ассорти на гриле",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "sac-kavurma",
        ad: {
          tr: "Saç Kavurma",
          en: "Saç Kavurma (Beef Sautéed on a Griddle)",
          ar: "ساتش كافورما (لحم مقلي على الصاج)",
          ru: "Сач кавурма (мясо с саджа)",
        },
        icerik: {
          tr: "Sacda kavrulmuş dana eti, biber, domates, soğan",
          en: "Beef sautéed on a griddle with pepper, tomato and onion",
          ar: "لحم بقري مقلي على الصاج مع الفلفل والطماطم والبصل",
          ru: "Говядина, жаренная на садже с перцем, помидорами и луком",
        },
        fiyatlar: tek(500),
        gorsel: {
          src: "/urunler/sac-kavurma.webp",
          alt: {
            tr: "Sacda dana eti kavurma",
            en: "Beef sautéed on a griddle pan",
            ar: "لحم بقري مقلي على الصاج",
            ru: "Говядина, жаренная на садже",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
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
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "tavuk-sis",
        ad: {
          tr: "Tavuk Şiş",
          en: "Tavuk Şiş (Chicken Skewer)",
          ar: "شيش دجاج",
          ru: "Тавук шиш (шашлык из курицы)",
        },
        icerik: {
          tr: "Şişe dizilmiş tavuk eti, ızgarada",
          en: "Grilled chicken on skewers",
          ar: "قطع دجاج مشوية على السيخ",
          ru: "Курица на шампуре, на гриле",
        },
        fiyatlar: tek(300),
        gorsel: {
          src: "/urunler/tavuk-sis.webp",
          alt: {
            tr: "Tavuk şiş",
            en: "Chicken skewer",
            ar: "شيش دجاج",
            ru: "Шашлык из курицы",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
    ],
  },

  /* ---------------------------------------------------------------- 6 */
  {
    slug: "salatalar",
    ad: {
      tr: "Salatalar",
      en: "Salads",
      ar: "السلطات",
      ru: "Салаты",
    },
    sutunlar: TEK_SUTUN,
    urunler: [
      {
        id: "coban-salata",
        ad: {
          tr: "Çoban Salata",
          en: "Çoban Salata (Shepherd's Salad)",
          ar: "سلطة الراعي",
          ru: "Чобан салата (пастуший салат)",
        },
        icerik: {
          tr: "Domates, salatalık, soğan, yeşil biber, maydanoz, zeytinyağı",
          en: "Tomato, cucumber, onion, green pepper, parsley, olive oil",
          ar: "طماطم، خيار، بصل، فلفل أخضر، بقدونس، زيت زيتون",
          ru: "Помидоры, огурцы, лук, зелёный перец, петрушка, оливковое масло",
        },
        fiyatlar: tek(100),
        gorsel: {
          src: "/urunler/coban-salata.webp",
          alt: {
            tr: "Ahşap kâsede çoban salata",
            en: "Shepherd's salad in a wooden bowl",
            ar: "سلطة الراعي في وعاء خشبي",
            ru: "Пастуший салат в деревянной миске",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
    ],
  },

  /* ---------------------------------------------------------------- 7 */
  {
    slug: "tatlilar",
    ad: {
      tr: "Tatlı Çeşitleri",
      en: "Desserts",
      ar: "الحلويات",
      ru: "Десерты",
    },
    sutunlar: TEK_SUTUN,
    urunler: [
      {
        id: "kunefe",
        ad: {
          tr: "Künefe",
          en: "Künefe (Cheese-filled Shredded Pastry)",
          ar: "كنافة",
          ru: "Кюнефе (десерт из теста кадаиф с сыром)",
        },
        icerik: {
          tr: "Kadayıf, tel peynir, şerbet, üzerine antep fıstığı",
          en: "Shredded kadayıf pastry, stringy cheese, syrup, topped with pistachio",
          ar: "عجينة الكنافة، جبن، قطر، مع الفستق الحلبي",
          ru: "Тесто кадаиф, сыр, сироп, сверху фисташки",
        },
        fiyatlar: tek(200),
        gorsel: {
          src: "/urunler/kunefe.webp",
          alt: {
            tr: "Künefe",
            en: "Künefe pastry",
            ar: "كنافة",
            ru: "Кюнефе",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
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
          genislik: 384,
          yukseklik: 384,
        },
      },
    ],
  },

  /* ---------------------------------------------------------------- 8 */
  {
    slug: "icecekler",
    ad: {
      tr: "İçecekler",
      en: "Drinks",
      ar: "المشروبات",
      ru: "Напитки",
    },
    sutunlar: TEK_SUTUN,
    urunler: [
      {
        id: "kola",
        ad: {
          tr: "Kola",
          en: "Cola",
          ar: "كولا",
          ru: "Кола",
        },
        icerik: null,
        fiyatlar: tek(60),
        gorsel: {
          src: "/urunler/kola.webp",
          alt: {
            tr: "Kola",
            en: "Cola",
            ar: "كولا",
            ru: "Кола",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "yedigun",
        ad: {
          tr: "Yedigün",
          en: "Yedigün (Lemon-Lime Soda)",
          ar: "يدي غون (مشروب غازي بالليمون)",
          ru: "Едигюн (лимонад)",
        },
        icerik: null,
        fiyatlar: tek(60),
        gorsel: {
          src: "/urunler/yedigun.webp",
          alt: {
            tr: "Yedigün gazozu",
            en: "Yedigün soda",
            ar: "مشروب يدي غون الغازي",
            ru: "Газировка Едигюн",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "lipton-ice-tea",
        ad: {
          tr: "Lipton Ice Tea",
          en: "Lipton Ice Tea",
          ar: "ليبتون آيس تي",
          ru: "Lipton Ice Tea",
        },
        icerik: null,
        fiyatlar: tek(60),
        gorsel: {
          src: "/urunler/lipton-ice-tea.webp",
          alt: {
            tr: "Lipton Ice Tea",
            en: "Lipton Ice Tea",
            ar: "ليبتون آيس تي",
            ru: "Lipton Ice Tea",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "meyve-suyu",
        ad: {
          tr: "Meyve Suyu",
          en: "Fruit Juice",
          ar: "عصير فواكه",
          ru: "Фруктовый сок",
        },
        icerik: null,
        fiyatlar: tek(60),
        gorsel: null,
      },
      {
        id: "gazoz",
        ad: {
          tr: "Gazoz",
          en: "Gazoz (Turkish Soda)",
          ar: "غازوز (مشروب غازي)",
          ru: "Газоз (лимонад)",
        },
        icerik: null,
        fiyatlar: tek(60),
        gorsel: null,
      },
      {
        id: "sade-soda",
        ad: {
          tr: "Sade Soda",
          en: "Sparkling Mineral Water",
          ar: "مياه معدنية فوارة",
          ru: "Газированная минеральная вода",
        },
        icerik: {
          tr: "Maden suyu",
          en: "Sparkling mineral water",
          ar: "مياه معدنية فوارة",
          ru: "Газированная минеральная вода",
        },
        fiyatlar: tek(40),
        gorsel: null,
      },
      {
        id: "meyveli-soda",
        ad: {
          tr: "Meyveli Soda",
          en: "Fruit-flavoured Sparkling Water",
          ar: "مياه فوارة بنكهة الفواكه",
          ru: "Газированная вода с фруктовым вкусом",
        },
        icerik: {
          tr: "Meyve aromalı maden suyu",
          en: "Fruit-flavoured sparkling mineral water",
          ar: "مياه معدنية فوارة بنكهة الفواكه",
          ru: "Газированная минеральная вода с фруктовым вкусом",
        },
        fiyatlar: tek(40),
        gorsel: null,
      },
      {
        id: "kucuk-ayran",
        ad: {
          tr: "Küçük Ayran",
          en: "Small Ayran (Yogurt Drink)",
          ar: "عيران صغير (مشروب اللبن)",
          ru: "Айран малый (кисломолочный напиток)",
        },
        icerik: {
          tr: "Yoğurt, su, tuz",
          en: "Yogurt, water, salt",
          ar: "لبن، ماء، ملح",
          ru: "Йогурт, вода, соль",
        },
        fiyatlar: tek(30),
        gorsel: {
          src: "/urunler/kucuk-ayran.webp",
          alt: {
            tr: "Küçük ayran",
            en: "Small ayran",
            ar: "عيران صغير",
            ru: "Малый айран",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "buyuk-ayran",
        ad: {
          tr: "Büyük Ayran",
          en: "Large Ayran (Yogurt Drink)",
          ar: "عيران كبير (مشروب اللبن)",
          ru: "Айран большой (кисломолочный напиток)",
        },
        icerik: {
          tr: "Yoğurt, su, tuz",
          en: "Yogurt, water, salt",
          ar: "لبن، ماء، ملح",
          ru: "Йогурт, вода, соль",
        },
        fiyatlar: tek(40),
        gorsel: {
          src: "/urunler/buyuk-ayran.webp",
          alt: {
            tr: "Büyük ayran",
            en: "Large ayran",
            ar: "عيران كبير",
            ru: "Большой айран",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "kucuk-cay",
        ad: {
          tr: "Küçük Çay",
          en: "Tea (Small)",
          ar: "شاي صغير",
          ru: "Чай (маленький)",
        },
        icerik: null,
        fiyatlar: tek(10),
        gorsel: {
          src: "/urunler/kucuk-cay.webp",
          alt: {
            tr: "Küçük çay",
            en: "Small tea",
            ar: "شاي صغير",
            ru: "Маленький чай",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "buyuk-cay",
        ad: {
          tr: "Büyük Çay",
          en: "Tea (Large)",
          ar: "شاي كبير",
          ru: "Чай (большой)",
        },
        icerik: null,
        fiyatlar: tek(30),
        gorsel: {
          src: "/urunler/buyuk-cay.webp",
          alt: {
            tr: "Büyük çay",
            en: "Large tea",
            ar: "شاي كبير",
            ru: "Большой чай",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "turk-kahvesi",
        ad: {
          tr: "Türk Kahvesi",
          en: "Turkish Coffee",
          ar: "قهوة تركية",
          ru: "Турецкий кофе",
        },
        icerik: null,
        fiyatlar: tek(70),
        gorsel: {
          src: "/urunler/turk-kahvesi.webp",
          alt: {
            tr: "Türk kahvesi",
            en: "Turkish coffee",
            ar: "قهوة تركية",
            ru: "Турецкий кофе",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
      {
        id: "su",
        ad: {
          tr: "Su",
          en: "Water",
          ar: "ماء",
          ru: "Вода",
        },
        icerik: null,
        fiyatlar: tek(10),
        gorsel: {
          src: "/urunler/su.webp",
          alt: {
            tr: "Pet şişede su",
            en: "Bottle of water",
            ar: "زجاجة ماء",
            ru: "Бутылка воды",
          },
          genislik: 384,
          yukseklik: 384,
        },
      },
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
 * MENU'yü kitabın yapraklarına çevirir: her kategori BİR sayfa.
 *
 * Eskiden kategoriler `sayfaBolumleri` ile birden çok sayfaya bölünüyordu;
 * bölmenin tek amacı her sayfayı telefon ekranına sığdırmaktı. O hedef
 * bırakıldığı için bölme kavramı tamamen kaldırıldı — sığmayan sayfa kendi
 * içinde dikey kayıyor. Bölme verisi olmayınca "bölüm toplamı ürün sayısını
 * tutmuyor" hatası da imkânsız hale geldi, doğrulamaya gerek kalmadı.
 *
 * Sayfa numaraları hem yatay kaydırmada hem kategori listesinde aynı.
 */
function sayfalariUret(): MenuSayfasi[] {
  return MENU.map((kategori, i) => ({
    no: i + 1,
    slug: kategori.slug,
    kategori,
    urunler: kategori.urunler,
  }));
}

/** Kitabın tamamı — yatay kaydırmada bu sırayla diziliyor. */
export const SAYFALAR: MenuSayfasi[] = sayfalariUret();

export function sayfaBul(slug: string): MenuSayfasi | undefined {
  return SAYFALAR.find((s) => s.slug === slug);
}

/** Kategorinin sayfası — kategori listesinden buraya bağlanılıyor. */
export function kategorininSayfasi(kategori: Kategori): MenuSayfasi {
  return SAYFALAR.find((s) => s.kategori.slug === kategori.slug)!;
}

/**
 * Kategorinin kitaptaki sayfa numarası. Kategori listesinde noktalı ayracın
 * sağında görünen değer. Her kategori tek sayfa olduğu için tek sayı.
 */
export function sayfaNumarasi(kategori: Kategori): number {
  return kategorininSayfasi(kategori).no;
}

/** Para birimi. Tek yerde tutuluyor ki değişirse tek satır düzenlensin. */
export const PARA_BIRIMI = "₺";

/** Mekân adı — sekme başlığının sabit kuyruğu. */
export const MEKAN_ADI = "Huzur Pide";

/**
 * Menü kitabının sekme başlığı.
 *
 * İKİ YERDEN ÇAĞRILIYOR ve bu yüzden burada duruyor: rotanın
 * `generateMetadata`'sı (tam sayfa yüklemede) ve `SayfaSayaci` (kitapta
 * kaydırılırken, istemci tarafında). Biçim iki yere kopyalansaydı biri
 * değiştiğinde diğeri sessizce eskir, sekmede iki farklı kalıp görünürdü.
 */
export function sayfaBasligi(kategoriAdi: string): string {
  return `${kategoriAdi} · ${MEKAN_ADI}`;
}

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
