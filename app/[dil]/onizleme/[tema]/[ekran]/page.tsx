import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TUM_TEMA_FONTLARI } from "@/app/temalar/tum-fontlar";
import {
  AnaSecimEkrani,
  BulunamadiEkrani,
  DilSecimEkrani,
  KategoriListesiEkrani,
  MenuKitabiEkrani,
  OrganizasyonEkrani,
} from "@/components/ekranlar";
import { DILLER, SAYFALAR, gecerliDil, type DilKodu } from "@/data/menu";
import { TEMA_ADI, TEMA_KODLARI, gecerliTema, type TemaKodu } from "@/data/tema";

/**
 * TEMA ONIZLEMESI — bir temanin tek bir ekrani.
 *
 * GERCEK ekran bilesenlerini basiyor; tek fark disindaki sarmalayici. O
 * sarmalayicidaki `tema-*` sinifi kendi alt agacinda --t-* degiskenlerini
 * yeniden tanimliyor, boylece <html> uzerindeki aktif temayi eziyor. Ayni
 * markup, baska boya — onizlemede gorulen ile uretimde cikan bire bir ayni.
 *
 * Yazi tipleri: bu rota DORT temanin ailelerini de yukluyor. Uretim ekranlari
 * `app/temalar/aktif.ts` uzerinden yalnizca aktif temaninkini yukluyor; bu
 * dosya oraya hic girmiyor.
 */

const EKRANLAR = ["diller", "secim", "liste", "menu", "organizasyon", "bulunamadi"] as const;
type Ekran = (typeof EKRANLAR)[number];

const EKRAN_ADI: Record<Ekran, string> = {
  diller: "Dil secimi",
  secim: "Ana secim",
  liste: "Kategori listesi",
  menu: "Menu kitabi",
  organizasyon: "Organizasyon",
  bulunamadi: "404",
};

function gecerliEkran(deger: string): deger is Ekran {
  return (EKRANLAR as readonly string[]).includes(deger);
}

export function generateStaticParams() {
  return DILLER.flatMap((dil) =>
    TEMA_KODLARI.flatMap((tema) => EKRANLAR.map((ekran) => ({ dil, tema, ekran }))),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[dil]/onizleme/[tema]/[ekran]">): Promise<Metadata> {
  const { tema, ekran } = await params;
  const temaAdi = gecerliTema(tema) ? TEMA_ADI[tema] : "Onizleme";
  const ekranAdi = gecerliEkran(ekran) ? EKRAN_ADI[ekran] : "";
  return { title: `${ekranAdi} · ${temaAdi} · Onizleme` };
}

export default async function OnizlemeEkrani({
  params,
}: PageProps<"/[dil]/onizleme/[tema]/[ekran]">) {
  const { dil: hamDil, tema: hamTema, ekran: hamEkran } = await params;
  if (!gecerliDil(hamDil) || !gecerliTema(hamTema) || !gecerliEkran(hamEkran)) {
    notFound();
  }
  const dil: DilKodu = hamDil;
  const tema: TemaKodu = hamTema;
  const ekran: Ekran = hamEkran;

  // Onizlemedeki baglantilar onizlemenin icinde kalsin.
  const yolOneki = `/onizleme/${tema}`;
  const ortak = { dil, tema, yolOneki };

  const govde = {
    diller: <DilSecimEkrani {...ortak} />,
    secim: <AnaSecimEkrani {...ortak} />,
    liste: <KategoriListesiEkrani {...ortak} />,
    menu: <MenuKitabiEkrani {...ortak} acilis={SAYFALAR[0]} />,
    organizasyon: <OrganizasyonEkrani {...ortak} />,
    bulunamadi: <BulunamadiEkrani {...ortak} />,
  }[ekran];

  return (
    <div className={`tema-${tema} ${TUM_TEMA_FONTLARI} onizleme-kabi`}>{govde}</div>
  );
}
