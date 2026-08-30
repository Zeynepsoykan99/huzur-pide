import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AsagiOk } from "@/components/AsagiOk";
import { SayfaOklari } from "@/components/SayfaOklari";
import { SayfaSayaci } from "@/components/SayfaSayaci";
import { ui } from "@/data/arayuz";
import {
  DILLER,
  DIL_KISA_AD,
  SAYFALAR,
  fiyatYaz,
  gecerliDil,
  icerikMetni,
  metin,
  type DilKodu,
  type MenuSayfasi,
  type Urun,
} from "@/data/menu";
import { TUM_FONT_DEGISKENLERI } from "./fontlar";
import "./onizleme.css";

/**
 * TASARIM ÖNİZLEMESİ — iki yön, gerçek veriyle.
 *
 * Canlı menüye hiç dokunmuyor: kendi rotası, kendi CSS dosyası, kendi
 * yazı tipleri. Menü verisi (`SAYFALAR`) ve arayüz metinleri aynı kaynaktan
 * okunuyor, böylece önizleme gerçek uzunluktaki adlarla ve gerçek
 * fiyatlarla sınanıyor.
 *
 * Yatay akış, sayfa çevirme okları ve aşağı ok ipucu GERÇEK bileşenler —
 * `SayfaOklari` ve `AsagiOk` olduğu gibi kullanılıyor, yalnızca boyaları
 * değişiyor. Böylece önizlemede görülen davranış canlıdaki davranışın
 * aynısı.
 */

const KAP_ID = "kitap";

const YONLER = ["gece", "cini"] as const;
type Yon = (typeof YONLER)[number];

const YON_ADI: Record<Yon, string> = {
  gece: "Gece Ocağı",
  cini: "Çini Levha",
};

function gecerliYon(deger: string): deger is Yon {
  return (YONLER as readonly string[]).includes(deger);
}

export function generateStaticParams() {
  return DILLER.flatMap((dil) => YONLER.map((yon) => ({ dil, yon })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/onizleme/[yon]">): Promise<Metadata> {
  const { yon } = await params;
  const ad = gecerliYon(yon) ? YON_ADI[yon] : "Önizleme";
  return { title: `${ad} · Önizleme · Huzur Pide` };
}

/* ---------------------------------------------------------------------------
   Süsleme motifleri — her yönün karakteri buradan geliyor.
   --------------------------------------------------------------------------- */

/** Gece Ocağı: köz/alev elması. */
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

function Motif({ yon, className }: { yon: Yon; className?: string }) {
  return yon === "gece" ? (
    <AlevMotifi className={className} />
  ) : (
    <YildizMotifi className={className} />
  );
}

/* ---------------------------------------------------------------------------
   Görsel yuvası — fotoğrafı olan ürün fotoğrafını, olmayan yönün motifini
   gösteriyor. 24 fotoğrafsız ürün boş kutu bırakmıyor.
   --------------------------------------------------------------------------- */
function GorselYuvasi({ urun, dil, yon }: { urun: Urun; dil: DilKodu; yon: Yon }) {
  if (!urun.gorsel) {
    return (
      <span className="oz-gorsel-yuva">
        <Motif yon={yon} className="oz-yer-tutucu-motif" />
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

/* --- Tek fiyatlı satır --- */
function Satir({ urun, dil, yon }: { urun: Urun; dil: DilKodu; yon: Yon }) {
  const icerik = icerikMetni(urun, dil);
  return (
    <li className="oz-satir">
      <GorselYuvasi urun={urun} dil={dil} yon={yon} />
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

/* --- Çok fiyatlı tablo --- */
function Tablo({ sayfa, dil, yon }: { sayfa: MenuSayfasi; dil: DilKodu; yon: Yon }) {
  const { kategori, urunler } = sayfa;
  return (
    <table className="oz-tablo">
      <caption className="sr-only">{metin(kategori.ad, dil)}</caption>
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
              <GorselYuvasi urun={urun} dil={dil} yon={yon} />
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

/* --- Kitabın bir yaprağı --- */
function Yaprak({ sayfa, dil, yon }: { sayfa: MenuSayfasi; dil: DilKodu; yon: Yon }) {
  const cokSutunlu = sayfa.kategori.sutunlar.length > 1;
  const govde = cokSutunlu ? (
    <Tablo sayfa={sayfa} dil={dil} yon={yon} />
  ) : (
    <ul className="oz-liste">
      {sayfa.urunler.map((urun) => (
        <Satir key={urun.id} urun={urun} dil={dil} yon={yon} />
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

/* ---------------------------------------------------------------------------
   Sayfa
   --------------------------------------------------------------------------- */
export default async function OnizlemeSayfasi({
  params,
}: PageProps<"/[dil]/onizleme/[yon]">) {
  const { dil: hamDil, yon: hamYon } = await params;
  if (!gecerliDil(hamDil) || !gecerliYon(hamYon)) notFound();
  const dil: DilKodu = hamDil;
  const yon: Yon = hamYon;

  const acilis = SAYFALAR[0];
  const sayfaListesi = SAYFALAR.map((s) => ({ slug: s.slug, no: s.no }));

  return (
    <div className={`oz yon-${yon} ${TUM_FONT_DEGISKENLERI}`}>
      <header className="oz-ust">
        <span className="oz-marka">
          <Motif yon={yon} className="oz-marka-isaret" />
          Huzur Pide
        </span>
        <nav className="oz-diller" aria-label={ui("dilDegistir", dil)}>
          {DILLER.map((d) => (
            <Link
              key={d}
              href={`/${d}/onizleme/${yon}`}
              className={`oz-dil ${d === dil ? "oz-dil-aktif" : ""}`}
            >
              {DIL_KISA_AD[d]}
            </Link>
          ))}
        </nav>
      </header>

      <div className="oz-alan">
        <div id={KAP_ID} className="kitap" data-acilis={acilis.no}>
          {SAYFALAR.map((s) => (
            <Yaprak key={s.no} sayfa={s} dil={dil} yon={yon} />
          ))}
        </div>

        <SayfaOklari
          kabId={KAP_ID}
          sayfalar={sayfaListesi}
          dil={dil}
          baslangicNo={acilis.no}
        />
      </div>

      <div className="oz-alt">
        <Link href={`/${dil}/menu`} className="oz-alt-baglanti">
          {ui("menuyeDon", dil)}
        </Link>

        <AsagiOk
          kabId={KAP_ID}
          sayfalar={sayfaListesi}
          dil={dil}
          baslangicNo={acilis.no}
        />

        <p className="oz-sayac" dir="ltr">
          <span className="sr-only">{ui("sayfa", dil)} </span>
          <SayfaSayaci
            kabId={KAP_ID}
            sayfalar={sayfaListesi}
            dil={dil}
            baslangicNo={acilis.no}
            baslangicSlug={acilis.slug}
          />
          {" / "}
          {SAYFALAR.length}
        </p>
      </div>
    </div>
  );
}
