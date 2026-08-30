"use client";

import { useCallback, useEffect, useState } from "react";
import { useAktifSayfa, useBagli } from "@/components/aktifSayfa";
import { azHareket } from "@/components/kitapKaydirma";
import { ui } from "@/data/arayuz";
import type { DilKodu } from "@/data/menu";

/** Aşağı bakan chevron. Kenar oklarının aynalama zincirine GİRMİYOR. */
function AsagiChevron() {
  return (
    <svg className="kitap-ok-simge-asagi" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 9l7 7 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Kaydırma ölçümlerinde kullanılan tolerans — alt piksel yuvarlamaları için. */
const TOLERANS = 4;

/**
 * "Aşağıda devamı var" ipucu.
 *
 * Sayfalar artık tek ekrana sığmak zorunda değil; kategori tek sayfada
 * duruyor ve sığmazsa sayfa kendi içinde dikey kayıyor. Dikey kaydırma
 * çubuğu bilinçli olarak gizli (bkz. `.kitap-icerik`), bu yüzden devamının
 * olduğunu gösteren görünür bir işaret gerekiyor.
 *
 * ALT ŞERİTTE duruyor, sayfanın üstünde değil: içeriğin tamamen dışında
 * kaldığı için hiçbir ürünü veya fiyatı örtemiyor. Şeridin yüksekliğini
 * zaten "Menüye dön" düğmesinin 44px'lik dokunma hedefi belirliyor, ok
 * şeridi yükseltmiyor.
 *
 * YÖN: aşağı her iki yazma yönünde de aşağı. Chevron'un kendi sınıfı var,
 * kenar oklarının RTL aynalamasına katılmıyor.
 *
 * UÇTA GİZLENİYOR: sayfanın sonuna gelindiğinde ok kayboluyor. Okun tek işi
 * "aşağıda devamı var" demek; sonda devamı yok, duran bir ok yanlış bilgi
 * verirdi. Kenar oklarında da aynı karar verilmişti.
 *
 * JavaScript kapalıyken hiç render edilmiyor — taşma ölçülemeyeceği için
 * doğru bir ipucu üretilemez. Dikey kaydırma o durumda da çalışıyor, çünkü
 * kaydırmanın kendisi saf CSS.
 */
export function AsagiOk({
  kabId,
  sayfalar,
  dil,
  baslangicNo,
}: {
  kabId: string;
  sayfalar: { slug: string; no: number }[];
  dil: DilKodu;
  baslangicNo: number;
}) {
  const aktifNo = useAktifSayfa(kabId, sayfalar, baslangicNo);
  const bagli = useBagli();
  const [gorunsun, setGorunsun] = useState(false);

  /** Aktif sayfanın dikey kaydırma kutusu. */
  const kutuBul = useCallback(
    () => document.querySelector<HTMLElement>(`#s${aktifNo} .kitap-icerik`),
    [aktifNo],
  );

  useEffect(() => {
    const kutu = kutuBul();
    if (!kutu) return;

    const olc = () => {
      const tasiyor = kutu.scrollHeight - kutu.clientHeight > TOLERANS;
      const dahaVar = kutu.scrollTop + kutu.clientHeight < kutu.scrollHeight - TOLERANS;
      setGorunsun(tasiyor && dahaVar);
    };

    olc();
    kutu.addEventListener("scroll", olc, { passive: true });

    // Taşma sonradan da doğabiliyor: cihaz döndürülünce, yazı tipi geç
    // yüklenince, görsel yerine oturunca. ResizeObserver bunları yakalıyor.
    const gozlemci = new ResizeObserver(olc);
    gozlemci.observe(kutu);

    return () => {
      kutu.removeEventListener("scroll", olc);
      gozlemci.disconnect();
    };
  }, [kutuBul]);

  if (!bagli || !gorunsun) return null;

  const kaydir = () => {
    const kutu = kutuBul();
    if (!kutu) return;
    // Tam ekran boyu değil: bir miktar örtüşme kalsın ki müşteri nerede
    // kaldığını kaybetmesin. Kitap sayfalarının yatayda tam sayfa atlaması
    // farklı — orada sayfa sınırı var, burada süreklilik var.
    kutu.scrollBy({
      top: kutu.clientHeight * 0.85,
      behavior: azHareket() ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      className="kitap-ok-asagi"
      aria-label={ui("asagiKaydir", dil)}
      onClick={kaydir}
    >
      <span className="kitap-ok-govde">
        <AsagiChevron />
      </span>
    </button>
  );
}
