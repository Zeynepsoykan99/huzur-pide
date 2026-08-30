"use client";

import { useAktifSayfa, useBagli } from "@/components/aktifSayfa";
import { sayfayaKaydir } from "@/components/kitapKaydirma";
import { ui } from "@/data/arayuz";
import type { DilKodu } from "@/data/menu";

/** İleri yönü gösteren chevron. Yön aynalaması CSS'te (`--ok-flip`). */
function Chevron() {
  return (
    <svg className="kitap-ok-simge" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Kitabın kenarlarındaki sayfa çevirme okları.
 *
 * Parmakla kaydırmanın YERİNE geçmiyor, yanında duruyor: kaydırma saf CSS
 * scroll-snap ile çalışmaya devam ediyor, oklar aynı kaba `scrollBy` yapıyor
 * ve aynı snap noktalarına oturuyor. Ok düğmeleri kitabın dışında, kardeş
 * katmanda: kaydırma kabının içine konan mutlak konumlu bir çocuk sayfalarla
 * birlikte kayardı.
 *
 * Uçlarda ok GİZLENİYOR, pasif gösterilmiyor: basınca bir şey olmayan bir
 * düğme müşteriye menü bozuk hissi veriyor. Okun yokluğu "bu yönde sayfa yok"
 * bilgisini zaten veriyor, alt şeritteki sayaç da destekliyor.
 *
 * JavaScript yüklenmeden hiç render edilmiyorlar — çalışmayan bir kontrol
 * gösterilmiyor. Kaydırma o durumda da çalışmaya devam ediyor.
 */
export function SayfaOklari({
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

  // Oklar ancak JavaScript devredeyken beliriyor: calismayan bir kontrol
  // gosterilmiyor. Kaydirma o durumda da calismaya devam ediyor.
  const bagli = useBagli();

  if (!bagli) return null;

  const cevir = (hedef: number) => {
    const kap = document.getElementById(kabId);
    if (kap) sayfayaKaydir(kap, hedef, true);
  };

  const toplam = sayfalar.length;

  return (
    <>
      {aktifNo > 1 ? (
        <button
          type="button"
          className="kitap-ok kitap-ok-geri"
          aria-label={ui("oncekiSayfa", dil)}
          onClick={() => cevir(aktifNo - 1)}
        >
          <span className="kitap-ok-govde">
            <Chevron />
          </span>
        </button>
      ) : null}

      {aktifNo < toplam ? (
        <button
          type="button"
          className="kitap-ok kitap-ok-ileri"
          aria-label={ui("sonrakiSayfa", dil)}
          onClick={() => cevir(aktifNo + 1)}
        >
          <span className="kitap-ok-govde">
            <Chevron />
          </span>
        </button>
      ) : null}
    </>
  );
}
