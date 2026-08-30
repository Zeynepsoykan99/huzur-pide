import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AsagiOk } from "@/components/AsagiOk";
import { PideIkonu, SofraIkonu } from "@/components/Ikonlar";
import { SayfaOklari } from "@/components/SayfaOklari";
import { SayfaSayaci } from "@/components/SayfaSayaci";
import { ui } from "@/data/arayuz";
import {
  DILLER,
  DIL_ADI,
  DIL_BAYRAGI,
  MENU,
  SAYFALAR,
  gecerliDil,
  kategorininSayfasi,
  metin,
  sayfaNumarasi,
  type DilKodu,
} from "@/data/menu";
import { TUM_FONT_DEGISKENLERI } from "../fontlar";
import {
  Chevron,
  EKRANLAR,
  EKRAN_ADI,
  Marka,
  Motif,
  OzUstBaslik,
  YONLER,
  YON_ADI,
  Yaprak,
  gecerliEkran,
  gecerliYon,
  type Ekran,
  type Yon,
} from "../parcalar";
import "../onizleme.css";

/**
 * TASARIM ÖNİZLEMESİ — bir yönün TEK bir ekranı.
 *
 * Uygulamanın görünen bütün yüzeyi burada: dil seçimi, ana seçim, kategori
 * listesi, menü kitabı, organizasyon ve 404. Amaç iki yönü aynı ekranlar
 * üzerinden yan yana karşılaştırabilmek — tasarım dili uygulamanın tamamını
 * kapsıyor, yalnızca menüyü değil.
 *
 * Canlı siteye HİÇ dokunmuyor: kendi rotası, kendi CSS dosyası, kendi yazı
 * tipleri. Menü verisi ve arayüz metinleri aynı kaynaktan okunuyor.
 */

const KAP_ID = "kitap";

