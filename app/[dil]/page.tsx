import { notFound } from "next/navigation";
import { DilSecimEkrani } from "@/components/ekranlar";
import { DILLER, gecerliDil } from "@/data/menu";
import { aktifTema } from "@/data/menuKaynak";

/**
 * Ekran: Dil secimi — uygulamanin ilk acilis ekrani.
 *
 * Dort dilin her birinde ayri bir kopyasi var (`/tr`, `/en`, `/ar`, `/ru`).
 * Cevresindeki metinler o dilde, dort buton her zaman dort dili gosteriyor.
 * Arapca kopyada sayfa RTL, cunku `dir` kok layout'ta URL'den geliyor.
 *
 * Govde `components/ekranlar.tsx` icinde: onizleme rotasi da AYNI bileseni
 * baska bir tema sarmalayicisinda basiyor.
 */
export function generateStaticParams() {
  return DILLER.map((dil) => ({ dil }));
}

export default async function DilSecimSayfasi({ params }: PageProps<"/[dil]">) {
  const { dil } = await params;
  if (!gecerliDil(dil)) notFound();
  const tema = await aktifTema();
  return <DilSecimEkrani dil={dil} tema={tema} />;
}
