import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UstBaslik } from "@/components/UstBaslik";
import { UrunGorseli } from "@/components/UrunGorseli";
import { ui } from "@/data/arayuz";
import {
  DILLER,
  MENU,
  fiyatYaz,
  gecerliDil,
  icerikMetni,
  kategoriBul,
  metin,
  type DilKodu,
  type Kategori,
  type Urun,
} from "@/data/menu";

export function generateStaticParams() {
  // 4 dil x 5 kategori = 20 sayfa, hepsi derleme aninda statik uretiliyor.
  return DILLER.flatMap((dil) => MENU.map((k) => ({ dil, kategori: k.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/menu/[kategori]">): Promise<Metadata> {
  const { dil, kategori } = await params;
  const k = kategoriBul(kategori);
  if (!gecerliDil(dil) || !k) return { title: "Huzur Pide" };
  return { title: `${metin(k.ad, dil)} · Huzur Pide` };
}

/* ---------------------------------------------------------------------------
   Tek fiyatlı kategoriler:  [görsel] Ad ................. 500 ₺

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
}: {
  urun: Urun;
  dil: DilKodu;
  sonTarafta: boolean;
}) {
  const fiyat = urun.fiyatlar[0];
  const icerik = icerikMetni(urun, dil);

  return (
    <li className="urun-satir">
      <span className={`gorsel-yuvasi ${sonTarafta ? "md:order-last" : ""}`}>
        <UrunGorseli urun={urun} dil={dil} />
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

function TekFiyatliListe({ kategori, dil }: { kategori: Kategori; dil: DilKodu }) {
  return (
    <ul className="mt-7">
      {kategori.urunler.map((urun, i) => (
        <TekFiyatliSatir key={urun.id} urun={urun} dil={dil} sonTarafta={i % 2 === 1} />
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------------------
   Çok fiyatlı kategori (kapalı pideler)

   Veri gerçekten tablo: ürün x hamur boyu -> fiyat. Bu yüzden CSS ızgara değil
   gerçek <table>: sütun başlıkları fiyat hücrelerinin tam üstüne oturuyor ve
   <th scope="col"> sayesinde ekran okuyucu her hücrenin hangi sütuna ait
   olduğunu kendiliğinden söylüyor. Tablo Arapça'da kendiliğinden aynalanıyor.

   Tablo yapısı gereği görsel burada taraf değiştirmiyor; hep satırın başında.
   --------------------------------------------------------------------------- */
function CokFiyatliTablo({ kategori, dil }: { kategori: Kategori; dil: DilKodu }) {
  return (
    <table className="pide-tablo mt-7">
      <caption className="sr-only">
        {metin(kategori.ad, dil)} — {ui("hamurBoyunaGoreFiyatlar", dil)}
      </caption>
      <colgroup>
        <col className="w-14 md:w-44" />
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
        {kategori.urunler.map((urun) => (
          <tr key={urun.id}>
            <td className="pide-gorsel-hucre">
              <UrunGorseli urun={urun} dil={dil} />
            </td>
            <th scope="row" className="pide-ad-hucre">
              {/* Ad ve noktali ayrac ust satirda; aciklama ALTINDA ayri bir
                  blok. Aciklama ayrac-satir'in icinde olsaydi noktalarla ayni
                  satirda bir flex ogesi olur, adin yanina sikisirdi. */}
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

export default async function KategoriSayfasi({
  params,
}: PageProps<"/[dil]/menu/[kategori]">) {
  const { dil: ham, kategori: slug } = await params;
  if (!gecerliDil(ham)) notFound();
  const dil: DilKodu = ham;

  const kategori = kategoriBul(slug);
  if (!kategori) notFound();

  const cokSutunlu = kategori.sutunlar.length > 1;

  return (
    <div className="menu-sayfa">
      <UstBaslik dil={dil} yol={`/menu/${kategori.slug}`} />

      <main>
        <h1 className="text-center font-display text-3xl leading-tight text-paprika-500 sm:text-4xl">
          {metin(kategori.ad, dil)}
        </h1>

        {cokSutunlu ? (
          <CokFiyatliTablo kategori={kategori} dil={dil} />
        ) : (
          <TekFiyatliListe kategori={kategori} dil={dil} />
        )}

        <nav className="mt-12 flex justify-center">
          <Link
            href={`/${dil}/menu`}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-cocoa-700
                       outline-hidden transition-colors duration-150
                       hover:bg-cream-200/60 hover:text-cocoa-900
                       focus-visible:outline-solid focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-cocoa-900"
          >
            {ui("menuyeDon", dil)}
          </Link>
        </nav>
      </main>
    </div>
  );
}
