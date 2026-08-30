"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { sayfayaKaydir } from "@/components/kitapKaydirma";

/**
 * Sunucuda `useLayoutEffect` uyarı veriyor; orada zaten çalışmasına gerek yok.
 */
const useIzomorfikLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
 * Tam sayfa yüklemede ilk konumlandırmayı sayfaya gömülü senkron script
 * yapıyor (ilk boyamadan ÖNCE, yoksa paylaşılan bir link açılırken bir kare
 * boyunca 1. sayfa görünürdü). Burada ise İSTEMCİ TARAFI gezinme için aynı
 * konumlandırma tekrarlanıyor — aşağıdaki nota bakınız.
 */
export function SayfaSayaci({
  kabId,
  sayfalar,
  dil,
  baslangicNo,
  baslangicSlug,
  /**
   * Dil onekinden sonraki yol oneki. Uretimde bos; onizlemede "/onizleme/gece"
   * gibi bir deger alip adres cubugunu kendi rotasinda tutuyor.
   */
  yolOneki = "",
  /**
   * Kaydirdikca adres cubugu guncellensin mi? Uretimde evet — paylasilan link
   * dogru sayfayi gostersin diye. Onizlemede hayir: onizleme rotasinda
   * `menu/<slug>` diye bir adres yok, yazilsa yenilemede 404 olurdu.
   */
  adresiGuncelle = true,
}: {
  kabId: string;
  /** Sayfa sırasına göre slug/no çiftleri. */
  sayfalar: { slug: string; no: number }[];
  dil: string;
  /** Sunucunun bildiği açılış sayfası — hydration bununla eşleşiyor. */
  baslangicNo: number;
  /** Açılış sayfasının slug'ı; adres hafızasını kurmak için. */
  baslangicSlug: string;
  yolOneki?: string;
  adresiGuncelle?: boolean;
}) {
  const [aktifNo, setAktifNo] = useState(baslangicNo);
  const [oncekiBaslangic, setOncekiBaslangic] = useState(baslangicNo);
  const sonYazilanRef = useRef<string | null>(null);

  // İstemci tarafı gezinmede bileşen yeniden kullanılıyor, mount olmuyor:
  // rota parametresi değişince sayaç açılış sayfasına dönmeli. React'in
  // "render sırasında state düzeltme" kalıbı — effect'te setState çağırmaktan
  // ucuz, ekstra render turu doğurmuyor.
  if (oncekiBaslangic !== baslangicNo) {
    setOncekiBaslangic(baslangicNo);
    setAktifNo(baslangicNo);
  }

  /*
    Kitabı açılış sayfasına konumlandır.

    Sayfanın sonundaki satır içi <script> bunu tam sayfa yüklemede yapıyor.
    Ama kategori listesinden <Link> ile gelindiğinde belge yeniden
    yüklenmiyor: React ağacı güncelliyor ve `dangerouslySetInnerHTML` ile
    basılan script innerHTML üzerinden DOM'a girdiği için TARAYICI ONU
    ÇALIŞTIRMIYOR. Sonuç: `data-acilis` doğru yazılıyordu, kimse okumuyordu ve
    hangi kategoriye basılırsa basılsın kitap 1. sayfada kalıyordu.

    Bu etki o boşluğu kapatıyor; boyamadan önce çalışıyor.
  */
  useIzomorfikLayoutEffect(() => {
    const kap = document.getElementById(kabId);
    if (kap) sayfayaKaydir(kap, baslangicNo);
    // Gözlemci açılış sayfasını görüp adresi gereksiz yere yeniden yazmasın.
    sonYazilanRef.current = `/${dil}${yolOneki}/menu/${baslangicSlug}`;
  }, [kabId, baslangicNo, dil, baslangicSlug, yolOneki]);

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
        if (!adresiGuncelle) return;
        const hedef = `/${dil}${yolOneki}/menu/${sayfa.slug}`;
        if (sonYazilanRef.current !== hedef) {
          sonYazilanRef.current = hedef;
          window.history.replaceState(null, "", hedef);
        }
      },
      { root: kap, threshold: [0.5, 0.75, 1] },
    );

    bolumler.forEach((b) => gozlemci.observe(b));
    return () => gozlemci.disconnect();
  }, [kabId, sayfalar, dil, yolOneki, adresiGuncelle]);

  return <>{aktifNo}</>;
}
