/**
 * Huzur Pide — menü verisi.
 *
 * Bu dosya menünün TEK kaynağıdır. Kategori adı, ürün adı veya fiyat hiçbir
 * bileşenin içine gömülmez; her şey buradan okunur. İleride admin paneli
 * geldiğinde bu dosyanın yerini bir veritabanı alacak, ama tipler aynı kalacak
 * — panel de aynı `Kategori` / `Urun` şeklini üretecek.
 *
 * DİL DURUMU: Yapı dört dili taşıyor ama şu an SADECE `tr` dolu. Diğer üç dilin
 * çevirileri henüz girilmedi; uydurulmadı. `Cevrilebilir` tipinde `tr` zorunlu,
 * diğerleri isteğe bağlı — yani eksik çeviri derleme hatası vermez, ama
 * `eksikCevirileriBul()` ile listelenebilir.
 */

/** Uygulamanın desteklediği diller. */
export type DilKodu = "tr" | "en" | "ar" | "ru";

export const DILLER: readonly DilKodu[] = ["tr", "en", "ar", "ru"] as const;

/**
 * Çok dilli metin. `tr` zorunlu (elimizde olan tek dil), diğerleri opsiyonel.
 * Çeviri girilene kadar alan hiç yazılmaz — boş string yazmak "çevrildi ama
 * boş" ile "henüz çevrilmedi" ayrımını kaybettirirdi.
 */
export type Cevrilebilir = {
  tr: string;
} & Partial<Record<Exclude<DilKodu, "tr">, string>>;

/**
 * Fiyat sütunu. Kapalı pidelerde üç sütun var (1 Hamur / 1,5 Hamur / Düble),
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
  /** URL parçası: /menu/kapali-pide */
  slug: string;
  ad: Cevrilebilir;
  /**
   * Basılı menüdeki sayfa numarası. Kategori listesinde noktalı ayracın
   * sağında gösterilir. Tek sayfaysa "5", birden fazlaysa "1-2".
   */
  sayfaNo: string;
  /**
   * Fiyat sütunları. Tek elemanlıysa başlık satırı gösterilmez.
   */
  sutunlar: FiyatSutunu[];
  urunler: Urun[];
};

/* -------------------------------------------------------------------------
   Sütun tanımları
   ------------------------------------------------------------------------- */

/** Kapalı pidelerde kullanılan üç hamur boyu. */
const PIDE_SUTUNLARI: FiyatSutunu[] = [
  { kod: "hamur1", baslik: { tr: "1 Hamur" } },
  { kod: "hamur15", baslik: { tr: "1,5 Hamur" } },
  { kod: "duble", baslik: { tr: "Düble" } },
];

