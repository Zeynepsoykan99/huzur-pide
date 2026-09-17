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

/* ---------------------------------------------------------------------------
   Kitabın ekrandaki sayfası — dil bağlantıları için ortak kayıt.

   NEDEN: Üst şeritteki bayraklar sunucuda AÇILIŞ sayfasına göre basılıyordu
   (`/en/menu/corbalar`). Müşteri kitapta Tatlılar'a kaydırdıktan sonra dil
   değiştirince yeni dilde Çorbalar'a, yani başa düşüyordu. Dört dilde
   ölçüldü (Aşama 42, Ö1). Adres çubuğu doğru sayfayı gösteriyordu, çünkü
   onu `SayfaSayaci` güncelliyordu; bağlantılar ise hiç güncellenmiyordu.

   Çözüm: `SayfaSayaci` ekrandaki sayfanın slug'ını burada yayınlıyor,
   bayrak bağlantıları (`KitapDilBaglantisi`) buradan okuyor. Böylece
   "hangi sayfadayız" bilgisi tek yerde hesaplanıyor.

   `acilis` ANAHTAR: kayıt hangi kitaba (hangi açılış rotasına) ait olduğunu
   taşıyor. İstemci tarafı gezinmede önceki kitabın slug'ı bir kare boyunca
   kayıtta kalsa bile, açılışı eşleşmeyen bağlantı onu yok sayıp kendi
   açılış sayfasını kullanıyor — yanlış sayfaya giden bir bağlantı hiç
   oluşmuyor.

   Sunucuda ve hydration sırasında kayıt boş (`null`), bağlantı açılış
   sayfasına gidiyor; bu, sunucunun bastığı HTML ile birebir aynı. JavaScript
   kapalıyken de bağlantılar açılış sayfasına gidiyor (önceki davranış).
   --------------------------------------------------------------------------- */

type KitapKonumu = { acilis: string; slug: string } | null;

let kitapKonumu: KitapKonumu = null;
const kitapDinleyicileri = new Set<() => void>();

/** `SayfaSayaci` çağırıyor: ekrandaki sayfa değiştiğinde ya da kitap kapanınca. */
export function kitapKonumunuYayinla(yeni: KitapKonumu): void {
  if (yeni?.acilis === kitapKonumu?.acilis && yeni?.slug === kitapKonumu?.slug) return;
  kitapKonumu = yeni;
  kitapDinleyicileri.forEach((dinle) => dinle());
}

function kitapKonumunaAboneOl(dinle: () => void): () => void {
  kitapDinleyicileri.add(dinle);
  return () => kitapDinleyicileri.delete(dinle);
}

/**
 * Kitapta ekranda duran sayfanın slug'ı. Kayıt başka bir kitaba aitse ya da
 * boşsa açılış sayfası döner.
 */
export function useKitapSlug(acilis: string): string {
  const konum = useSyncExternalStore(
    kitapKonumunaAboneOl,
    () => kitapKonumu,
    () => null,
  );
  return konum && konum.acilis === acilis ? konum.slug : acilis;
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
