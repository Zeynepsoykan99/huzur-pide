"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "3 / 7" sayacı ve yatay kaydırmanın ilerici zenginleştirme katmanı.
 *
 * ÖNEMLİ: Kaydırmanın kendisi bu bileşende DEĞİL. Kaydırma saf CSS
 * (`scroll-snap`) ile yapılıyor; parmak takibi, ivme ve hizalama tarayıcının
 * native davranışı — JavaScript ile taklit edilmiyor. Bu bileşen yalnızca
 * JavaScript kapalıyken kaybolan iki şeyi sağlıyor:
 *
 *   1. Kaydırdıkça adres çubuğunu güncellemek (paylaşılan link doğru sayfayı
 *      göstersin diye)
 *   2. Sayacı güncellemek
 *
 * JavaScript yüklenmezse kaydırma yine çalışır ve menünün tamamı gezilebilir;
 * yalnızca adres sabit kalır ve sayaç açılış sayfasında durur.
 *
 * İlk konumlandırma burada YAPILMIYOR — o, sayfaya gömülü senkron bir script
 * ile ilk boyamadan önce hallediliyor; yoksa paylaşılan bir link açılırken
 * bir kare boyunca 1. sayfa görünürdü.
 */
export function SayfaSayaci({
  kabId,
  sayfalar,
  dil,
  baslangicNo,
}: {
  kabId: string;
  /** Sayfa sırasına göre slug/no çiftleri. */
  sayfalar: { slug: string; no: number }[];
  dil: string;
  /** Sunucunun bildiği açılış sayfası — hydration bununla eşleşiyor. */
  baslangicNo: number;
}) {
  const [aktifNo, setAktifNo] = useState(baslangicNo);
  const sonYazilanRef = useRef<string | null>(null);

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

        const no = Number(enIyi.target.id.slice(1));
        const sayfa = sayfalar.find((s) => s.no === no);
        if (!sayfa) return;

        setAktifNo(no);

        // replaceState kullanılıyor, pushState değil: geri tuşu 7 sayfalık
        // bir yığınla dolmasın, müşteri geri deyince menüden çıkabilsin.
        const hedef = `/${dil}/menu/${sayfa.slug}`;
        if (sonYazilanRef.current !== hedef) {
          sonYazilanRef.current = hedef;
          window.history.replaceState(null, "", hedef);
        }
      },
      { root: kap, threshold: [0.5, 0.75, 1] },
    );

    bolumler.forEach((b) => gozlemci.observe(b));
    return () => gozlemci.disconnect();
  }, [kabId, sayfalar, dil]);

  return <>{aktifNo}</>;
}
