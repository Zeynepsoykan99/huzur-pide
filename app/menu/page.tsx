import type { Metadata } from "next";
import Link from "next/link";
import { UstBaslik } from "@/components/UstBaslik";
import { MENU, metin } from "@/data/menu";

export const metadata: Metadata = {
  title: "Menü · Huzur Pide",
};

/**
 * Ekran A — Kategori listesi.
 *
 * Basılı menülerdeki "içindekiler" sayfası mantığında: kategori adı, noktalı
 * ayraç, sağda sayfa numarası. Sayfa numaraları veri dosyasından geliyor.
 *
 * Dil şu an sabit "tr"; Aşama 3'te dil mantığı bağlandığında bu değer
 * dışarıdan gelecek.
 */
const DIL = "tr" as const;

export default function MenuSayfasi() {
  return (
    <div className="menu-sayfa">
      <UstBaslik altBaslik="Menü" />

      <main>
        <h1 className="sr-only">Huzur Pide menüsü — kategoriler</h1>

        <nav aria-label="Menü kategorileri">
          <ul className="flex flex-col">
            {MENU.map((kategori) => (
              <li key={kategori.slug}>
                <Link href={`/menu/${kategori.slug}`} className="icindekiler-satir">
                  <span className="icindekiler-ad">{metin(kategori.ad, DIL)}</span>
                  <span className="nokta" aria-hidden="true" />
                  {/* Sayfa numarasi gorsel bir detay; ekran okuyucuya
                      anlamli bir cumle olarak okunmasi icin etiketlendi. */}
                  <span className="icindekiler-sayfa">
                    <span className="sr-only">Sayfa </span>
                    {kategori.sayfaNo}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
