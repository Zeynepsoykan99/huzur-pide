import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AsagiOk } from "@/components/AsagiOk";
import { SayfaOklari } from "@/components/SayfaOklari";
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
  // 4 dil x 5 sayfa (kategori basina bir) = 20 rota, hepsi derleme aninda statik.
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
    <table className="pide-tablo mt-2 md:mt-6">
      <caption className="sr-only">
        {metin(kategori.ad, dil)} — {ui("hamurBoyunaGoreFiyatlar", dil)}
      </caption>
      <colgroup>
        {/* Gorsel sutunu her ekranda duruyor. Telefonda bir sure gizliydi —
            sayfayi tek ekrana sigdirmak icindi, o hedef birakildi.
            Genislik: telefonda 56px, md ustunde 208px. */}
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
                /* Tam metin. Telefonda bir sure tek satira kirpiliyordu —
                   sayfayi tek ekrana sigdirmak icindi, o hedef birakildi. */
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
        <h2 className="kitap-baslik">{metin(sayfa.kategori.ad, dil)}</h2>

        {cokSutunlu ? (
          <CokFiyatliTablo sayfa={sayfa} dil={dil} />
        ) : (
          <ul className="mt-2 md:mt-6">
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
      <div className="kitap-alani">
        <div id={KAP_ID} className="kitap" data-acilis={acilis.no}>
          {SAYFALAR.map((s) => (
            <Yaprak key={s.no} sayfa={s} dil={dil} />
          ))}
        </div>

        {/* Kenarlardaki sayfa cevirme oklari. Kitabin kardesi, cocugu degil:
            kaydirma kabinin icinde olsalardi sayfalarla birlikte kayarlardi. */}
        <SayfaOklari
          kabId={KAP_ID}
          sayfalar={sayfaListesi}
          dil={dil}
          baslangicNo={acilis.no}
        />
      </div>

      {/*
        TAM SAYFA YÜKLEMEDE ilk konumlandırma. HTML ayrıştırılırken, kap DOM'a
        girdikten hemen sonra çalışıyor; ekrana hiç yanlış sayfa düşmüyor.

        İSTEMCİ TARAFI gezinmede bu script çalışmaz — innerHTML ile DOM'a giren
        bir script'i tarayıcı çalıştırmaz. O yolu SayfaSayaci içindeki layout
        effect kapatıyor; ikisi aynı fark hesabını kullanıyor.

        Fark yöntemi yazma yönünden bağımsız: hedef ile kabın kutuları
        arasındaki mesafe RTL'de kendiliğinden negatif çıkıyor. (Eskiden
        scrollIntoView kullanılıyordu; `behavior:"instant"` eski tarayıcılarda
        geçersiz enum sayılıp TypeError atabildiği için bırakıldı.)
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var k=document.getElementById(${JSON.stringify(KAP_ID)});if(!k)return;var h=document.getElementById("s"+k.getAttribute("data-acilis"));if(!h)return;k.scrollLeft+=h.getBoundingClientRect().left-k.getBoundingClientRect().left;})();`,
        }}
      />

      {/*
        Alt serit: "Menuye don" ve sayfa numarasi.

        Dugme her yapragin icinde tekrarlanmiyor artik — orada ust bosluguyla
        birlikte sayfa basina 80px yiyordu ve kitap telefon ekranina sigmiyordu.
        Burada bir kez duruyor, seridi yukseltmiyor ve her sayfada ayni yerde.

        Seride dir verilmiyor: justify-between yazma yonunu kendisi izliyor,
        Arapca'da dugme saga geciyor. Yalnizca sayac ltr — "3 / 11" bidi
        karismasin diye. */}
      <div className="alt-serit">
        <Link href={`/${dil}/menu`} className="alt-serit-baglanti">
          {ui("menuyeDon", dil)}
        </Link>

        {/* "Asagida devami var" ipucu — seridin ortasinda, icerigin
            disinda. Yalnizca aktif sayfa tasiyorsa beliriyor. */}
        <AsagiOk
          kabId={KAP_ID}
          sayfalar={sayfaListesi}
          dil={dil}
          baslangicNo={acilis.no}
        />

        <p className="sayfa-numarasi" dir="ltr">
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
