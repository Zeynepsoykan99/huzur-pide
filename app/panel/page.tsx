import Link from "next/link";
import { TemaMotifi } from "@/components/TemaMotifi";
import { aktifTema } from "@/data/menuKaynak";
import { TEMA_ADI } from "@/data/tema";
import { mevcutYonetici } from "@/lib/oturum";
import { Giris } from "./Giris";
import { CikisDugmesi } from "./CikisDugmesi";

/**
 * Panelin ana ekranı.
 *
 * Girişsiz açılamaz: oturum yoksa doğrudan giriş formu basılıyor, panel
 * içeriği hiç render edilmiyor — yönlendirme değil, içeriğin sunucuda hiç
 * üretilmemesi. Ayrıca her Server Action kendi içinde yetkiyi yeniden
 * doğruluyor, sayfa korumasına tek başına güvenilmiyor.
 *
 * Panel dinamik: her istekte oturum çerezi doğrulanıyor, önbelleğe alınmıyor.
 */
export const dynamic = "force-dynamic";

function Ok() {
  return (
    <svg className="panel-ok" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

export default async function PanelAnaEkrani() {
  const yonetici = await mevcutYonetici();

  if (!yonetici) {
    return (
      <div className="panel-giris">
        <div className="panel-giris-kutu">
          <div className="panel-giris-tepe">
            <TemaMotifi className="panel-giris-motif" tema="cini" />
            <p className="panel-giris-ad">Huzur Pide</p>
            <p className="panel-giris-alt">Yönetim paneli</p>
          </div>
          <Giris />
        </div>
      </div>
    );
  }

  const tema = await aktifTema();

  const bolumler = [
    {
      yol: "/panel/fiyatlar",
      ad: "Fiyatları düzenle",
      alt: "Ürün fiyatlarını değiştir",
    },
    {
      yol: "/panel/urun-ekle",
      ad: "Yeni ürün ekle",
      alt: "Menüye yeni bir ürün ekle",
    },
    {
      yol: "/panel/tema",
      ad: "Menü görünümü",
      alt: `Şu an: ${TEMA_ADI[tema]}`,
    },
  ];

  return (
    <>
      <header className="panel-ust">
        <span className="panel-marka">
          <TemaMotifi className="panel-marka-motif" tema={tema} />
          Huzur Pide
        </span>
        <CikisDugmesi />
      </header>

      <main className="panel-govde">
        <h1 className="panel-baslik">Yönetim</h1>
        <p className="panel-aciklama">
          Ne yapmak istiyorsunuz?
        </p>

        <ul className="panel-menu">
          {bolumler.map((b) => (
            <li key={b.yol}>
              <Link href={b.yol} className="panel-buyuk-dugme">
                <span>
                  <span className="panel-buyuk-dugme-ad">{b.ad}</span>
                  <span className="panel-buyuk-dugme-alt">{b.alt}</span>
                </span>
                <Ok />
              </Link>
            </li>
          ))}
        </ul>

        <p className="panel-not">
          Yaptığınız değişiklikler kaydedildikten sonra menüye birkaç saniye
          içinde yansır. Menüyü görmek için{" "}
          <Link href="/tr/menu">müşteri menüsünü açın</Link>.
        </p>
      </main>
    </>
  );
}
