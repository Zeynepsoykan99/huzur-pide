import type { Cevrilebilir, DilKodu } from "./menu";

/**
 * Arayüz metinleri — menü içeriği değil, uygulamanın kendi yazıları.
 *
 * Menü verisinden ayrı bir dosyada duruyor: menü içeriği ileride admin
 * panelinden düzenlenecek, bu metinler ise kodun parçası. İkisini karıştırmak
 * panelde "Menüye dön" yazısını da düzenlenebilir kılardı.
 */
export const ARAYUZ = {
  dilSeciniz: {
    tr: "Dil Seçiniz",
    en: "Choose Language",
    ar: "اختر اللغة",
    ru: "Выберите язык",
  },
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
  bolumSecin: {
    tr: "Bölüm seçin",
    en: "Choose a section",
    ar: "اختر القسم",
    ru: "Выберите раздел",
  },
  yakinda: {
    tr: "Bu bölüm hazırlanıyor.",
    en: "This section is coming soon.",
    ar: "هذا القسم قيد الإعداد.",
    ru: "Этот раздел готовится.",
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
  gorsel: { tr: "Görsel", en: "Image", ar: "صورة", ru: "Изображение" },
  urun: { tr: "Ürün", en: "Item", ar: "الصنف", ru: "Блюдо" },
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
