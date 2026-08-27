import Link from "next/link";
import { notFound } from "next/navigation";
import { ui } from "@/data/arayuz";
import {
  DILLER,
  DIL_ADI,
  DIL_BAYRAGI,
  DIL_YONU,
  gecerliDil,
  metin,
  type DilKodu,
} from "@/data/menu";

/**
 * Ekran: Dil seçimi — uygulamanın ilk açılış ekranı.
 *
 * Dört dilin her birinde ayrı bir kopyası var (`/tr`, `/en`, `/ar`, `/ru`).
 * Çevresindeki metinler o dilde, dört buton her zaman dört dili gösteriyor.
 * Arapça kopyada sayfa RTL, çünkü `dir` kök layout'ta URL'den geliyor.
 *
 * Butonlar her biri o dilin ana seçim ekranına bağlanıyor; menüye oradan
 * geçiliyor.
 */
export function generateStaticParams() {
  return DILLER.map((dil) => ({ dil }));
}

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

export default async function DilSecimSayfasi({ params }: PageProps<"/[dil]">) {
  const { dil: ham } = await params;
  if (!gecerliDil(ham)) notFound();
  const dil: DilKodu = ham;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-10 sm:max-w-lg sm:py-14 lg:max-w-xl">
      <div className="flex flex-1 flex-col justify-center py-2">
        <header className="flex flex-col items-center text-center">
          {/* Logo dekoratif: hemen altindaki <h1> ayni bilgiyi veriyor. */}
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

          <div className="mt-4 flex w-full max-w-[13rem] items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-latte-400" />
            <span className="h-1.5 w-1.5 rotate-45 bg-latte-500" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-latte-400" />
          </div>

          <p className="mt-4 text-sm text-cocoa-700 sm:text-base">{ui("slogan", dil)}</p>
        </header>

        <main className="mt-10 sm:mt-12">
          <h2
            id="lang-heading"
            className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-cocoa-700"
          >
            {ui("dilSeciniz", dil)}
          </h2>

          {/* Alt satirda dort dildeki karsiligi; aktif dil disindakiler kendi
              lang niteligiyle isaretli.

              Ayrac noktasi kendi rengini almiyor, paragrafin rengini miras
              aliyor: sutlu kahve tonda 12px'lik bir nokta AA kontrast esigini
              gecemiyordu. */}
          <p className="mt-1.5 text-center text-xs text-cocoa-700/70">
            {DILLER.filter((d) => d !== dil).map((d, i) => (
              <span key={d}>
                {i > 0 ? (
                  <span aria-hidden="true" className="mx-1.5">
                    ·
                  </span>
                ) : null}
                <span lang={d} dir={DIL_YONU[d]}>
                  {ARAYUZ_DIL_SECINIZ[d]}
                </span>
              </span>
            ))}
          </p>

          <div
            id="language-list"
            role="group"
            aria-labelledby="lang-heading"
            className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4"
          >
            {DILLER.map((hedef) => {
              const bayrak = DIL_BAYRAGI[hedef];
              return (
                <Link
                  key={hedef}
                  href={`/${hedef}/secim`}
                  hrefLang={hedef}
                  data-lang={hedef}
                  data-dir={DIL_YONU[hedef]}
                  className="lang-btn"
                >
                  <span className="flag-slot">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/flags/${bayrak.kod}.svg`}
                      alt=""
                      aria-hidden="true"
                      className="flag"
                    />
                  </span>
                  {/*
                    Arapca etikette dir="rtl" YOK: tek yonlu bir metin, yon
                    isareti olmadan da dogru render oluyor. dir verilseydi metin
                    buton icinde saga yaslanip diger uc butonla hizasini bozardi.
                  */}
                  <span className="lang-name" lang={hedef}>
                    {DIL_ADI[hedef]}
                  </span>
                  <span className="sr-only">— {metin(bayrak.ulke, dil)}</span>
                  <Ok />
                </Link>
              );
            })}
          </div>
        </main>
      </div>

      <footer className="mt-10 pt-6 text-center text-xs text-cocoa-700/60">
        <p>Huzur Pide · {ui("dijitalMenu", dil)}</p>
      </footer>
    </div>
  );
}

/** "Dil Seçiniz" ifadesinin dört dildeki hâli — başlığın altındaki satır için. */
const ARAYUZ_DIL_SECINIZ: Record<DilKodu, string> = {
  tr: "Dil Seçiniz",
  en: "Choose language",
  ar: "اختر اللغة",
  ru: "Выберите язык",
};
