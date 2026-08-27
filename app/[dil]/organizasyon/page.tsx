import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SofraIkonu } from "@/components/Ikonlar";
import { UstBaslik } from "@/components/UstBaslik";
import { ui } from "@/data/arayuz";
import { DILLER, gecerliDil, type DilKodu } from "@/data/menu";

/**
 * Organizasyon sayfası — düğün, nişan, kına, mevlit ve toplu yemek.
 *
 * İÇERİK HENÜZ GİRİLMEDİ. Hizmetler, kapasite, iletişim bilgisi gibi
 * bilgiler işletmeden alınıp sonra eklenecek; hiçbiri uydurulmadı.
 * Sayfa şimdilik yalnızca "hazırlanıyor" bildirimi gösteriyor.
 */
export function generateStaticParams() {
  return DILLER.map((dil) => ({ dil }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/organizasyon">): Promise<Metadata> {
  const { dil } = await params;
  if (!gecerliDil(dil)) return { title: "Huzur Pide" };
  return { title: `${ui("organizasyon", dil)} · Huzur Pide` };
}

export default async function OrganizasyonSayfasi({
  params,
}: PageProps<"/[dil]/organizasyon">) {
  const { dil: ham } = await params;
  if (!gecerliDil(ham)) notFound();
  const dil: DilKodu = ham;

  return (
    <div className="menu-sayfa">
      <UstBaslik dil={dil} yol="/organizasyon" />

      <main>
        <h1 className="text-center font-display text-3xl leading-tight text-paprika-500 sm:text-4xl">
          {ui("organizasyon", dil)}
        </h1>

        <div className="hazirlaniyor">
          <SofraIkonu className="h-12 w-12 text-latte-600/60" />
          <p className="hazirlaniyor-metin">{ui("yakinda", dil)}</p>
        </div>

        <nav className="mt-12 flex justify-center">
          <Link
            href={`/${dil}/secim`}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-cocoa-700
                       outline-hidden transition-colors duration-150
                       hover:bg-cream-200/60 hover:text-cocoa-900
                       focus-visible:outline-solid focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-cocoa-900"
          >
            {ui("anaEkranaDon", dil)}
          </Link>
        </nav>
      </main>
    </div>
  );
}
