import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KarsilamaEkrani } from "@/components/ekranlar";
import { ui } from "@/data/arayuz";
import { DILLER, MEKAN_ADI, gecerliDil } from "@/data/menu";
import { aktifTema } from "@/data/menuKaynak";
import { sayfaEtiketleri } from "@/data/site";

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

/**
 * Sekme başlığı DİLE GÖRE: önceden dört kopyanın hepsi yalnızca "Huzur Pide"
 * taşıyordu, arama sonucunda ve sekmede ayırt edilemiyordu. Kuyruk onaylı
 * slogan — yeni metin yazılmadı.
 */
export async function generateMetadata({ params }: PageProps<"/[dil]">): Promise<Metadata> {
  const { dil } = await params;
  if (!gecerliDil(dil)) return { title: MEKAN_ADI };
  return sayfaEtiketleri({
    dil,
    yol: "",
    baslik: `${MEKAN_ADI} · ${ui("slogan", dil)}`,
  });
}

export default async function KarsilamaSayfasi({ params }: PageProps<"/[dil]">) {
  const { dil } = await params;
  if (!gecerliDil(dil)) notFound();
  const tema = await aktifTema();
  return <KarsilamaEkrani dil={dil} tema={tema} />;
}
