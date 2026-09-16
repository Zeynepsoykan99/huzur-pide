import type { MetadataRoute } from "next";
import { SITE_ADRESI } from "@/data/site";

/**
 * robots.txt — müşteri sayfaları açık, yönetim paneli kapalı.
 *
 * Panel sayfaları ayrıca kendi `noindex` etiketini taşıyor (bkz.
 * `app/panel/layout.tsx`); buradaki satır tarayıcının oraya hiç
 * uğramamasını istiyor. İkisi birlikte: biri yok sayılsa diğeri kalıyor.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/panel" },
    sitemap: `${SITE_ADRESI}/sitemap.xml`,
  };
}