/** Tek fiyatlı kategoriler için. Başlık ekranda gösterilmez. */
const TEK_SUTUN: FiyatSutunu[] = [{ kod: "tek", baslik: { tr: "Fiyat" } }];

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
    ad: { tr: "Kapalı Pide Çeşitleri" },
    sayfaNo: "1-2",
    sutunlar: PIDE_SUTUNLARI,
    urunler: [
      {
        id: "kiymali",
        ad: { tr: "Kıymalı" },
        icerik: { tr: "Dana kıyma, soğan, domates, biber, maydanoz" },
        fiyatlar: [
          // 1 Hamur fiyatı işletmeyle teyit edilmedi.
          { sutun: "hamur1", tutar: 200, dogrulandi: false },
          { sutun: "hamur15", tutar: 300, dogrulandi: true },
          { sutun: "duble", tutar: 400, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/kiymali-pide.webp",
          alt: { tr: "Kıymalı pide" },
          genislik: 800,
          yukseklik: 450,
        },
      },
      {
        id: "kasarli",
        ad: { tr: "Kaşarlı" },
        icerik: { tr: "Kaşar peyniri" },
        fiyatlar: [
          // 1 Hamur ve Düble fiyatları işletmeyle teyit edilmedi.
          { sutun: "hamur1", tutar: 200, dogrulandi: false },
          { sutun: "hamur15", tutar: 300, dogrulandi: true },
          { sutun: "duble", tutar: 400, dogrulandi: false },
        ],
        // Sitede "Peynirli Pide" görseli var ama o farklı bir ürün; kullanılmadı.
              gorsel: null,
      },
      {
        id: "sucuklu",
        ad: { tr: "Sucuklu" },
        icerik: { tr: "Dilimlenmiş sucuk, kaşar peyniri" },
        fiyatlar: [
          { sutun: "hamur1", tutar: 200, dogrulandi: true },
          { sutun: "hamur15", tutar: 300, dogrulandi: true },
          { sutun: "duble", tutar: 400, dogrulandi: true },
        ],
              gorsel: null,
      },
      {
        id: "kiyma-kasar",
        ad: { tr: "Kıyma & Kaşar" },
        icerik: { tr: "Dana kıyma, kaşar peyniri" },
        fiyatlar: [
          { sutun: "hamur1", tutar: 220, dogrulandi: true },
          { sutun: "hamur15", tutar: 330, dogrulandi: true },
          { sutun: "duble", tutar: 440, dogrulandi: true },
        ],
              gorsel: null,
      },
      {
        id: "karisik",
        ad: { tr: "Karışık" },
        icerik: { tr: "Dana kıyma, sucuk, kaşar peyniri" },
        fiyatlar: [
          { sutun: "hamur1", tutar: 240, dogrulandi: true },
          { sutun: "hamur15", tutar: 350, dogrulandi: true },
          { sutun: "duble", tutar: 480, dogrulandi: true },
        ],
        gorsel: {
          src: "/urunler/karisik-pide.webp",
          alt: { tr: "Karışık pide" },
          genislik: 800,
          yukseklik: 450,
        },
      },
      {
        id: "lahmacun",
        ad: { tr: "Lahmacun" },
        icerik: { tr: "İnce hamur, dana kıyma, soğan, domates, biber, maydanoz" },
        fiyatlar: [
          { sutun: "hamur1", tutar: 100, dogrulandi: true },
          // Lahmacun'un 1,5 Hamur ve Düble karşılığı yok.
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
    ad: { tr: "Izgara Çeşitleri" },
    sayfaNo: "3-4",
    sutunlar: TEK_SUTUN,
    urunler: [
      { id: "et-izgara-kg", ad: { tr: "Et Izgara 1 KG" }, icerik: { tr: "Izgarada dana eti" }, fiyatlar: tek(1500), gorsel: null },
      { id: "et-izgara-porsiyon", ad: { tr: "Et Izgara Porsiyon" }, icerik: { tr: "Izgarada dana eti" }, fiyatlar: tek(500), gorsel: null },
      { id: "kuzu-izgara-kg", ad: { tr: "Kuzu Izgara 1 KG" }, icerik: { tr: "Izgarada kuzu eti" }, fiyatlar: tek(1700), gorsel: null },
      { id: "kuzu-izgara-porsiyon", ad: { tr: "Kuzu Izgara Porsiyon" }, icerik: { tr: "Izgarada kuzu eti" }, fiyatlar: tek(550), gorsel: null },
      { id: "kofte-izgara-kg", ad: { tr: "Köfte Izgara 1 KG" }, icerik: { tr: "Izgarada dana kıymalı köfte" }, fiyatlar: tek(1300), gorsel: null },
      {
        id: "kofte-izgara-porsiyon",
        ad: { tr: "Köfte Izgara Porsiyon (6 adet köfte)" },
        icerik: { tr: "Izgarada dana kıymalı köfte, 6 adet" },
        fiyatlar: tek(400),
        gorsel: {
          src: "/urunler/kofte-izgara.webp",
          alt: { tr: "Izgara köfte porsiyonu" },
          genislik: 800,
          yukseklik: 450,
        },
      },
      {
        id: "kofte-izgara-bucuk-porsiyon",
        ad: { tr: "Köfte Izgara 1,5 Porsiyon (8-9 adet)" },
        icerik: { tr: "Izgarada dana kıymalı köfte, 8-9 adet" },
        fiyatlar: tek(500),
              gorsel: null,
      },
      { id: "tavuk-izgara-kg", ad: { tr: "Tavuk Izgara 1 KG" }, icerik: { tr: "Izgarada tavuk eti" }, fiyatlar: tek(700), gorsel: null },
      { id: "tavuk-porsiyon", ad: { tr: "Tavuk Porsiyon" }, icerik: { tr: "Izgarada tavuk eti" }, fiyatlar: tek(350), gorsel: null },
      {
        id: "karisik-izgara-kg",
        ad: { tr: "Karışık Izgara 1 KG" },
        icerik: { tr: "Izgarada dana eti, kuzu eti, köfte ve tavuk" },
        fiyatlar: tek(1700),
              gorsel: null,
      },
      {
        id: "karisik-izgara-porsiyon",
        ad: { tr: "Karışık Izgara Porsiyon" },
        icerik: { tr: "Izgarada dana eti, kuzu eti, köfte ve tavuk" },
        fiyatlar: tek(600),
        gorsel: {
          src: "/urunler/karisik-izgara.webp",
          alt: { tr: "Karışık ızgara tabağı" },
          genislik: 800,
          yukseklik: 450,
        },
      },
      { id: "sac-kavurma", ad: { tr: "Saç Kavurma" }, icerik: { tr: "Sacda kavrulmuş dana eti, biber, domates, soğan" }, fiyatlar: tek(500), gorsel: null },
      {
        id: "et-sis",
        ad: { tr: "Et Şiş" },
        icerik: { tr: "Şişe dizilmiş dana eti, ızgarada" },
        fiyatlar: tek(500),
        gorsel: {
          src: "/urunler/et-sis.webp",
          alt: { tr: "Et şiş" },
          genislik: 800,
          yukseklik: 450,
        },
      },
      { id: "tavuk-sis", ad: { tr: "Tavuk Şiş" }, icerik: { tr: "Şişe dizilmiş tavuk eti, ızgarada" }, fiyatlar: tek(300), gorsel: null },
    ],
  },

  /* ---------------------------------------------------------------- 3 */
  {
    slug: "salatalar",
    ad: { tr: "Salatalar" },
    sayfaNo: "5",
    sutunlar: TEK_SUTUN,
    urunler: [{ id: "coban-salata", ad: { tr: "Çoban Salata" }, icerik: { tr: "Domates, salatalık, soğan, yeşil biber, maydanoz, zeytinyağı" }, fiyatlar: tek(100), gorsel: null }],
  },

  /* ---------------------------------------------------------------- 4 */
  {
    slug: "tatlilar",
    ad: { tr: "Tatlı Çeşitleri" },
    sayfaNo: "6",
    sutunlar: TEK_SUTUN,
    urunler: [
      { id: "kunefe", ad: { tr: "Künefe" }, icerik: { tr: "Kadayıf, tel peynir, şerbet, üzerine antep fıstığı" }, fiyatlar: tek(200), gorsel: null },
      {
        id: "sutlac",
        ad: { tr: "Sütlaç" },
        icerik: { tr: "Süt, pirinç, şeker, fırında" },
        fiyatlar: tek(170),
        gorsel: {
          src: "/urunler/sutlac.webp",
          alt: { tr: "Sütlaç" },
          genislik: 800,
          yukseklik: 450,
        },
      },
      {
        id: "kabak-tatlisi",
        ad: { tr: "Kabak Tatlısı" },
        icerik: { tr: "Balkabağı, şeker, üzerine ceviz" },
        // Fiyat işletmeyle teyit edilmedi.
        fiyatlar: tek(150, false),
        gorsel: {
          src: "/urunler/kabak-tatlisi.webp",
          alt: { tr: "Kabak tatlısı" },
          genislik: 800,
          yukseklik: 450,
        },
      },
    ],
  },

  /* ---------------------------------------------------------------- 5 */
  {
    slug: "icecekler",
    ad: { tr: "İçecekler" },
    sayfaNo: "7",
    sutunlar: TEK_SUTUN,
    // Bu kategorinin içeriği huzurpide.com.tr/menu adresinden alındı.
    urunler: [
      { id: "kola", ad: { tr: "Kola" }, icerik: null, fiyatlar: tek(80), gorsel: null },
      { id: "fanta", ad: { tr: "Fanta" }, icerik: null, fiyatlar: tek(80), gorsel: null },
      { id: "soda", ad: { tr: "Soda" }, icerik: { tr: "Maden suyu" }, fiyatlar: tek(40), gorsel: null },
      { id: "ayran", ad: { tr: "Ayran" }, icerik: { tr: "Yoğurt, su, tuz" }, fiyatlar: tek(50), gorsel: null },
      { id: "komposto", ad: { tr: "Komposto" }, icerik: { tr: "Kaynatılmış meyve ve şerbeti" }, fiyatlar: tek(80), gorsel: null },
      { id: "meyveli-soda", ad: { tr: "Meyveli Soda" }, icerik: { tr: "Meyve aromalı maden suyu" }, fiyatlar: tek(40), gorsel: null },
      { id: "su", ad: { tr: "Su" }, icerik: null, fiyatlar: tek(10), gorsel: null },
    ],
  },
];

/* -------------------------------------------------------------------------
   Yardımcılar
   ------------------------------------------------------------------------- */

/** Para birimi. Tek yerde tutuluyor ki değişirse tek satır düzenlensin. */
export const PARA_BIRIMI = "₺";

/**
 * Bir metni istenen dilde döndürür. Çeviri girilmemişse Türkçe'ye düşer —
 * ekranda boşluk görünmesindense kaynak dil görünsün.
 */
export function metin(alan: Cevrilebilir, dil: DilKodu): string {
  return alan[dil] ?? alan.tr;
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
