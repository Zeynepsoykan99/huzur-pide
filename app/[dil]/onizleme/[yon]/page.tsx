import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DILLER, gecerliDil, type DilKodu } from "@/data/menu";
import { TUM_FONT_DEGISKENLERI } from "./fontlar";
import {
  Chevron,
  EKRANLAR,
  EKRAN_ADI,
  Marka,
  Motif,
  YONLER,
  YON_ADI,
  gecerliYon,
  type Yon,
} from "./parcalar";
import "./onizleme.css";

/**
 * Bir yönün önizleme kapağı: o yöne ait bütün ekranların listesi.
 *
 * Telefondan gezerken giriş noktası burası. Kapağın kendisi de yönün
 * diliyle boyalı — liste bir kontrol paneli değil, tasarımın parçası.
 */

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

export default async function YonKapagi({
  params,
}: PageProps<"/[dil]/onizleme/[yon]">) {
  const { dil: hamDil, yon: hamYon } = await params;
  if (!gecerliDil(hamDil) || !gecerliYon(hamYon)) notFound();
  const dil: DilKodu = hamDil;
  const yon: Yon = hamYon;
  const digerYon: Yon = yon === "gece" ? "cini" : "gece";

  return (
    <div className={`oz yon-${yon} ${TUM_FONT_DEGISKENLERI}`}>
      <div className="oz-tek-ekran">
        <div className="oz-giris oz-kapak">
          <div className="oz-giris-tepe">
            <Motif yon={yon} className="oz-giris-motif" />
            <Marka yon={yon} buyuk />
            <div className="oz-giris-ayrac" aria-hidden="true">
              <span className="oz-kural" />
              <Motif yon={yon} className="oz-motif" />
              <span className="oz-kural" />
            </div>
            <p className="oz-slogan">{YON_ADI[yon]}</p>
          </div>

          <h2 className="oz-ust-baslik-kucuk">Ekranlar</h2>

          <ul className="oz-icindekiler oz-kapak-listesi">
            {EKRANLAR.map((ekran, i) => (
              <li key={ekran}>
                <Link
                  href={`/${dil}/onizleme/${yon}/${ekran}`}
                  className="oz-icindekiler-satir"
                >
                  <span className="oz-icindekiler-no" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="oz-icindekiler-ad">{EKRAN_ADI[ekran]}</span>
                  <span className="oz-ayrac" aria-hidden="true" />
                  <Chevron className="oz-karti-ok" />
                </Link>
              </li>
            ))}
          </ul>

          <nav className="oz-orta-baglanti">
            <Link
              href={`/${dil}/onizleme/${digerYon}`}
              className="oz-alt-baglanti"
            >
              → {YON_ADI[digerYon]}
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
