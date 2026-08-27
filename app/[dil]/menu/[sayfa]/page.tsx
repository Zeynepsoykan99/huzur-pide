import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SayfaSayaci } from "@/components/SayfaSayaci";
import { UrunGorseli } from "@/components/UrunGorseli";
import { UstBaslik } from "@/components/UstBaslik";
import { ui } from "@/data/arayuz";
import {
  DILLER,
  SAYFALAR,
  fiyatYaz,
  gecerliDil,
  icerikMetni,
  metin,
  sayfaBul,
  type DilKodu,
  type MenuSayfasi,
  type Urun,
} from "@/data/menu";

const KAP_ID = "kitap";

export function generateStaticParams() {
  // 4 dil x 7 sayfa = 28 rota, hepsi derleme aninda statik.
  return DILLER.flatMap((dil) => SAYFALAR.map((s) => ({ dil, sayfa: s.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/menu/[sayfa]">): Promise<Metadata> {
  const { dil, sayfa } = await params;
  const s = sayfaBul(sayfa);
  if (!gecerliDil(dil) || !s) return { title: "Huzur Pide" };
  return { title: `${metin(s.kategori.ad, dil)} · Huzur Pide` };
}

/* ---------------------------------------------------------------------------
   Tek fiyatlı sayfa:  [görsel] Ad ................. 500 ₺

   Görsel yuvası her satırda aynı genişlikte: fotoğrafı olan ürün fotoğrafını,
   olmayan yer tutucusunu gösteriyor. md ve üstünde yuva büyüyor ve sırayla bir
   başta bir sonda duruyor.

   Taraf değiştirmek için `order` kullanılıyor, `ml/mr` değil: `order` yazma
   yönüne göre çalıştığından Arapça'da alternasyon da kendiliğinden aynalanıyor.
   --------------------------------------------------------------------------- */
function TekFiyatliSatir({
  urun,
  dil,
  sonTarafta,
  kategoriSlug,
}: {
  urun: Urun;
  dil: DilKodu;
  sonTarafta: boolean;
  kategoriSlug: string;
}) {
  const fiyat = urun.fiyatlar[0];
  const icerik = icerikMetni(urun, dil);

  return (
    <li className="urun-satir">
      <span className={`gorsel-yuvasi ${sonTarafta ? "md:order-last" : ""}`}>
        <UrunGorseli urun={urun} dil={dil} kategoriSlug={kategoriSlug} />
      </span>

      <div className="urun-govde">
        <div className="ayrac-satir">
          <span className="urun-ad">{metin(urun.ad, dil)}</span>
          <span className="nokta" aria-hidden="true" />
          <span className="urun-fiyat" data-dogrulandi={fiyat.dogrulandi}>
            {fiyatYaz(fiyat.tutar)}
          </span>
        </div>
        {icerik ? <p className="urun-icerik">{icerik}</p> : null}
      </div>
    </li>
  );
}

/* ---------------------------------------------------------------------------
   Çok fiyatlı sayfa (kapalı pideler)

   Veri gerçekten tablo: ürün x hamur boyu -> fiyat. Bu yüzden CSS ızgara değil
   gerçek <table>: sütun başlıkları fiyat hücrelerinin tam üstüne oturuyor ve
   <th scope="col"> sayesinde ekran okuyucu her hücrenin hangi sütuna ait
   olduğunu kendiliğinden söylüyor. Tablo Arapça'da kendiliğinden aynalanıyor.
   --------------------------------------------------------------------------- */
function CokFiyatliTablo({ sayfa, dil }: { sayfa: MenuSayfasi; dil: DilKodu }) {
  const { kategori, urunler } = sayfa;
  return (
    <table className="pide-tablo mt-6">
      <caption className="sr-only">
        {metin(kategori.ad, dil)} — {ui("hamurBoyunaGoreFiyatlar", dil)}
      </caption>
      <colgroup>
        {/* Telefonda 56px, md ustunde 208px: cok fiyatli tabloda ad sutunu
            uc fiyat sutunuyla yeri paylastigi icin 390px'te 110px'e kadar
            dusuyordu ve Arapca/Ingilizce/Rusca adlar 3-5 satira sariyordu. */}
        <col className="w-14 md:w-52" />
        <col />
        {kategori.sutunlar.map((s) => (
          <col key={s.kod} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th scope="col">
            <span className="sr-only">{ui("gorsel", dil)}</span>
          </th>
          <th scope="col" className="pide-sutun-basligi text-start">
            <span className="sr-only">{ui("urun", dil)}</span>
          </th>
          {kategori.sutunlar.map((sutun) => (
            <th key={sutun.kod} scope="col" className="pide-sutun-basligi">
              {metin(sutun.baslik, dil)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {urunler.map((urun) => (
          <tr key={urun.id}>
            <td className="pide-gorsel-hucre">
              <UrunGorseli urun={urun} dil={dil} kategoriSlug={kategori.slug} dar />
            </td>
            <th scope="row" className="pide-ad-hucre">
              <div className="ayrac-satir">
                <span className="urun-ad">{metin(urun.ad, dil)}</span>
                <span className="nokta" aria-hidden="true" />
              </div>
              {icerikMetni(urun, dil) ? (
                <p className="urun-icerik">{icerikMetni(urun, dil)}</p>
              ) : null}
            </th>
            {kategori.sutunlar.map((sutun) => {
              const fiyat = urun.fiyatlar.find((f) => f.sutun === sutun.kod);
              const bos = !fiyat || fiyat.tutar === null;
              return (
                <td
                  key={sutun.kod}
                  className={`pide-hucre ${bos ? "pide-hucre-bos" : ""}`}
                  data-dogrulandi={fiyat?.dogrulandi ?? true}
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

/** Kitabın tek bir yaprağı. */
function Yaprak({ sayfa, dil }: { sayfa: MenuSayfasi; dil: DilKodu }) {
  const cokSutunlu = sayfa.kategori.sutunlar.length > 1;
  return (
    <section
      id={`s${sayfa.no}`}
      className="kitap-sayfa"
      aria-label={`${metin(sayfa.kategori.ad, dil)} — ${ui("sayfa", dil)} ${sayfa.no}`}
    >
      <div className="kitap-icerik">
        <h2 className="kitap-baslik">
          {metin(sayfa.kategori.ad, dil)}
          {sayfa.kategoriToplamSayfa > 1 ? (
            <span className="sr-only">
              {" "}
              ({sayfa.kategoriIcindeNo}/{sayfa.kategoriToplamSayfa})
            </span>
          ) : null}
        </h2>

        {cokSutunlu ? (
          <CokFiyatliTablo sayfa={sayfa} dil={dil} />
        ) : (
          <ul className="mt-6">
            {sayfa.urunler.map((urun, i) => (
              <TekFiyatliSatir
                key={urun.id}
                urun={urun}
                dil={dil}
                sonTarafta={(sayfa.no + i) % 2 === 1}
                kategoriSlug={sayfa.kategori.slug}
              />
            ))}
          </ul>
        )}

        <nav className="mt-10 flex justify-center">
          <Link
            href={`/${dil}/menu`}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-cocoa-700
                       outline-hidden transition-colors duration-150
                       hover:bg-cream-200/70 hover:text-cocoa-900
                       focus-visible:outline-solid focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-cocoa-900"
          >
            {ui("menuyeDon", dil)}
          </Link>
        </nav>
      </div>
    </section>
  );
}

export default async function MenuKitabiSayfasi({
  params,
}: PageProps<"/[dil]/menu/[sayfa]">) {
  const { dil: ham, sayfa: slug } = await params;
  if (!gecerliDil(ham)) notFound();
  const dil: DilKodu = ham;

  const acilis = sayfaBul(slug);
  if (!acilis) notFound();

  const sayfaListesi = SAYFALAR.map((s) => ({ slug: s.slug, no: s.no }));

  return (
    <div className="kitap-cercevesi">
      <UstBaslik dil={dil} yol={`/menu/${acilis.slug}`} sikisik />

      {/*
        Kitabın tamamı her rotada basılıyor; hangi sayfada açılacağını
        aşağıdaki senkron script belirliyor. Böylece 7 sayfanın hepsi tek
        belgede geliyor ve müşteri kaydırarak menünün her yerine ulaşabiliyor —
        kategori değiştirmek için menüye dönmesi gerekmiyor.
      */}
      <div id={KAP_ID} className="kitap" data-acilis={acilis.no}>
        {SAYFALAR.map((s) => (
          <Yaprak key={s.no} sayfa={s} dil={dil} />
        ))}
      </div>

      {/*
        İlk konumlandırma. React'in effect'i ilk boyamadan SONRA çalıştığı için
        orada yapılsaydı paylaşılan bir link açılırken bir kare boyunca 1. sayfa
        görünürdü. Bu script HTML ayrıştırılırken, kap DOM'a girdikten hemen
        sonra çalışıyor; ekrana hiç yanlış sayfa düşmüyor.

        scrollIntoView kullanılıyor çünkü yazma yönünü kendisi hesaba katıyor:
        Arapça'da (dir="rtl") scrollLeft negatif değer alıyor, elle hesap
        yapmak tarayıcıdan tarayıcıya değişiyordu.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var k=document.getElementById(${JSON.stringify(KAP_ID)});if(!k)return;var n=k.getAttribute("data-acilis");var h=document.getElementById("s"+n);if(h&&h.scrollIntoView)h.scrollIntoView({block:"nearest",inline:"start",behavior:"instant"});})();`,
        }}
      />

      {/* "3 / 7" — bidi karismasin diye sayac her dilde soldan saga. */}
      <p className="sayfa-numarasi" dir="ltr">
        <span className="sr-only">{ui("sayfa", dil)} </span>
        <SayfaSayaci
          kabId={KAP_ID}
          sayfalar={sayfaListesi}
          dil={dil}
          baslangicNo={acilis.no}
        />
        {" / "}
        {SAYFALAR.length}
      </p>
    </div>
  );
}
