import Link from "next/link";
import { DilKontrolu } from "@/components/DilKontrolu";
import { TemaMotifi } from "@/components/TemaMotifi";
import { ui } from "@/data/arayuz";
import type { DilKodu } from "@/data/menu";
import type { TemaKodu } from "@/data/tema";

/**
 * Menü tarafındaki ekranların üstünde duran marka ve dil değiştirme kontrolü.
 *
 * Başlığa basıldığında o dilin ana seçim ekranına dönülüyor — QR menüde geri
 * tuşu her zaman elverişli olmuyor, başlığın kendisi çıkış yolu oluyor.
 *
 * NOT: ana seçim ve dil seçim ekranları bunu KULLANMIYOR. O ikisi kitabın
 * dilinden ayrı, kendi ferah kompozisyonlarında duruyor.
 */
export function UstBaslik({
  dil,
  /** Dil önekinden SONRAKİ yol. Dil değiştirilince aynı sayfada kalınır. */
  yol,
  /**
   * Menü kitabında kullanılan sıkışık varyant: dikey boşluklar kısılıyor.
   * Kitap ekran yüksekliğine sığmak zorunda, şeride harcanan her piksel
   * ürün satırlarından gidiyor.
   */
  sikisik = false,
  /** Onizlemede baska bir temanin motifini basmak icin. */
  tema,
  /** Onizlemede baglantilari onizlemenin icinde tutar. */
  yolOneki = "",
}: {
  dil: DilKodu;
  yol: string;
  sikisik?: boolean;
  tema?: TemaKodu;
  yolOneki?: string;
}) {
  return (
    <header className={`ust-serit ${sikisik ? "ust-serit-sikisik" : ""}`}>
      <Link
        href={`/${dil}${yolOneki}/secim`}
        aria-label={ui("anaEkranaDon", dil)}
        className="ust-marka odak"
      >
        {/* Marka isareti dekoratif: yanindaki metin ayni bilgiyi veriyor. */}
        <TemaMotifi className="ust-marka-motif" tema={tema} />
        <span className="ust-marka-adi">Huzur Pide</span>
      </Link>
      <DilKontrolu aktifDil={dil} yol={yol} />
    </header>
  );
}
