import Link from "next/link";

/**
 * Her menü sayfasının üstünde duran "Huzur Pide" başlığı.
 *
 * Logoya basıldığında dil seçim ekranına dönülüyor — QR menüde geri tuşu
 * her zaman elverişli olmuyor, başlığın kendisi çıkış yolu oluyor.
 */
export function UstBaslik({ altBaslik }: { altBaslik?: string }) {
  return (
    <header className="flex flex-col items-center pt-8 pb-6 text-center sm:pt-10">
      <Link
        href="/"
        className="flex flex-col items-center rounded-2xl px-4 py-2 outline-hidden
                   transition-colors duration-150 hover:bg-cream-200/40
                   focus-visible:outline-solid focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-cocoa-900"
      >
        {/* Logo dekoratif: yanindaki metin ayni bilgiyi veriyor. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.svg"
          alt=""
          aria-hidden="true"
          width={48}
          height={48}
          className="h-11 w-11 sm:h-12 sm:w-12"
        />
        <span className="mt-2 font-display text-2xl leading-none tracking-wide text-cocoa-900 sm:text-3xl">
          Huzur Pide
        </span>
      </Link>

      {/* Ince ayrac */}
      <div className="mt-4 flex w-full max-w-[11rem] items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-latte-400" />
        <span className="h-1.5 w-1.5 rotate-45 bg-latte-500" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-latte-400" />
      </div>

      {altBaslik ? (
        <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-cocoa-700 uppercase">
          {altBaslik}
        </p>
      ) : null}
    </header>
  );
}
