import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuKitabiEkrani } from "@/components/ekranlar";
import { DILLER, SAYFALAR, gecerliDil, metin, sayfaBul } from "@/data/menu";

/**
 * Ekran: Menu kitabi. Bes sayfanin tamami her rotada basiliyor; hangi
 * sayfada acilacagini `acilis` belirliyor.
 */
export function generateStaticParams() {
  // 4 dil x 5 sayfa (kategori basina bir) = 20 rota, hepsi derleme aninda statik.
  return DILLER.flatMap((dil) => SAYFALAR.map((s) => ({ dil, sayfa: s.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/menu/[sayfa]">): Promise<Metadata> {
  const { dil, sayfa } = await params;
  const s = sayfaBul(sayfa);
  if (!gecerliDil(dil) || !s) return { title: "Huzur Pide" };
  return { title: `${metin(s.kategori.ad, dil)} · Huzur Pide` };
}

export default async function MenuKitabiSayfasi({
  params,
}: PageProps<"/[dil]/menu/[sayfa]">) {
  const { dil, sayfa: slug } = await params;
  if (!gecerliDil(dil)) notFound();
  const acilis = sayfaBul(slug);
  if (!acilis) notFound();
  return <MenuKitabiEkrani dil={dil} acilis={acilis} />;
}
