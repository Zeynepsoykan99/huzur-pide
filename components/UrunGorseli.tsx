import Image from "next/image";
import { metin, type DilKodu, type Urun } from "@/data/menu";

/**
 * Fotoğrafı olmayan ürünler için yer tutucu.
 *
 * Gerçek görselle birebir aynı ölçüde duruyor (mobilde kare, md üstünde 16:9),
 * böylece fotoğraf eklendiğinde satır hizası hiç değişmiyor. İçinde logodaki
 * pide silüetinin sadeleştirilmiş hâli var — beyaz kutu ya da "resim yok"
 * ikonu değil, paletin kendi dokusundan sessiz bir işaret.
 *
 * Bilgi taşımadığı için ekran okuyucudan gizli.
 */
function YerTutucu() {
  return (
    <span className="urun-gorsel-yer-tutucu" aria-hidden="true">
      {/*
        Cizgi degil dolgu kullaniliyor: mobilde kutu 56px ve ince bir konturun
        cizgisi 1px'in altina dusup kayboluyordu. Iki farkli dolgu opakligi
        (hamur kenari ve ic dolgu) sekli her boyutta okunur tutuyor.
        viewBox pide silueti etrafinda daraltildi.
      */}
      <svg viewBox="3 8 58 24" className="w-[68%]">
        {/* Kabaran hamur kenari */}
        <path
          d="M4 20c11-11 45-11 56 0-11 11-45 11-56 0Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        {/* Ic dolgu — biraz daha koyu */}
        <path
          d="M15 20c8-6 26-6 34 0-8 6-26 6-34 0Z"
          fill="currentColor"
          fillOpacity="0.55"
        />
      </svg>
    </span>
  );
}

/**
 * Ürün görseli — fotoğraf varsa `next/image`, yoksa yer tutucu.
 *
 * `sizes`: mobilde 56px, md üstünde 176px gösteriliyor. Tarayıcı bu bilgiyle
 * srcset'ten doğru boyu seçiyor, telefona 800px'lik dosya inmiyor.
 */
export function UrunGorseli({ urun, dil }: { urun: Urun; dil: DilKodu }) {
  if (!urun.gorsel) return <YerTutucu />;

  return (
    <Image
      src={urun.gorsel.src}
      alt={metin(urun.gorsel.alt, dil)}
      width={urun.gorsel.genislik}
      height={urun.gorsel.yukseklik}
      sizes="(min-width: 768px) 176px, 56px"
      className="urun-gorsel"
    />
  );
}
