import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UstBaslik } from "@/components/UstBaslik";
import { UrunGorseli } from "@/components/UrunGorseli";
import {
  MENU,
  fiyatYaz,
  kategoriBul,
  metin,
  type DilKodu,
  type Kategori,
  type Urun,
} from "@/data/menu";

/** Dil şu an sabit; Aşama 3'te dil mantığı bağlandığında dışarıdan gelecek. */
const DIL: DilKodu = "tr";

export function generateStaticParams() {
  return MENU.map((k) => ({ kategori: k.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategori: string }>;
}): Promise<Metadata> {
  const { kategori } = await params;
  const k = kategoriBul(kategori);
  return { title: k ? `${metin(k.ad, DIL)} · Huzur Pide` : "Huzur Pide" };
}

/* ---------------------------------------------------------------------------
   Tek fiyatlı kategoriler:  [görsel] Ad ................. 500 ₺

   Görsel yuvası her satırda aynı genişlikte: fotoğrafı olan ürün fotoğrafını,
   olmayan yer tutucusunu gösteriyor. md ve üstünde yuva büyüyor ve sırayla bir
   başta bir sonda duruyor.

   Taraf değiştirmek için `order` kullanılıyor, `ml/mr` değil: `order` yazma
   yönüne göre çalıştığından dir="rtl" verildiğinde alternasyon da kendiliğinden
   aynalanıyor.
   --------------------------------------------------------------------------- */
function TekFiyatliSatir({ urun, sonTarafta }: { urun: Urun; sonTarafta: boolean }) {
  const fiyat = urun.fiyatlar[0];
  return (
    <li className="urun-satir">
      <span className={`gorsel-yuvasi ${sonTarafta ? "md:order-last" : ""}`}>
        <UrunGorseli urun={urun} dil={DIL} />
      </span>

      <div className="urun-govde">
        <div className="ayrac-satir">
          <span className="urun-ad">{metin(urun.ad, DIL)}</span>
          <span className="nokta" aria-hidden="true" />
          <span className="urun-fiyat" data-dogrulandi={fiyat.dogrulandi}>
            {fiyatYaz(fiyat.tutar)}
          </span>
        </div>
      </div>
    </li>
  );
}

function TekFiyatliListe({ kategori }: { kategori: Kategori }) {
  // Artık her satırda görsel alanı var (fotoğraf ya da yer tutucu), bu yüzden
  // alternasyon doğrudan sıra numarasından geliyor.
  return (
    <ul className="mt-7">
      {kategori.urunler.map((urun, i) => (
        <TekFiyatliSatir key={urun.id} urun={urun} sonTarafta={i % 2 === 1} />
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------------------
   Çok fiyatlı kategori (kapalı pideler)

   Burada veri gerçekten tablo: ürün x hamur boyu -> fiyat. Bu yüzden CSS
   ızgara değil gerçek <table> kullanılıyor — sütun başlıkları fiyat
   hücrelerinin tam üstüne oturuyor ve <th scope="col"> sayesinde ekran
   okuyucu her hücrenin hangi sütuna ait olduğunu kendiliğinden söylüyor.

   Tablo yapısı gereği görsel burada alternatif taraf değiştirmiyor; hep
   satırın başında duruyor.
   --------------------------------------------------------------------------- */
function CokFiyatliTablo({ kategori }: { kategori: Kategori }) {
  return (
    <table className="pide-tablo mt-7">
      <caption className="sr-only">
        {metin(kategori.ad, DIL)} — hamur boyuna göre fiyatlar
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
            <span className="sr-only">Görsel</span>
          </th>
          <th scope="col" className="pide-sutun-basligi text-start">
            <span className="sr-only">Ürün</span>
          </th>
          {kategori.sutunlar.map((sutun) => (
            <th key={sutun.kod} scope="col" className="pide-sutun-basligi">
              {metin(sutun.baslik, DIL)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {kategori.urunler.map((urun) => (
          <tr key={urun.id}>
            <td className="pide-gorsel-hucre">
              <UrunGorseli urun={urun} dil={DIL} />
            </td>
            <th scope="row" className="pide-ad-hucre">
              <div className="ayrac-satir">
                <span className="urun-ad">{metin(urun.ad, DIL)}</span>
                <span className="nokta" aria-hidden="true" />
              </div>
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
}: {
  params: Promise<{ kategori: string }>;
}) {
  const { kategori: slug } = await params;
  const kategori = kategoriBul(slug);
  if (!kategori) notFound();

  const cokSutunlu = kategori.sutunlar.length > 1;

  return (
    <div className="menu-sayfa">
      <UstBaslik />

      <main>
        <h1 className="text-center font-display text-3xl leading-tight text-paprika-500 sm:text-4xl">
          {metin(kategori.ad, DIL)}
        </h1>

        {cokSutunlu ? (
          <CokFiyatliTablo kategori={kategori} />
        ) : (
          <TekFiyatliListe kategori={kategori} />
        )}

        <nav className="mt-12 flex justify-center">
          <Link
            href="/menu"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-cocoa-700
                       outline-hidden transition-colors duration-150
                       hover:bg-cream-200/60 hover:text-cocoa-900
                       focus-visible:outline-solid focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-cocoa-900"
          >
            Menüye dön
          </Link>
        </nav>
      </main>
    </div>
  );
}
