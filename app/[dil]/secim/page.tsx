import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnaSecimEkrani } from "@/components/ekranlar";
import { ui } from "@/data/arayuz";
import { DILLER, gecerliDil } from "@/data/menu";

/**
 * Ekran: Ana secim — Menu mu, Organizasyon mu.
 *
 * Akistaki yeri: dil secimi -> BURASI -> menu kitabi ya da organizasyon.
 * Kitabin dilinden ayri, iki bagimsiz butondan ibaret.
 */
export function generateStaticParams() {
  return DILLER.map((dil) => ({ dil }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/secim">): Promise<Metadata> {
  const { dil } = await params;
  if (!gecerliDil(dil)) return { title: "Huzur Pide" };
  return { title: `${ui("bolumSecin", dil)} · Huzur Pide` };
}

export default async function AnaSecimSayfasi({ params }: PageProps<"/[dil]/secim">) {
  const { dil } = await params;
  if (!gecerliDil(dil)) notFound();
  return <AnaSecimEkrani dil={dil} />;
}
