import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { KategoriListesiEkrani } from "@/components/ekranlar";
import { ui } from "@/data/arayuz";
import { DILLER, gecerliDil } from "@/data/menu";
import { aktifTema, sayfalar } from "@/data/menuKaynak";

/**
 * Ekran: Kategori listesi — basili menulerdeki "icindekiler" sayfasi.
 *
 * Icerik Firestore'dan geliyor ama sayfa STATIK uretiliyor: okuma musteri
 * isteginde degil, sayfa uretilirken oluyor. Panelden bir sey degisince
 * revalidatePath bu sayfayi yeniden urettiriyor.
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
  const { dil } = await params;
  if (!gecerliDil(dil)) notFound();
  const [liste, tema] = await Promise.all([sayfalar(), aktifTema()]);
  return <KategoriListesiEkrani dil={dil} sayfalar={liste} tema={tema} />;
}
