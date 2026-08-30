import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TUM_TEMA_FONTLARI } from "@/app/temalar/tum-fontlar";
import { TemaMotifi } from "@/components/TemaMotifi";
import { DILLER, gecerliDil, type DilKodu } from "@/data/menu";
import { TEMA_ADI, TEMA_KODLARI, gecerliTema, type TemaKodu } from "@/data/tema";

/**
 * Bir temanin onizleme kapagi: o temaya ait butun ekranlarin listesi ve
 * diger temalara gecis. Telefondan gezerken giris noktasi burasi.
 */

const EKRANLAR = [
  ["diller", "Dil secimi"],
  ["secim", "Ana secim"],
  ["liste", "Kategori listesi"],
  ["menu", "Menu kitabi"],
  ["organizasyon", "Organizasyon"],
  ["bulunamadi", "404"],
] as const;

export function generateStaticParams() {
  return DILLER.flatMap((dil) => TEMA_KODLARI.map((tema) => ({ dil, tema })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/onizleme/[tema]">): Promise<Metadata> {
  const { tema } = await params;
  const ad = gecerliTema(tema) ? TEMA_ADI[tema] : "Onizleme";
  return { title: `${ad} · Onizleme · Huzur Pide` };
}

export default async function TemaKapagi({
  params,
}: PageProps<"/[dil]/onizleme/[tema]">) {
  const { dil: hamDil, tema: hamTema } = await params;
  if (!gecerliDil(hamDil) || !gecerliTema(hamTema)) notFound();
  const dil: DilKodu = hamDil;
  const tema: TemaKodu = hamTema;

  return (
    <div className={`tema-${tema} ${TUM_TEMA_FONTLARI} onizleme-kabi`}>
      <div className="giris-ekrani">
        <div className="giris-govde">
          <header className="giris-tepe">
            <TemaMotifi className="giris-motif" tema={tema} />
            <p className="marka-adi">Huzur Pide</p>
            <div className="giris-ayrac" aria-hidden="true">
              <span className="kural" />
              <TemaMotifi className="motif" tema={tema} />
              <span className="kural" />
            </div>
            <p className="slogan">{TEMA_ADI[tema]}</p>
          </header>

          <h2 className="bolum-basligi">Ekranlar</h2>

          <ul className="icindekiler">
            {EKRANLAR.map(([kod, ad], i) => (
              <li key={kod}>
                <Link
                  href={`/${dil}/onizleme/${tema}/${kod}`}
                  className="icindekiler-satir odak"
                >
                  <span className="icindekiler-no" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="icindekiler-ad">{ad}</span>
                  <span className="nokta" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="bolum-basligi">Diger temalar</h2>

          <ul className="icindekiler">
            {TEMA_KODLARI.filter((t) => t !== tema).map((t) => (
              <li key={t}>
                <Link href={`/${dil}/onizleme/${t}`} className="icindekiler-satir odak">
                  <TemaMotifi className="icindekiler-motif" tema={t} />
                  <span className="icindekiler-ad">{TEMA_ADI[t]}</span>
                  <span className="nokta" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
