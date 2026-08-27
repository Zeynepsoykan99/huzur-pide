import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PideIkonu, SofraIkonu } from "@/components/Ikonlar";
import { UstBaslik } from "@/components/UstBaslik";
import { ui } from "@/data/arayuz";
import { DILLER, gecerliDil, type DilKodu } from "@/data/menu";

/**
 * Ana seçim ekranı — dil seçildikten sonraki ilk ekran.
 *
 * İki yol var: menü ve organizasyon. "Organizasyon" burada düğün, nişan,
 * kına, mevlit, toplu yemek gibi özel gün organizasyonlarını kastediyor.
 *
 * Bu ekran bilinçli olarak dil seçim ekranına benzemiyor: orada büyük logo,
 * marka adı ve slogan var, burada menü sayfalarıyla aynı `UstBaslik`. Böylece
 * dil seçimi "kapı", bu ekran "içerisi" gibi okunuyor — ikinci bir açılış
 * ekranı hissi vermiyor. Kartlar da dil butonlarından iri (96px / 56px).
 */
export function generateStaticParams() {
  return DILLER.map((dil) => ({ dil }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/secim">): Promise<Metadata> {
  const { dil } = await params;
  if (!gecerliDil(dil)) return { title: "Huzur Pide" };
  return { title: `Huzur Pide — ${ui("bolumSecin", dil)}` };
}

function Ok() {
  return (
    <svg className="lang-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

export default async function AnaSecimSayfasi({ params }: PageProps<"/[dil]/secim">) {
  const { dil: ham } = await params;
  if (!gecerliDil(ham)) notFound();
  const dil: DilKodu = ham;

  const kartlar = [
    { yol: `/${dil}/menu`, baslik: ui("menu", dil), Ikon: PideIkonu },
    { yol: `/${dil}/organizasyon`, baslik: ui("organizasyon", dil), Ikon: SofraIkonu },
  ];

  return (
    <div className="menu-sayfa">
      <UstBaslik dil={dil} yol="/secim" />

      <main>
        {/* Ekranda ayri bir baslik yok — iki kart kendini anlatiyor. Ekran
            okuyucu icin sayfanin ne oldugu yine de soylenmeli. */}
        <h1 className="sr-only">Huzur Pide — {ui("bolumSecin", dil)}</h1>

        <nav aria-label={ui("bolumSecin", dil)}>
          <ul className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            {kartlar.map(({ yol, baslik, Ikon }) => (
              <li key={yol}>
                <Link href={yol} className="secim-karti">
                  <Ikon className="secim-ikonu" />
                  <span className="secim-basligi">{baslik}</span>
                  <Ok />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
