import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrganizasyonEkrani } from "@/components/ekranlar";
import { ui } from "@/data/arayuz";
import { DILLER, gecerliDil } from "@/data/menu";

/**
 * Organizasyon sayfasi — dugun, nisan, kina, mevlit ve toplu yemek.
 *
 * ICERIK HENUZ GIRILMEDI. Hizmetler, kapasite, iletisim bilgisi gibi bilgiler
 * isletmeden alinip sonra eklenecek; hicbiri uydurulmadi. Sayfa simdilik
 * yalnizca "hazirlaniyor" bildirimi gosteriyor.
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
  const { dil } = await params;
  if (!gecerliDil(dil)) notFound();
  return <OrganizasyonEkrani dil={dil} />;
}
