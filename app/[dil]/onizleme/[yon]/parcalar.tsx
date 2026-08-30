import Image from "next/image";
import Link from "next/link";
import {
  YerTutucuIcecek,
  YerTutucuIzgara,
  YerTutucuPide,
  YerTutucuSalata,
  YerTutucuTatli,
} from "@/components/Ikonlar";
import { ui } from "@/data/arayuz";
import {
  DILLER,
  DIL_KISA_AD,
  fiyatYaz,
  icerikMetni,
  metin,
  type DilKodu,
  type MenuSayfasi,
  type Urun,
} from "@/data/menu";

/**
 * Önizleme yönlerinin paylaşılan parçaları.
 *
 * İki yön de AYNI iskeleti kullanıyor; fark yalnızca CSS değişkenlerinde ve
 * motiflerde. Böylece bir ekranın iki yöndeki hâli birebir karşılaştırılabilir
 * oluyor — kıyas düzen farkından değil, tasarım dilinden geliyor.
 */

export const YONLER = ["gece", "cini"] as const;
export type Yon = (typeof YONLER)[number];

export const YON_ADI: Record<Yon, string> = {
  gece: "Gece Ocağı",
  cini: "Çini Levha",
};

export function gecerliYon(deger: string): deger is Yon {
  return (YONLER as readonly string[]).includes(deger);
}

export const EKRANLAR = [
  "diller",
  "secim",
  "liste",
  "menu",
  "organizasyon",
  "bulunamadi",
] as const;
export type Ekran = (typeof EKRANLAR)[number];

export const EKRAN_ADI: Record<Ekran, string> = {
  diller: "Dil seçimi",
  secim: "Ana seçim",
  liste: "Kategori listesi",
  menu: "Menü kitabı",
  organizasyon: "Organizasyon",
  bulunamadi: "404",
};

export function gecerliEkran(deger: string): deger is Ekran {
  return (EKRANLAR as readonly string[]).includes(deger);
}

/* ---------------------------------------------------------------------------
   Motifler — her yönün imzası
   --------------------------------------------------------------------------- */

/** Gece Ocağı: köz/alev. */
function AlevMotifi({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    </svg>
  );
}

/** Çini Levha: İznik sekiz köşeli yıldızı. */
function YildizMotifi({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    </svg>
  );
}

export function Motif({ yon, className }: { yon: Yon; className?: string }) {
  return yon === "gece" ? (
    <AlevMotifi className={className} />
  ) : (
    <YildizMotifi className={className} />
  );
}

