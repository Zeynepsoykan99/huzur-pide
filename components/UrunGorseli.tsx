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
 * Fotoğrafı olmayan ürünler için yer tutucu.
 *
 * Gerçek görselle birebir aynı ölçüde duruyor (mobilde kare, md üstünde 16:9),
 * böylece fotoğraf eklendiğinde satır hizası hiç değişmiyor. Beyaz kutu ya da
 * "resim yok" ikonu değil, paletin kendi dokusundan sessiz bir işaret.
 *
 * Bilgi taşımadığı için ekran okuyucudan gizli.
 */
function YerTutucu({ kategoriSlug }: { kategoriSlug: string }) {
  const Ikon = YER_TUTUCULAR[kategoriSlug] ?? YerTutucuPide;
  return (
    <span className="urun-gorsel-yer-tutucu" aria-hidden="true">
      {/*
        Yukseklige gore olcekleniyor, genislige gore degil: yuva mobilde kare
        (80px), md ustunde 16:9 (208x117). Genislige gore olceklenseydi kare
        viewBox'li ikon genis yuvada asagi tasardi.
      */}
      <Ikon className="h-[52%] w-auto" />
    </span>
  );
}

/**
 * Ürün görseli — fotoğraf varsa `next/image`, yoksa kategorisinin yer tutucusu.
 *
 * `sizes` CSS'teki gerçek ölçüleri söylüyor; tarayıcı srcset'ten doğru boyu
 * bununla seçiyor, telefona masaüstü boyutunda dosya inmiyor. İki ölçü var:
 * çok fiyatlı pide tablosunda görsel telefonda 56px (satırı üç fiyat sütunuyla
 * paylaşıyor), diğer sayfalarda 80px. md üstünde ikisi de 208px.
 */
export function UrunGorseli({
  urun,
  dil,
  kategoriSlug,
  /** Çok fiyatlı tablo satırı: görsel telefonda 80px değil 56px. */
  dar = false,
}: {
  urun: Urun;
  dil: DilKodu;
  kategoriSlug: string;
  dar?: boolean;
}) {
  if (!urun.gorsel) return <YerTutucu kategoriSlug={kategoriSlug} />;

  return (
    <Image
      src={urun.gorsel.src}
      alt={metin(urun.gorsel.alt, dil)}
      width={urun.gorsel.genislik}
      height={urun.gorsel.yukseklik}
      sizes={dar ? "(min-width: 768px) 208px, 56px" : "(min-width: 768px) 208px, 80px"}
      className="urun-gorsel"
    />
  );
}
