import { notFound } from "next/navigation";
import { KarsilamaEkrani } from "@/components/ekranlar";
import { DILLER, gecerliDil } from "@/data/menu";
import { aktifTema } from "@/data/menuKaynak";

/**
 * Ekran: Karsilama — QR okutulunca gelen ILK ekran.
 *
 * Akis: QR -> BURASI -> "Menu" butonu -> dil secimi (/[dil]/dil) -> menu.
 *
 * Dort dilin her birinde ayri bir kopyasi var (`/tr`, `/en`, `/ar`, `/ru`) ve
 * kok adres `/tr`'ye yonleniyor (next.config.ts). Dil secimi bu sayfadan
 * SONRA geldigi icin sayfanin kendisi bir dilde acilmak zorunda; en ustteki
 * bayrak seridi Turkce bilmeyen musteriye tek dokunusluk cikis veriyor.
 *
 * Govde `components/ekranlar.tsx` icinde.
 */
export function generateStaticParams() {
  return DILLER.map((dil) => ({ dil }));
}

export default async function KarsilamaSayfasi({ params }: PageProps<"/[dil]">) {
  const { dil } = await params;
  if (!gecerliDil(dil)) notFound();
  const tema = await aktifTema();
  return <KarsilamaEkrani dil={dil} tema={tema} />;
}
