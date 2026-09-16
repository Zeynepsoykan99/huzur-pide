import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuKitabiEkrani } from "@/components/ekranlar";
import { DILLER, gecerliDil, MEKAN_ADI, metin, sayfaBasligi } from "@/data/menu";
import { aktifTema, sayfaBul, sayfalar } from "@/data/menuKaynak";
import { sayfaEtiketleri } from "@/data/site";

/**
 * Ekran: Menu kitabi. Bes sayfanin tamami her rotada basiliyor; hangi
 * sayfada acilacagini `acilis` belirliyor.
 *
 * Rotalar derleme aninda Firestore'dan uretiliyor: kategori eklenirse yeni
 * rota bir sonraki derlemede olusuyor. Fiyat ve urun degisiklikleri rota
 * kumesini degistirmedigi icin revalidatePath yeterli.
 */
export async function generateStaticParams() {
  const liste = await sayfalar();
  return DILLER.flatMap((dil) => liste.map((s) => ({ dil, sayfa: s.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/menu/[sayfa]">): Promise<Metadata> {
  const { dil, sayfa } = await params;
  const s = await sayfaBul(sayfa);
  if (!gecerliDil(dil) || !s) return { title: MEKAN_ADI };
  // canonical rotanın kendi adresi. Kitapta kaydırıldıkça adres çubuğu
  // `replaceState` ile değişiyor, ama her adres kendi sayfasını açtığı
  // için canonical'ın açılış rotasına bakması doğru.
  return sayfaEtiketleri({
    dil,
    yol: `/menu/${s.slug}`,
    baslik: sayfaBasligi(metin(s.kategori.ad, dil)),
  });
}

export default async function MenuKitabiSayfasi({
  params,
}: PageProps<"/[dil]/menu/[sayfa]">) {
  const { dil, sayfa: slug } = await params;
  if (!gecerliDil(dil)) notFound();

  const [liste, tema] = await Promise.all([sayfalar(), aktifTema()]);
  const acilis = liste.find((s) => s.slug === slug);
  if (!acilis) notFound();

  return (
    <MenuKitabiEkrani dil={dil} sayfalar={liste} acilis={acilis} tema={tema} />
  );
}