export function generateStaticParams() {
  return DILLER.flatMap((dil) =>
    YONLER.flatMap((yon) => EKRANLAR.map((ekran) => ({ dil, yon, ekran }))),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/onizleme/[yon]/[ekran]">): Promise<Metadata> {
  const { yon, ekran } = await params;
  const yonAdi = gecerliYon(yon) ? YON_ADI[yon] : "Önizleme";
  const ekranAdi = gecerliEkran(ekran) ? EKRAN_ADI[ekran] : "";
  return { title: `${ekranAdi} · ${yonAdi} · Önizleme` };
}

/* =========================================================================
   EKRAN 1 — Dil seçimi
   ========================================================================= */
function DilSecimEkrani({ yon, dil }: { yon: Yon; dil: DilKodu }) {
  return (
    <div className="oz-tek-ekran">
      <div className="oz-giris">
        <div className="oz-giris-tepe">
          <Motif yon={yon} className="oz-giris-motif" />
          <Marka yon={yon} buyuk />
          <div className="oz-giris-ayrac" aria-hidden="true">
            <span className="oz-kural" />
            <Motif yon={yon} className="oz-motif" />
            <span className="oz-kural" />
          </div>
          <p className="oz-slogan">{ui("slogan", dil)}</p>
        </div>

        <h2 className="oz-ust-baslik-kucuk">{ui("dilSeciniz", dil)}</h2>

        <div className="oz-dil-kartlari">
          {DILLER.map((hedef) => (
            <Link
              key={hedef}
              href={`/${hedef}/onizleme/${yon}/secim`}
              hrefLang={hedef}
              className="oz-dil-karti"
            >
              <span className="oz-bayrak-yuva">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/flags/${DIL_BAYRAGI[hedef].kod}.svg`}
                  alt=""
                  aria-hidden="true"
                  className="oz-bayrak"
                />
              </span>
              <span className="oz-dil-adi" lang={hedef}>
                {DIL_ADI[hedef]}
              </span>
              <Chevron className="oz-karti-ok" />
            </Link>
          ))}
        </div>
      </div>

      <footer className="oz-dipnot">
        Huzur Pide · {ui("dijitalMenu", dil)}
      </footer>
    </div>
  );
}

/* =========================================================================
   EKRAN 2 — Ana seçim
   ========================================================================= */
function AnaSecimEkrani({ yon, dil }: { yon: Yon; dil: DilKodu }) {
  const kartlar = [
    { yol: `/${dil}/onizleme/${yon}/liste`, baslik: ui("menu", dil), Ikon: PideIkonu },
    {
      yol: `/${dil}/onizleme/${yon}/organizasyon`,
      baslik: ui("organizasyon", dil),
      Ikon: SofraIkonu,
    },
  ];
  return (
    <div className="oz-tek-ekran">
      <OzUstBaslik yon={yon} dil={dil} ekran="secim" />
      <main className="oz-govde-alani">
        <h1 className="sr-only">Huzur Pide — {ui("bolumSecin", dil)}</h1>
        <ul className="oz-secim-listesi">
          {kartlar.map(({ yol, baslik, Ikon }) => (
            <li key={yol}>
              <Link href={yol} className="oz-secim-karti">
                <Ikon className="oz-secim-ikonu" />
                <span className="oz-secim-basligi">{baslik}</span>
                <Chevron className="oz-karti-ok" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

/* =========================================================================
   EKRAN 3 — Kategori listesi (içindekiler)
   ========================================================================= */
function KategoriListesiEkrani({ yon, dil }: { yon: Yon; dil: DilKodu }) {
  return (
    <div className="oz-tek-ekran">
      <OzUstBaslik yon={yon} dil={dil} ekran="liste" />
      <main className="oz-govde-alani">
        <div className="oz-baslik-blok oz-liste-basligi">
          <h1 className="oz-baslik">{ui("menu", dil)}</h1>
          <div className="oz-baslik-alt" aria-hidden="true">
            <span className="oz-kural" />
            <Motif yon={yon} className="oz-motif" />
            <span className="oz-kural" />
          </div>
        </div>

        <nav aria-label={ui("menuKategorileri", dil)}>
          <ul className="oz-icindekiler">
            {MENU.map((kategori) => (
              <li key={kategori.slug}>
                <Link
                  href={`/${dil}/onizleme/${yon}/menu`}
                  className="oz-icindekiler-satir"
                >
                  <span className="oz-icindekiler-no" aria-hidden="true">
                    {String(sayfaNumarasi(kategori)).padStart(2, "0")}
                  </span>
                  <span className="oz-icindekiler-ad">
                    {metin(kategori.ad, dil)}
                  </span>
                  <span className="oz-ayrac" aria-hidden="true" />
                  <span className="oz-icindekiler-sayfa">
                    <span className="sr-only">{ui("sayfa", dil)} </span>
                    {kategorininSayfasi(kategori).no}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}

/* =========================================================================
   EKRAN 4 — Menü kitabı (yatay akış, gerçek ok bileşenleriyle)
   ========================================================================= */
function MenuKitabiEkrani({ yon, dil }: { yon: Yon; dil: DilKodu }) {
  const acilis = SAYFALAR[0];
  const sayfaListesi = SAYFALAR.map((s) => ({ slug: s.slug, no: s.no }));

  return (
    <>
      <OzUstBaslik yon={yon} dil={dil} ekran="menu" />

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
        <Link href={`/${dil}/onizleme/${yon}/liste`} className="oz-alt-baglanti">
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
    </>
  );
}

/* =========================================================================
   EKRAN 5 — Organizasyon
   ========================================================================= */
function OrganizasyonEkrani({ yon, dil }: { yon: Yon; dil: DilKodu }) {
  return (
    <div className="oz-tek-ekran">
      <OzUstBaslik yon={yon} dil={dil} ekran="organizasyon" />
      <main className="oz-govde-alani">
        <div className="oz-baslik-blok oz-liste-basligi">
          <h1 className="oz-baslik">{ui("organizasyon", dil)}</h1>
          <div className="oz-baslik-alt" aria-hidden="true">
            <span className="oz-kural" />
            <Motif yon={yon} className="oz-motif" />
            <span className="oz-kural" />
          </div>
        </div>

        <div className="oz-bos-durum">
          <SofraIkonu className="oz-bos-ikon" />
          <p className="oz-bos-metin">{ui("yakinda", dil)}</p>
        </div>

        <nav className="oz-orta-baglanti">
          <Link
            href={`/${dil}/onizleme/${yon}/secim`}
            className="oz-alt-baglanti"
          >
            {ui("anaEkranaDon", dil)}
          </Link>
        </nav>
      </main>
    </div>
  );
}

/* =========================================================================
   EKRAN 6 — 404
   Metin uydurulmadı: yalnızca mevcut arayüz anahtarları kullanılıyor.
   ========================================================================= */
function BulunamadiEkrani({ yon, dil }: { yon: Yon; dil: DilKodu }) {
  return (
    <div className="oz-tek-ekran">
      <OzUstBaslik yon={yon} dil={dil} ekran="bulunamadi" />
      <main className="oz-govde-alani oz-404">
        <span className="oz-404-sayi" aria-hidden="true">
          404
        </span>
        <Motif yon={yon} className="oz-404-motif" />
        <nav className="oz-orta-baglanti">
          <Link
            href={`/${dil}/onizleme/${yon}/secim`}
            className="oz-alt-baglanti"
          >
            {ui("anaEkranaDon", dil)}
          </Link>
        </nav>
      </main>
    </div>
  );
}

/* ========================================================================= */

export default async function OnizlemeEkrani({
  params,
}: PageProps<"/[dil]/onizleme/[yon]/[ekran]">) {
  const { dil: hamDil, yon: hamYon, ekran: hamEkran } = await params;
  if (!gecerliDil(hamDil) || !gecerliYon(hamYon) || !gecerliEkran(hamEkran)) {
    notFound();
  }
  const dil: DilKodu = hamDil;
  const yon: Yon = hamYon;
  const ekran: Ekran = hamEkran;

  const govde = {
    diller: <DilSecimEkrani yon={yon} dil={dil} />,
    secim: <AnaSecimEkrani yon={yon} dil={dil} />,
    liste: <KategoriListesiEkrani yon={yon} dil={dil} />,
    menu: <MenuKitabiEkrani yon={yon} dil={dil} />,
    organizasyon: <OrganizasyonEkrani yon={yon} dil={dil} />,
    bulunamadi: <BulunamadiEkrani yon={yon} dil={dil} />,
  }[ekran];

  return <div className={`oz yon-${yon} ${TUM_FONT_DEGISKENLERI}`}>{govde}</div>;
}
