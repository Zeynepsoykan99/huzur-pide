/**
 * Sitenin adresleri — TEK YER.
 *
 * Ayrı ve bağımlılıksız bir dosya, çünkü `proxy.ts` de bunu okuyor. Proxy
 * her istekte çalışıyor; `data/site.ts` üzerinden alınsaydı menü verisi ve
 * metinler de proxy paketine girerdi.
 *
 * `SITE_ADRESI` canonical, hreflang, Open Graph, robots.txt ve sitemap.xml
 * adreslerinin kaynağı (bkz. `data/site.ts`). Alan adı değişirse yalnızca bu
 * satır güncellenir.
 */
export const SITE_ADRESI = "https://www.huzurpidedikbiyik.com";

/**
 * Eski üretim adresi. Buraya gelen sayfa istekleri `SITE_ADRESI`'ne 308 ile
 * yönleniyor (bkz. `proxy.ts`); böylece aynı site iki adresten açılmıyor.
 *
 * YALNIZCA bu ad yönleniyor. Vercel'in önizleme dağıtımları başka adlar
 * kullanıyor (`huzur-pide-<kimlik>-….vercel.app`); onlar çalışmaya devam
 * ediyor ki yayından önce deneme yapılabilsin.
 */
export const ESKI_URETIM_ADI = "huzur-pide.vercel.app";
