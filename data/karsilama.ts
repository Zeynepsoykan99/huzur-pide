import type { Cevrilebilir } from "./menu";

/**
 * Karşılama sayfasının içeriği — iletişim bilgileri ve pazarlama metinleri.
 *
 * `arayuz.ts`'ten ayrı duruyor: oradakiler arayüzün kendi yazıları ("Menüye
 * dön", "Sayfa"), buradakiler işletmenin İÇERİĞİ. İkisini karıştırmak,
 * telefon numarasını "Sonraki sayfa" ile aynı listeye koymak olurdu.
 *
 * Menü verisinin aksine bu içerik Firestore'da değil, kodda: panelden
 * düzenlenmesi istenmedi ve adres/telefon menü kadar sık değişmiyor.
 */

/**
 * İletişim bilgileri — işletmeden geldiği gibi, çevrilmeden.
 *
 * Adres, telefon ve Instagram kullanıcı adı dört dilde de AYNI görünüyor:
 * bunlar çevrilecek metin değil, aranacak ve tıklanacak veri. Yalnızca
 * "Her gün" etiketi çevriliyor (bkz. `arayuz.ts` → `herGun`), saatler değil.
 */
export const ILETISIM = {
  instagramKullanici: "huzurpide55",
  instagramAdres: "https://www.instagram.com/huzurpide55",

  adres: "Irmaksırtı, 55500 Çarşamba/Samsun",
  /**
   * Harita bağlantısı: `geo:` yerine Google Maps arama adresi.
   *
   * `geo:` şeması masaüstü tarayıcıda hiçbir şey açmıyor ve iOS'ta da
   * güvenilir değil. Arama adresi her yerde çalışıyor: telefonda yüklü
   * harita uygulamasına, masaüstünde tarayıcıya gidiyor.
   */
  haritaAdresi:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Huzur Pide, Irmaksırtı, 55500 Çarşamba/Samsun"),

  /** Ekranda görünen hâli — okunaklı olsun diye boşluklu. */
  telefon: "(0362) 854 18 54",
  /** `tel:` için — boşluksuz, uluslararası biçimde. */
  telefonBaglanti: "tel:+903628541854",

  /** Saatler sabit veri; başındaki "Her gün" etiketi çevriliyor. */
  saatler: "07:00 – 23:00",
} as const;

/**
 * Pazarlama metinleri.
 *
 * KURAL: yalnızca mekânın gerçekten sunduğu şeyler anlatılıyor — pide,
 * lahmacun, ızgara, tatlı ve özel gün organizasyonu. Kapasite, salon sayısı,
 * ödül, "şehrin en iyisi" gibi doğrulanamayan hiçbir iddia yok. Dükkân
 * tabelasında kahvaltı ve çorba da yazıyor ama dijital menüde o kategoriler
 * bulunmadığı için metinlerde geçmiyor.
 */
export const LEZZETLER_METNI: Cevrilebilir = {
  tr: "Pide ve lahmacun taş fırında, ızgaralar ateş başında hazırlanıyor. Yanına bir tatlı eklerseniz sofranız tamamlanır.",
  en: "Our pide and lahmacun are baked in a stone oven, and the grills are prepared over the fire. Add a dessert and the table is complete.",
  ar: "نخبز البيدة واللحم بعجين في فرن حجري، ونُعِدّ المشاوي على النار. أضِف حلوى لتكتمل مائدتك.",
  ru: "Пиде и лахмаджун печём в каменной печи, мясо готовим на огне. Добавьте десерт — и стол готов.",
};

export const ORGANIZASYON_METNI: Cevrilebilir = {
  tr: "Düğün, nişan ve özel günlerinizde sofranızı biz kuralım. Menüyü birlikte belirleyelim, siz misafirlerinizle ilgilenin. Ayrıntılar için bizi arayın.",
  en: "For weddings, engagements and other special days, let us set the table. We'll plan the menu together — you look after your guests. Call us for the details.",
  ar: "في الأعراس والخطوبات وأيامكم الخاصة، دعونا نُعِدّ المائدة. نضع القائمة معًا وأنتم تهتمون بضيوفكم. اتصلوا بنا للتفاصيل.",
  ru: "Свадьбы, помолвки и другие особые дни — накроем стол за вас. Меню составим вместе, а вы занимайтесь гостями. Звоните, обсудим детали.",
};

/**
 * Karşılama sayfasının görselleri.
 *
 * Ürün fotoğraflarından ayrı bir klasörde (`/mekan/`): onlar 68px'lik yuvaya
 * giren 800×450 kareler, bunlar sayfa genişliğinde duran görseller.
 *
 * `public/mekan/menu-kapagi.webp` bilerek listede DEĞİL: menü kapağı
 * karşılamadan kaldırıldı ama dosya ileride gerekebileceği için duruyor.
 * Kullanılmıyor diye silmeyin.
 *
 * ÖLÇÜLER BURADA ÇÜNKÜ DÜZEN ONLARA BAĞLI. Blokların yüksekliği sabit değil,
 * görselin kendi oranından geliyor (`--kars-oran`) — böylece `object-fit:
 * cover` hiçbir şeyi kırpmıyor. Sabit yükseklik kullanıldığında masaüstünde
 * görsellerin %50-65'i kesiliyordu.
 */
export const MEKAN_GORSELLERI = {
  dukkan: { src: "/mekan/dukkan.webp", genislik: 1080, yukseklik: 1080 },
  disGorunum: { src: "/mekan/dis-gorunum.webp", genislik: 1360, yukseklik: 1020 },
  firin: { src: "/mekan/firin.webp", genislik: 1280, yukseklik: 1024 },
} as const;

/** Görsellerin alt metinleri — dekoratif değiller, mekânı anlatıyorlar. */
export const GORSEL_ALT: Record<keyof typeof MEKAN_GORSELLERI, Cevrilebilir> = {
  dukkan: {
    tr: "Huzur Pide'nin tabelası ve camlı terası",
    en: "The Huzur Pide sign and its glazed terrace",
    ar: "لافتة حضور بيدة وشرفتها الزجاجية",
    ru: "Вывеска Huzur Pide и застеклённая терраса",
  },
  disGorunum: {
    tr: "Akşam ışıklarıyla Huzur Pide ve otoparkı",
    en: "Huzur Pide and its car park in the evening light",
    ar: "حضور بيدة وموقف سياراتها في ضوء المساء",
    ru: "Huzur Pide и парковка в вечернем свете",
  },
  firin: {
    tr: "Taş fırında yanan odun ateşi",
    en: "A wood fire burning in the stone oven",
    ar: "نار الحطب تشتعل في الفرن الحجري",
    ru: "Дровяной огонь в каменной печи",
  },
};
