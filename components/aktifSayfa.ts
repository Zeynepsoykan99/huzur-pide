"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Kitapta o an ekranda olan sayfanın numarası.
 *
 * Yatay kaydırma saf CSS `scroll-snap` ile çalışıyor; burada kaydırma
 * YAPILMIYOR, yalnızca hangi sayfanın ekranı doldurduğu izleniyor. İki ayrı
 * kontrol aynı bilgiye ihtiyaç duyuyor — kenardaki sayfa çevirme okları ve
 * alt şerideki aşağı ok — bu yüzden mantık burada tek yerde duruyor.
 *
 * `baslangicNo` değişince (istemci tarafı gezinmede bileşen mount olmadan
 * yeniden kullanılıyor) aktif sayfa açılış sayfasına dönüyor.
 */
export function useAktifSayfa(
  kabId: string,
  sayfalar: { no: number }[],
  baslangicNo: number,
): number {
  const [aktifNo, setAktifNo] = useState(baslangicNo);
  const [oncekiBaslangic, setOncekiBaslangic] = useState(baslangicNo);

  // React'in "render sırasında state düzeltme" kalıbı — effect'te setState
  // çağırmaktan ucuz, fazladan bir render turu doğurmuyor.
  if (oncekiBaslangic !== baslangicNo) {
    setOncekiBaslangic(baslangicNo);
    setAktifNo(baslangicNo);
  }

  useEffect(() => {
    const kap = document.getElementById(kabId);
    if (!kap) return;

    const bolumler = sayfalar
      .map((s) => document.getElementById(`s${s.no}`))
      .filter((el): el is HTMLElement => el !== null);
    if (bolumler.length === 0) return;

    const gozlemci = new IntersectionObserver(
      (girisler) => {
        // En çok görünen bölüm aktif sayfadır. Snap sayesinde pratikte
        // her zaman tek bir bölüm baskın oluyor.
        let enIyi: IntersectionObserverEntry | null = null;
        for (const g of girisler) {
          if (!enIyi || g.intersectionRatio > enIyi.intersectionRatio) enIyi = g;
        }
        if (!enIyi || enIyi.intersectionRatio < 0.5) return;
        setAktifNo(Number(enIyi.target.id.slice(1)));
      },
      { root: kap, threshold: [0.5, 0.75, 1] },
    );

    bolumler.forEach((b) => gozlemci.observe(b));
    return () => gozlemci.disconnect();
  }, [kabId, sayfalar]);

  return aktifNo;
}

/**
 * JavaScript devrede mi?
 *
 * Sunucuda ve hydration'dan önce `false`, istemcide `true`. Çalışmayan bir
 * kontrolü hiç göstermemek için kullanılıyor: oklar ancak JavaScript
 * yüklendiğinde beliriyor.
 */
export function useBagli(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
