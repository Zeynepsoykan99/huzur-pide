"use client";

import Link from "next/link";
import { useKitapSlug } from "@/components/aktifSayfa";

/**
 * Dil değiştirme bağlantısı — menü kitabında ekrandaki sayfayı izler.
 *
 * `kitapAcilis` verilirse (menü kitabı) hedef `/<dil>/menu/<ekrandaki slug>`;
 * müşteri Tatlılar'a kaydırdıysa bayrak Tatlılar'ın diğer dildeki
 * karşılığına gidiyor. Verilmezse (içindekiler, önizleme) sabit `href`.
 *
 * YALNIZCA BAĞLANTI İSTEMCİDE. Bayrak görseli ve metinler sunucuda
 * `DilKontrolu` içinde basılıp `children` olarak geliyor: menü verisini
 * taşıyan modül (`data/menu.ts`) istemci paketine girmiyor.
 *
 * Ön yükleme kapalı — gerekçe `DilKontrolu`nda.
 */
export function KitapDilBaglantisi({
  dil,
  href,
  kitapAcilis,
  children,
  ...geriKalan
}: {
  dil: string;
  href: string;
  /** Kitabın açılış slug'ı. Yalnızca menü kitabında verilir. */
  kitapAcilis?: string;
  children: React.ReactNode;
  hrefLang: string;
  lang: string;
  "aria-current"?: "true";
  className: string;
}) {
  const slug = useKitapSlug(kitapAcilis ?? "");
  const hedef = kitapAcilis ? `/${dil}/menu/${slug}` : href;
  return (
    <Link href={hedef} prefetch={false} {...geriKalan}>
      {children}
    </Link>
  );
}