/** İleri yönü gösteren chevron; aynalama CSS'te. */
export function Chevron({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

/* ---------------------------------------------------------------------------
   Marka kilidi — logo yerine yönün motifi + kelime markası
   --------------------------------------------------------------------------- */
export function Marka({
  yon,
  buyuk = false,
}: {
  yon: Yon;
  buyuk?: boolean;
}) {
  return (
    <span className={buyuk ? "oz-marka oz-marka-buyuk" : "oz-marka"}>
      <Motif yon={yon} className="oz-marka-isaret" />
      Huzur Pide
    </span>
  );
}

/** Üst şerit: marka + dil seçenekleri. Her ekranda aynı. */
export function OzUstBaslik({
  yon,
  dil,
  ekran,
}: {
  yon: Yon;
  dil: DilKodu;
  ekran: Ekran;
}) {
  return (
    <header className="oz-ust">
      <Marka yon={yon} />
      <nav className="oz-diller" aria-label={ui("dilDegistir", dil)}>
        {DILLER.map((d) => (
          <Link
            key={d}
            href={`/${d}/onizleme/${yon}/${ekran}`}
            className={`oz-dil ${d === dil ? "oz-dil-aktif" : ""}`}
          >
            {DIL_KISA_AD[d]}
          </Link>
        ))}
      </nav>
    </header>
  );
}

/* ---------------------------------------------------------------------------
   Ürün görseli / yer tutucu
   --------------------------------------------------------------------------- */

const YER_TUTUCULAR: Record<string, (p: { className?: string }) => React.ReactElement> = {
  "kapali-pide": YerTutucuPide,
  izgara: YerTutucuIzgara,
  salatalar: YerTutucuSalata,
  tatlilar: YerTutucuTatli,
  icecekler: YerTutucuIcecek,
};

/**
 * Fotoğrafı olmayan 24 ürünün yuvası boş kalmıyor: kategorisinin kendi
 * silüeti, yönün renginde. Kategoriye göre ikon kullanılıyor — içeceğe pide
 * silüeti göstermek anlamca yanlış olurdu, ayrıca aynı şekil alt alta
 * tekrarlanınca desen gibi okunuyordu.
 */
export function GorselYuvasi({
  urun,
  dil,
  kategoriSlug,
}: {
  urun: Urun;
  dil: DilKodu;
  kategoriSlug: string;
}) {
  if (!urun.gorsel) {
    const Ikon = YER_TUTUCULAR[kategoriSlug] ?? YerTutucuPide;
    return (
      <span className="oz-gorsel-yuva" aria-hidden="true">
        <Ikon className="oz-yer-tutucu-motif" />
      </span>
    );
  }
  return (
    <span className="oz-gorsel-yuva">
      <Image
        src={urun.gorsel.src}
        alt={metin(urun.gorsel.alt, dil)}
        width={urun.gorsel.genislik}
        height={urun.gorsel.yukseklik}
      />
    </span>
  );
}

/* ---------------------------------------------------------------------------
   Menü kitabının iç parçaları
   --------------------------------------------------------------------------- */

function Satir({
  urun,
  dil,
  kategoriSlug,
}: {
  urun: Urun;
  dil: DilKodu;
  kategoriSlug: string;
}) {
  const icerik = icerikMetni(urun, dil);
  return (
    <li className="oz-satir">
      <GorselYuvasi urun={urun} dil={dil} kategoriSlug={kategoriSlug} />
      <div className="oz-govde">
        <div className="oz-ad-satir">
          <span className="oz-ad">{metin(urun.ad, dil)}</span>
          <span className="oz-ayrac" aria-hidden="true" />
          <span className="oz-fiyat">{fiyatYaz(urun.fiyatlar[0].tutar)}</span>
        </div>
        {icerik ? <p className="oz-icerik">{icerik}</p> : null}
      </div>
    </li>
  );
}

function Tablo({ sayfa, dil }: { sayfa: MenuSayfasi; dil: DilKodu }) {
  const { kategori, urunler } = sayfa;
  return (
    <table className="oz-tablo">
      <caption className="sr-only">
        {metin(kategori.ad, dil)} — {ui("hamurBoyunaGoreFiyatlar", dil)}
      </caption>
      <thead>
        <tr>
          <th scope="col">
            <span className="sr-only">{ui("gorsel", dil)}</span>
          </th>
          <th scope="col">
            <span className="sr-only">{ui("urun", dil)}</span>
          </th>
          {kategori.sutunlar.map((sutun) => (
            <th key={sutun.kod} scope="col" className="oz-sutun-basligi">
              {metin(sutun.baslik, dil)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {urunler.map((urun) => (
          <tr key={urun.id}>
            <td className="oz-hucre-gorsel">
              <GorselYuvasi urun={urun} dil={dil} kategoriSlug={kategori.slug} />
            </td>
            <th scope="row" className="oz-hucre-ad">
              <span className="oz-ad">{metin(urun.ad, dil)}</span>
              {icerikMetni(urun, dil) ? (
                <p className="oz-icerik">{icerikMetni(urun, dil)}</p>
              ) : null}
            </th>
            {kategori.sutunlar.map((sutun) => {
              const fiyat = urun.fiyatlar.find((f) => f.sutun === sutun.kod);
              const bos = !fiyat || fiyat.tutar === null;
              return (
                <td
                  key={sutun.kod}
                  className={`oz-hucre-fiyat ${bos ? "oz-hucre-bos" : ""}`}
                >
                  {fiyatYaz(fiyat?.tutar ?? null)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Kitabın bir yaprağı. */
export function Yaprak({
  sayfa,
  dil,
  yon,
}: {
  sayfa: MenuSayfasi;
  dil: DilKodu;
  yon: Yon;
}) {
  const cokSutunlu = sayfa.kategori.sutunlar.length > 1;
  const govde = cokSutunlu ? (
    <Tablo sayfa={sayfa} dil={dil} />
  ) : (
    <ul className="oz-liste">
      {sayfa.urunler.map((urun) => (
        <Satir
          key={urun.id}
          urun={urun}
          dil={dil}
          kategoriSlug={sayfa.kategori.slug}
        />
      ))}
    </ul>
  );

  const icerik = (
    <>
      <div className="oz-baslik-blok">
        <span className="oz-hayalet-no" aria-hidden="true">
          {sayfa.no}
        </span>
        <h2 className="oz-baslik">{metin(sayfa.kategori.ad, dil)}</h2>
        <div className="oz-baslik-alt" aria-hidden="true">
          <span className="oz-kural" />
          <Motif yon={yon} className="oz-motif" />
          <span className="oz-kural" />
        </div>
      </div>
      {govde}
    </>
  );

  return (
    <section
      id={`s${sayfa.no}`}
      className="oz-sayfa"
      aria-label={`${metin(sayfa.kategori.ad, dil)} — ${ui("sayfa", dil)} ${sayfa.no}`}
    >
      <div className="kitap-icerik">
        {yon === "cini" ? <div className="oz-levha">{icerik}</div> : icerik}
      </div>
    </section>
  );
}
