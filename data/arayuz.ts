import type { Cevrilebilir, DilKodu } from "./menu";

/**
 * Arayüz metinleri — menü içeriği değil, uygulamanın kendi yazıları.
 *
 * Menü verisinden ayrı bir dosyada duruyor: menü içeriği ileride admin
 * panelinden düzenlenecek, bu metinler ise kodun parçası. İkisini karıştırmak
 * panelde "Menüye dön" yazısını da düzenlenebilir kılardı.
 */
export const ARAYUZ = {
  slogan: {
    tr: "Fırından sofranıza",
    en: "From our oven to your table",
    ar: "من فرننا إلى مائدتك",
    ru: "Из печи на ваш стол",
  },
  menu: { tr: "Menü", en: "Menu", ar: "القائمة", ru: "Меню" },
  organizasyon: {
    tr: "Organizasyon",
    // "Organization" DEGIL — o kurum/sirket demek. Burada kastedilen dugun,
    // nisan, kina, mevlit, toplu yemek gibi ozel gun organizasyonlari.
    en: "Events",
    ar: "المناسبات",
    ru: "Банкеты",
  },
  lezzetler: {
    tr: "Lezzetlerimiz",
    en: "What we cook",
    ar: "أطباقنا",
    ru: "Наша кухня",
  },
  iletisim: {
    tr: "İletişim",
    en: "Contact",
    ar: "اتصل بنا",
    ru: "Контакты",
  },
  adres: { tr: "Adres", en: "Address", ar: "العنوان", ru: "Адрес" },
  telefon: { tr: "Telefon", en: "Phone", ar: "الهاتف", ru: "Телефон" },
  calismaSaatleri: {
    tr: "Çalışma saatleri",
    en: "Opening hours",
    ar: "ساعات العمل",
    ru: "Часы работы",
  },
  // Saatlerin kendisi (07:00–23:00) ceviri DEGIL, sabit veri. Cevrilen
  // yalnizca "her gun" etiketi.
  herGun: { tr: "Her gün", en: "Every day", ar: "كل يوم", ru: "Ежедневно" },
  yolTarifi: {
    tr: "Yol tarifi",
    en: "Directions",
    ar: "الاتجاهات",
    ru: "Как добраться",
  },
  anaEkranaDon: {
    tr: "Ana ekrana dön",
    en: "Back to main screen",
    ar: "العودة إلى الشاشة الرئيسية",
    ru: "На главный экран",
  },
  menuyeDon: {
    tr: "Menüye dön",
    en: "Back to menu",
    ar: "العودة إلى القائمة",
    ru: "Назад в меню",
  },
  dijitalMenu: {
    tr: "Dijital Menü",
    en: "Digital Menu",
    ar: "القائمة الرقمية",
    ru: "Цифровое меню",
  },

  /* --- Yalnizca ekran okuyucular icin --- */
  sayfa: { tr: "Sayfa", en: "Page", ar: "صفحة", ru: "Страница" },
  // Ok dugmelerinin ekran okuyucu etiketleri. Dugmelerin kendisi yalnizca bir
  // chevron gosteriyor; metin gorunmuyor, bu yuzden etiket sart.
  sonrakiSayfa: {
    tr: "Sonraki sayfa",
    en: "Next page",
    ar: "الصفحة التالية",
    ru: "Следующая страница",
  },
  oncekiSayfa: {
    tr: "Önceki sayfa",
    en: "Previous page",
    ar: "الصفحة السابقة",
    ru: "Предыдущая страница",
  },
  // Alt seritteki asagi ok. Sayfa ekrana sigmadiginda beliriyor; etiket
  // "sonraki sayfa" ile karismasin diye YATAY degil DIKEY hareketi anlatiyor.
  asagiKaydir: {
    tr: "Aşağı kaydır",
    en: "Scroll down",
    ar: "مرر لأسفل",
    ru: "Прокрутить вниз",
  },
  gorsel: { tr: "Görsel", en: "Image", ar: "صورة", ru: "Изображение" },
  menuKategorileri: {
    tr: "Menü kategorileri",
    en: "Menu categories",
    ar: "أقسام القائمة",
    ru: "Категории меню",
  },
  hamurBoyunaGoreFiyatlar: {
    tr: "hamur boyuna göre fiyatlar",
    en: "prices by dough size",
    ar: "الأسعار حسب حجم العجينة",
    ru: "цены по размеру теста",
  },
  dilDegistir: {
    tr: "Dil değiştir",
    en: "Change language",
    ar: "تغيير اللغة",
    ru: "Изменить язык",
  },
} satisfies Record<string, Cevrilebilir>;

export type ArayuzAnahtari = keyof typeof ARAYUZ;

/** Arayüz metnini istenen dilde döndürür; çeviri yoksa Türkçe'ye düşer. */
export function ui(anahtar: ArayuzAnahtari, dil: DilKodu): string {
  const alan = ARAYUZ[anahtar] as Cevrilebilir;
  return alan[dil] ?? alan.tr;
}
