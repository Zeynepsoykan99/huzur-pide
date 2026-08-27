/**
 * Ekran: Dil secimi (uygulamanin ilk acilis ekrani).
 *
 * Su an sadece tasarim — butonlar tiklanabilir ama bir sey yapmiyor.
 * data-lang / data-dir nitelikleri Asama 3'te JS'in tutunacagi kancalar:
 * <html> uzerindeki lang ve dir bu degerlerden okunacak.
 */

type Dil = {
  kod: "tr" | "en" | "ar" | "ru";
  /** Dil adi, kendi dilinde yazilir. */
  ad: string;
  /** Bayrak dosyasi — ISO 3166 ulke kodu (dil kodu ile ayni olmayabilir). */
  bayrak: string;
  /** Bayragin ekran okuyucuya okunacak adi. */
  bayrakAdi: string;
  yon: "ltr" | "rtl";
};

const DILLER: Dil[] = [
  { kod: "tr", ad: "Türkçe", bayrak: "tr", bayrakAdi: "Türkiye", yon: "ltr" },
  { kod: "en", ad: "English", bayrak: "gb", bayrakAdi: "Birleşik Krallık", yon: "ltr" },
  { kod: "ar", ad: "العربية", bayrak: "ae", bayrakAdi: "Birleşik Arap Emirlikleri", yon: "rtl" },
  { kod: "ru", ad: "Русский", bayrak: "ru", bayrakAdi: "Rusya", yon: "ltr" },
];

function Ok() {
  return (
    <svg className="lang-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DilSecimSayfasi() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-10 sm:max-w-lg sm:py-14 lg:max-w-xl">
      {/* Header + dil secimi dikeyde ortalanir, footer altta kalir */}
      <div className="flex flex-1 flex-col justify-center py-2">
        <header className="flex flex-col items-center text-center">
          {/* Logo dekoratif: hemen altindaki <h1> ayni bilgiyi veriyor,
              ekran okuyucu iki kez okumasin diye gizlendi. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            width={80}
            height={80}
            className="h-16 w-16 sm:h-20 sm:w-20"
          />

          <h1 className="mt-5 font-display text-4xl leading-none tracking-wide text-cocoa-900 sm:text-5xl">
            Huzur Pide
          </h1>

          {/* Ince ayrac: iki cizgi arasinda kucuk bir elmas */}
          <div className="mt-4 flex w-full max-w-[13rem] items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-latte-400" />
            <span className="h-1.5 w-1.5 rotate-45 bg-latte-500" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-latte-400" />
          </div>

          <p className="mt-4 text-sm text-cocoa-700 sm:text-base">Fırından sofranıza</p>
        </header>

        <main className="mt-10 sm:mt-12">
          <h2
            id="lang-heading"
            className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-cocoa-700"
          >
            Dil Seçiniz
          </h2>
          <p className="mt-1.5 text-center text-xs text-cocoa-700/70">
            <span lang="en">Choose language</span>
            <span aria-hidden="true" className="mx-1.5 text-latte-500">
              ·
            </span>
            {/* Karisik yonlu metin icinde dogru siralama icin dir gerekli */}
            <span lang="ar" dir="rtl">
              اختر اللغة
            </span>
            <span aria-hidden="true" className="mx-1.5 text-latte-500">
              ·
            </span>
            <span lang="ru">Выберите язык</span>
          </p>

          <div
            id="language-list"
            role="group"
            aria-labelledby="lang-heading"
            className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4"
          >
            {DILLER.map((dil) => (
              <button
                key={dil.kod}
                type="button"
                data-lang={dil.kod}
                data-dir={dil.yon}
                className="lang-btn"
              >
                <span className="flag-slot">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/flags/${dil.bayrak}.svg`}
                    alt=""
                    aria-hidden="true"
                    className="flag"
                  />
                </span>
                {/*
                  Arapca etikette dir="rtl" YOK: tek yonlu bir metin, yon
                  isareti olmadan da dogru render oluyor. dir verilseydi metin
                  buton icinde saga yaslanip diger uc butonla hizasini bozardi.
                  Sayfa RTL'e gectiginde dordu birden aynalanacak.
                */}
                <span className="lang-name" lang={dil.kod}>
                  {dil.ad}
                </span>
                <Ok />
              </button>
            ))}
          </div>
        </main>
      </div>

      <footer className="mt-10 pt-6 text-center text-xs text-cocoa-700/60">
        <p>Huzur Pide · Dijital Menü</p>
      </footer>
    </div>
  );
}
