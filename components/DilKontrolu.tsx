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
 * Aktif dil `aria-current="true"` ile işaretli; görsel olarak da dolu zemin
 * ve ters renkle ayrılıyor — yalnızca renkle değil, şekille de.
 *
 * ÖN YÜKLEME KAPALI (`prefetch={false}`). Açıkken her menü sayfası dört
 * dilin adresini arka planda indiriyordu: kitap sayfasında 30 isteğin 18'i
 * buradan geliyordu, aktif dilin kendi adresi dahil. Dil değiştirmek nadir
 * bir iş; kapatmanın bedeli ölçüldü — yavaş 4G'de geçiş ~160 ms yerine
 * ~345 ms sürüyor. Ana akıştaki bağlantılar (kategoriler, Menüye dön)
 * ön yüklemeli kaldı, orada fark iki kat (Aşama 40).
 */
export function DilKontrolu({
  aktifDil,
  /** Dil önekinden SONRAKİ yol, başında eğik çizgiyle. Örn. "/menu/izgara". */
  yol,
}: {
  aktifDil: DilKodu;
  yol: string;
}) {
  return (
    <nav aria-label={ui("dilDegistir", aktifDil)} className="dil-kontrolu">
      <ul className="dil-listesi">
        {DILLER.map((dil) => {
          const aktif = dil === aktifDil;
          const bayrak = DIL_BAYRAGI[dil];
          return (
            <li key={dil}>
              <Link
                href={`/${dil}${yol}`}
                prefetch={false}
                hrefLang={dil}
                lang={dil}
                aria-current={aktif ? "true" : undefined}
                className={`dil-secenek odak ${aktif ? "dil-secenek-aktif" : ""}`}
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
