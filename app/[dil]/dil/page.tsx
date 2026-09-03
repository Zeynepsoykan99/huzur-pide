import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DilSecimEkrani } from "@/components/ekranlar";
import { ui } from "@/data/arayuz";
import { DILLER, gecerliDil } from "@/data/menu";
import { aktifTema } from "@/data/menuKaynak";

/**
 * Ekran: Dil secimi.
 *
 * Akistaki yeri: karsilama sayfasindaki "Menu" butonu -> BURASI -> menu kitabi.
 *
 * Eskiden uygulamanin ilk ekraniydi (`/[dil]`); karsilama sayfasi one gelince
 * buraya tasindi. Ekranin KENDISI degismedi, yalnizca adresi ve butonlarinin
 * hedefi degisti: dort dil karti artik dogrudan o dilin menusune gidiyor.
 */
export function generateStaticParams() {
  return DILLER.map((dil) => ({ dil }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/dil">): Promise<Metadata> {
  const { dil } = await params;
  if (!gecerliDil(dil)) return { title: "Huzur Pide" };
  return { title: `${ui("dilSeciniz", dil)} · Huzur Pide` };
}

export default async function DilSecimSayfasi({ params }: PageProps<"/[dil]/dil">) {
  const { dil } = await params;
  if (!gecerliDil(dil)) notFound();
  const tema = await aktifTema();
  return <DilSecimEkrani dil={dil} tema={tema} />;
}
