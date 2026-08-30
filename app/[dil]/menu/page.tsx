import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UstBaslik } from "@/components/UstBaslik";
import { ui } from "@/data/arayuz";
import {
  DILLER,
  MENU,
  gecerliDil,
  kategorininSayfasi,
  metin,
  sayfaNumarasi,
  type DilKodu,
} from "@/data/menu";

/**
 * Ekran A — Kategori listesi.
 *
 * Basılı menülerdeki "içindekiler" sayfası mantığında: kategori adı, noktalı
 * ayraç, sağda sayfa numarası. Sayfa numaraları veri dosyasından geliyor.
 */
export function generateStaticParams() {
  return DILLER.map((dil) => ({ dil }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/menu">): Promise<Metadata> {
  const { dil } = await params;
  if (!gecerliDil(dil)) return { title: "Huzur Pide" };
  return { title: `${ui("menu", dil)} · Huzur Pide` };
}

export default async function MenuSayfasi({ params }: PageProps<"/[dil]/menu">) {
  const { dil: ham } = await params;
  if (!gecerliDil(ham)) notFound();
  const dil: DilKodu = ham;

  return (
    <div className="menu-sayfa">
      <UstBaslik dil={dil} altBaslik={ui("menu", dil)} yol="/menu" />

      <main>
        <h1 className="sr-only">
          Huzur Pide — {ui("menuKategorileri", dil)}
        </h1>

        <nav aria-label={ui("menuKategorileri", dil)}>
          <ul className="flex flex-col">
            {MENU.map((kategori) => (
              <li key={kategori.slug}>
                {/* Her kategori tek sayfa: slug'i kategori slug'inin aynisi. */}
                <Link
                  href={`/${dil}/menu/${kategorininSayfasi(kategori).slug}`}
                  className="icindekiler-satir"
                >
                  <span className="icindekiler-ad">{metin(kategori.ad, dil)}</span>
                  <span className="nokta" aria-hidden="true" />
                  {/* Sayfa numarasi gorsel bir detay; ekran okuyucuya
                      anlamli bir ifade olarak okunmasi icin etiketlendi. */}
                  <span className="icindekiler-sayfa">
                    <span className="sr-only">{ui("sayfa", dil)} </span>
                    {sayfaNumarasi(kategori)}
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
