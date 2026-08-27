import Link from "next/link";
import { ui } from "@/data/arayuz";
import { DILLER, DIL_ADI, DIL_BAYRAGI, DIL_KISA_AD, metin, type DilKodu } from "@/data/menu";

/**
 * Menü sayfalarındaki dil değiştirme kontrolü.
 *
 * Her seçenek bir bağlantı — JavaScript yok. Aynı sayfanın başka dildeki
 * adresine gidiyor (`/tr/menu/izgara` → `/ar/menu/izgara`), yani dil
 * değiştirince müşteri baktığı sayfayı kaybetmiyor.
 *
 * Aktif dil `aria-current="true"` ile işaretli; görsel olarak da sütlü kahve
 * zemin ve alt çizgiyle ayrılıyor — yalnızca renkle değil, şekille de.
 */
export function DilKontrolu({
  aktifDil,
  /** Dil önekinden SONRAKİ yol, başında eğik çizgiyle. Örn. "/menu/izgara". */
  yol,
  /** Menü kitabındaki sıkışık varyant: üst boşluk azaltılıyor. */
  sikisik = false,
}: {
  aktifDil: DilKodu;
  yol: string;
  sikisik?: boolean;
}) {
  return (
    <nav
      aria-label={ui("dilDegistir", aktifDil)}
      className={`flex justify-center ${sikisik ? "mt-2" : "mt-5"}`}
    >
      <ul className="flex items-center gap-1">
        {DILLER.map((dil) => {
          const aktif = dil === aktifDil;
          const bayrak = DIL_BAYRAGI[dil];
          return (
            <li key={dil}>
              <Link
                href={`/${dil}${yol}`}
                hrefLang={dil}
                lang={dil}
                aria-current={aktif ? "true" : undefined}
                className={`dil-secenek ${aktif ? "dil-secenek-aktif" : ""}`}
              >
                {/* Bayrak dekoratif: yanindaki kisaltma zaten dili soyluyor. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/flags/${bayrak.kod}.svg`}
                  alt=""
                  aria-hidden="true"
                  className="dil-bayrak"
                />
                <span aria-hidden="true">{DIL_KISA_AD[dil]}</span>
                {/* Ekran okuyucu kisaltma yerine dilin tam adini duysun. */}
                <span className="sr-only">
                  {DIL_ADI[dil]} — {metin(bayrak.ulke, aktifDil)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
