import Image from "next/image";
import {
  YerTutucuIcecek,
  YerTutucuIzgara,
  YerTutucuPide,
  YerTutucuSalata,
  YerTutucuTatli,
} from "@/components/Ikonlar";
import { metin, type DilKodu, type Urun } from "@/data/menu";

/**
 * Kategori slug'ı → yer tutucu ikonu.
 *
 * Tek bir ikon yerine kategoriye göre ikon kullanılıyor: içeceğe pide silüeti
 * göstermek anlamca yanlıştı, ayrıca aynı yassı şekil bir sayfada yedi kez alt
 * alta gelince desen gibi okunuyordu.
 *
 * Yeni kategori eklendiğinde burada karşılığı yoksa pide ikonuna düşüyor —
 * ekran boş kalmıyor, sadece ikon jenerik oluyor.
 */
const YER_TUTUCULAR: Record<string, (p: { className?: string }) => React.ReactElement> = {
  "kapali-pide": YerTutucuPide,
  izgara: YerTutucuIzgara,
  salatalar: YerTutucuSalata,
  tatlilar: YerTutucuTatli,
  icecekler: YerTutucuIcecek,
};

/**
 * Ürün görseli — fotoğraf varsa `next/image`, yoksa kategorisinin yer tutucusu.
 *
 * Yuva her iki durumda da aynı ölçüde: fotoğraf eklendiğinde satır hizası
 * değişmiyor. Yer tutucu beyaz kutu ya da "resim yok" ikonu değil, temanın
 * kendi renginde sessiz bir işaret — ölçü ve renk `--t-*` değişkenlerinden.
 */
export function UrunGorseli({
  urun,
  dil,
  kategoriSlug,
}: {
  urun: Urun;
  dil: DilKodu;
  kategoriSlug: string;
}) {
  if (!urun.gorsel) {
    const Ikon = YER_TUTUCULAR[kategoriSlug] ?? YerTutucuPide;
    return (
      <span className="gorsel-yuvasi" aria-hidden="true">
        <Ikon className="yer-tutucu-ikon" />
      </span>
    );
  }

  return (
    <span className="gorsel-yuvasi">
      <Image
        src={urun.gorsel.src}
        alt={metin(urun.gorsel.alt, dil)}
        width={urun.gorsel.genislik}
        height={urun.gorsel.yukseklik}
        sizes="(min-width: 768px) 208px, 68px"
      />
    </span>
  );
}
