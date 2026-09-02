import { VARSAYILAN_TEMA, type TemaKodu } from "@/data/tema";

/**
 * Temanın imza motifi — marka işareti, başlık ayracı ve 404 ekranında aynı
 * şekil kullanılıyor.
 *
 * Sabit bir logo dosyası yerine bileşen: marka işareti temayla birlikte
 * değişiyor, böylece tema değiştiğinde ekranda "eski temadan kalma" tek bir
 * öğe kalmıyor. Hepsi `currentColor` kullanıyor, rengi temadan geliyor.
 *
 * `tema` her zaman dışarıdan veriliyor (sayfa Firestore'dan okuyor);
 * varsayılan yalnızca emniyet değeri.
 */

/** Çini Levha: İznik sekiz köşeli yıldızı. */
function CiniMotifi() {
  return (
    <>
      <path
        d="M12 1.5 14.6 7l5.9.4-4.5 3.9 1.4 5.8L12 14l-5.4 3.1L8 11.3 3.5 7.4 9.4 7 12 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M12 6.6 13.3 10l3.4.2-2.6 2.2.8 3.3-2.9-1.8-2.9 1.8.8-3.3L7.3 10l3.4-.2L12 6.6Z"
        fill="currentColor"
        opacity="0.55"
      />
    </>
  );
}

/** Gece Ocağı: köz ve alev. */
function GeceMotifi() {
  return (
    <>
      <path
        d="M12 2c1.6 4 5 5.6 5 9.6A5 5 0 0 1 7 11.6C7 7.6 10.4 6 12 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M12 21c-2.2 0-4-1.5-4-3.4 0-1.9 1.6-2.7 2.4-4 .5 1.4 1.6 1.9 1.6 3 0-1.3 1-2 1.6-3 .8 1.3 2.4 2.1 2.4 4 0 1.9-1.8 3.4-4 3.4Z"
        fill="currentColor"
        opacity="0.9"
      />
    </>
  );
}

/** Mürekkep: matbaa kuralı — kalın çizgi ve baklava. Süsleme değil, işaret. */
function MurekkepMotifi() {
  return (
    <>
      <path d="M2 12h6.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
      <path d="M15.8 12H22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
      <path d="M12 7.4 16.6 12 12 16.6 7.4 12 12 7.4Z" fill="currentColor" />
    </>
  );
}

/** Zeytin: dalda iki yaprak ve bir tane. */
function ZeytinMotifi() {
  return (
    <>
      <path
        d="M12 21.5V7.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M12 12.4c-3.4 0-5.6-1.8-5.6-4.6 3.4 0 5.6 1.8 5.6 4.6Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M12 9.2c0-2.8 2.2-4.6 5.6-4.6 0 2.8-2.2 4.6-5.6 4.6Z"
        fill="currentColor"
        opacity="0.85"
      />
      <circle cx="12" cy="4.4" r="2.1" stroke="currentColor" strokeWidth="1.3" />
    </>
  );
}

const MOTIFLER: Record<TemaKodu, () => React.ReactElement> = {
  cini: CiniMotifi,
  gece: GeceMotifi,
  murekkep: MurekkepMotifi,
  zeytin: ZeytinMotifi,
};

export function TemaMotifi({
  className,
  tema = VARSAYILAN_TEMA,
}: {
  className?: string;
  tema?: TemaKodu;
}) {
  const Sekil = MOTIFLER[tema];
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <Sekil />
    </svg>
  );
}
