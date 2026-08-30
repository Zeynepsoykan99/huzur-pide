import Link from "next/link";
import { AsagiOk } from "@/components/AsagiOk";
import { PideIkonu, SofraIkonu } from "@/components/Ikonlar";
import { SayfaOklari } from "@/components/SayfaOklari";
import { SayfaSayaci } from "@/components/SayfaSayaci";
import { TemaMotifi } from "@/components/TemaMotifi";
import { UrunGorseli } from "@/components/UrunGorseli";
import { UstBaslik } from "@/components/UstBaslik";
import { ui } from "@/data/arayuz";
import {
  DILLER,
  DIL_ADI,
  DIL_BAYRAGI,
  DIL_YONU,
  MENU,
  SAYFALAR,
  fiyatYaz,
  icerikMetni,
  kategorininSayfasi,
  metin,
  sayfaNumarasi,
  type DilKodu,
  type MenuSayfasi,
  type Urun,
} from "@/data/menu";
import type { TemaKodu } from "@/data/tema";

/**
 * Uygulamanın görünen bütün ekranları, tek yerde.
 *
 * Rota dosyaları (`app/[dil]/…/page.tsx`) yalnızca parametreyi doğrulayıp
 * buradaki bileşeni çağırıyor. Önizleme rotası da AYNI bileşenleri, farklı
 * bir tema sarmalayıcısının içinde çağırıyor — böylece önizlemede görülen ile
 * üretimde çıkan bire bir aynı oluyor, iki ayrı markup bakımı kalmıyor.
 *
 * Ekranlar temayı BİLMİYOR: renk, yazı tipi ve ölçüler --t-* değişkenlerinden
 * geliyor. Tek istisna `TemaMotifi`, o da hangi temanın motifini basacağını
 * parametreyle alabiliyor (önizleme için).
 */

/** Motif için tema aktarımı — verilmezse aktif tema. */
type MotifProps = { tema?: TemaKodu };

function Ok() {
  return (
    <svg className="lang-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

/** Başlık altındaki kural + motif üçlüsü. Her ekranda aynı. */
function BaslikAyraci({ tema, sinif = "baslik-alt" }: MotifProps & { sinif?: string }) {
  return (
    <div className={sinif} aria-hidden="true">
      <span className="kural" />
      <TemaMotifi className="motif" tema={tema} />
      <span className="kural" />
    </div>
  );
}

/* =========================================================================
   1 — Dil seçimi. Uygulamanın ilk açılış ekranı.

   Kitabın dilinden bilinçli olarak ayrı: sıkışık şerit, sayfa sayacı ve ok
   yok; ortalanmış, ferah bir kompozisyon.
   ========================================================================= */

/** "Dil Seçiniz" ifadesinin dört dildeki hâli — başlığın altındaki satır. */
const DIL_SECINIZ_HEPSI: Record<DilKodu, string> = {
  tr: "Dil Seçiniz",
  en: "Choose language",
  ar: "اختر اللغة",
  ru: "Выберите язык",
};

export function DilSecimEkrani({
  dil,
  tema,
  yolOneki = "",
}: MotifProps & { dil: DilKodu; /** Önizlemede bağlantıları kendi içinde tutar. */ yolOneki?: string }) {
  return (
    <div className="giris-ekrani">
      <div className="giris-govde">
        <header className="giris-tepe">
          {/* Marka işareti temadan geliyor: tema değişince logo da değişiyor.
              Dekoratif — hemen altındaki <h1> aynı bilgiyi veriyor. */}
          <TemaMotifi className="giris-motif" tema={tema} />
          <h1 className="marka-adi">Huzur Pide</h1>
          <BaslikAyraci tema={tema} sinif="giris-ayrac" />
          <p className="slogan">{ui("slogan", dil)}</p>
        </header>

        <main>
          <h2 id="lang-heading" className="bolum-basligi">
            {ui("dilSeciniz", dil)}
          </h2>

          {/* Diğer üç dildeki karşılığı; her biri kendi lang niteliğiyle.
              Ayraç noktası kendi rengini almıyor, paragrafın rengini miras
              alıyor — küçük bir nokta ayrı bir tonda AA eşiğini geçemiyordu. */}
          <p className="diller-alt-satir">
            {DILLER.filter((d) => d !== dil).map((d, i) => (
              <span key={d}>
                {i > 0 ? (
                  <span aria-hidden="true" className="mx-1.5">
                    ·
                  </span>
                ) : null}
                <span lang={d} dir={DIL_YONU[d]}>
                  {DIL_SECINIZ_HEPSI[d]}
                </span>
              </span>
            ))}
          </p>

          <div
            id="language-list"
            role="group"
            aria-labelledby="lang-heading"
            className="dil-kartlari"
          >
            {DILLER.map((hedef) => {
              const bayrak = DIL_BAYRAGI[hedef];
              return (
                <Link
                  key={hedef}
                  href={`/${hedef}${yolOneki}/secim`}
                  hrefLang={hedef}
                  data-lang={hedef}
                  data-dir={DIL_YONU[hedef]}
                  className="kart odak"
                >
                  <span className="flag-slot">
                    {/* Bayrak dekoratif: yanındaki dil adı aynı bilgiyi veriyor. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/flags/${bayrak.kod}.svg`}
                      alt=""
                      aria-hidden="true"
                      className="flag"
                    />
                  </span>
                  {/* Arapça etikette dir="rtl" YOK: tek yönlü bir metin, yön
                      işareti olmadan da doğru render oluyor. dir verilseydi
                      metin buton içinde sağa yaslanıp hizayı bozardı. */}
                  <span className="lang-name" lang={hedef}>
                    {DIL_ADI[hedef]}
                  </span>
                  <span className="sr-only">— {metin(bayrak.ulke, dil)}</span>
                  <Ok />
                </Link>
              );
            })}
          </div>
        </main>
      </div>

      <footer className="giris-dipnot">
        <p>Huzur Pide · {ui("dijitalMenu", dil)}</p>
      </footer>
    </div>
  );
}

/* =========================================================================
   2 — Ana seçim: Menü mü, Organizasyon mu.

   Kitabın dilinden TAMAMEN ayrı: sıkışık üst şerit yok, sayfa sayacı yok, ok
   yok, levha çerçevesi yok, dil kontrolü yok. Yalnızca iki iri buton.
   Bu kural bütün temalarda geçerli.
   ========================================================================= */
export function AnaSecimEkrani({
  dil,
  tema,
  yolOneki = "",
}: MotifProps & { dil: DilKodu; yolOneki?: string }) {
  const kartlar = [
    { yol: `/${dil}${yolOneki}/menu`, baslik: ui("menu", dil), Ikon: PideIkonu },
    {
      yol: `/${dil}${yolOneki}/organizasyon`,
      baslik: ui("organizasyon", dil),
      Ikon: SofraIkonu,
    },
  ];

  return (
    <div className="giris-ekrani">
      <div className="giris-govde">
        <header className="giris-tepe">
          <Link href={`/${dil}${yolOneki}`} aria-label={ui("dilSeciniz", dil)} className="odak">
            <TemaMotifi className="giris-motif" tema={tema} />
          </Link>
          <p className="marka-adi">Huzur Pide</p>
          <BaslikAyraci tema={tema} sinif="giris-ayrac" />
        </header>

        <main>
          {/* Ekranda ayrı bir başlık yok — iki buton kendini anlatıyor. Ekran
              okuyucu için sayfanın ne olduğu yine de söylenmeli. */}
          <h1 className="sr-only">Huzur Pide — {ui("bolumSecin", dil)}</h1>

          <nav aria-label={ui("bolumSecin", dil)}>
            <ul className="secim-listesi">
              {kartlar.map(({ yol, baslik, Ikon }) => (
                <li key={yol}>
                  <Link href={yol} className="kart secim-karti odak">
                    <Ikon className="secim-ikonu" />
                    <span className="secim-basligi">{baslik}</span>
                    <Ok />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </main>
      </div>
    </div>
  );
}

/* =========================================================================
   3 — Kategori listesi ("içindekiler")
   ========================================================================= */
export function KategoriListesiEkrani({
  dil,
  tema,
  yolOneki = "",
}: MotifProps & { dil: DilKodu; yolOneki?: string }) {
  // Onizlemede kategori basina ayri bir rota yok; hepsi tek menu ekranini
  // aciyor. Uretimde her kategori kendi adresine gidiyor.
  const onizleme = yolOneki !== "";

  return (
    <div className="menu-sayfa">
      <UstBaslik dil={dil} yol={`${yolOneki}/menu`} tema={tema} yolOneki={yolOneki} />

      <main className="sayfa-govdesi">
        <div className="sayfa-basligi">
          <h1 className="ekran-basligi">{ui("menu", dil)}</h1>
          <BaslikAyraci tema={tema} />
        </div>

        <nav aria-label={ui("menuKategorileri", dil)}>
          <ul className="icindekiler">
            {MENU.map((kategori) => (
              <li key={kategori.slug}>
                {/* Her kategori tek sayfa: slug'ı kategori slug'ının aynısı. */}
                <Link
                  href={
                    onizleme
                      ? `/${dil}${yolOneki}/menu`
                      : `/${dil}/menu/${kategorininSayfasi(kategori).slug}`
                  }
                  className="icindekiler-satir odak"
                >
                  <span className="icindekiler-no" aria-hidden="true">
                    {String(sayfaNumarasi(kategori)).padStart(2, "0")}
                  </span>
                  <span className="icindekiler-ad">{metin(kategori.ad, dil)}</span>
                  <span className="nokta" aria-hidden="true" />
                  <span className="icindekiler-sayfa">
                    <span className="sr-only">{ui("sayfa", dil)} </span>
                    {sayfaNumarasi(kategori)}
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

/* =========================================================================
   4 — Menü kitabı
   ========================================================================= */

const KAP_ID = "kitap";

function TekFiyatliSatir({
  urun,
  dil,
  kategoriSlug,
}: {
  urun: Urun;
  dil: DilKodu;
  kategoriSlug: string;
}) {
  const fiyat = urun.fiyatlar[0];
  const icerik = icerikMetni(urun, dil);
  return (
    <li className="urun-satir">
      <UrunGorseli urun={urun} dil={dil} kategoriSlug={kategoriSlug} />
      <div className="urun-govde">
        <div className="ayrac-satir">
          <span className="urun-ad">{metin(urun.ad, dil)}</span>
          <span className="nokta" aria-hidden="true" />
          <span className="urun-fiyat" data-dogrulandi={fiyat.dogrulandi}>
            {fiyatYaz(fiyat.tutar)}
          </span>
        </div>
        {icerik ? <p className="urun-icerik">{icerik}</p> : null}
      </div>
    </li>
  );
}

/**
 * Çok fiyatlı sayfa (kapalı pideler).
 *
 * Veri gerçekten tablo: ürün x hamur boyu -> fiyat. Bu yüzden CSS ızgara değil
 * gerçek <table>: sütun başlıkları fiyat hücrelerinin tam üstüne oturuyor ve
 * <th scope="col"> sayesinde ekran okuyucu her hücrenin hangi sütuna ait
 * olduğunu kendiliğinden söylüyor. Tablo Arapça'da kendiliğinden aynalanıyor.
 */
function CokFiyatliTablo({ sayfa, dil }: { sayfa: MenuSayfasi; dil: DilKodu }) {
  const { kategori, urunler } = sayfa;
  return (
    <table className="pide-tablo mt-2 md:mt-6">
      <caption className="sr-only">
        {metin(kategori.ad, dil)} — {ui("hamurBoyunaGoreFiyatlar", dil)}
      </caption>
      <colgroup>
        <col className="w-14 md:w-52" />
        <col />
        {kategori.sutunlar.map((s) => (
          <col key={s.kod} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th scope="col">
            <span className="sr-only">{ui("gorsel", dil)}</span>
          </th>
          <th scope="col">
            <span className="sr-only">{ui("urun", dil)}</span>
          </th>
          {kategori.sutunlar.map((sutun) => (
            <th key={sutun.kod} scope="col" className="pide-sutun-basligi">
              {metin(sutun.baslik, dil)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {urunler.map((urun) => (
          <tr key={urun.id}>
            <td className="pide-gorsel-hucre">
              <UrunGorseli urun={urun} dil={dil} kategoriSlug={kategori.slug} />
            </td>
            <th scope="row" className="pide-ad-hucre">
              <span className="urun-ad">{metin(urun.ad, dil)}</span>
              {icerikMetni(urun, dil) ? (
                <p className="urun-icerik">{icerikMetni(urun, dil)}</p>
              ) : null}
            </th>
            {kategori.sutunlar.map((sutun) => {
              const fiyat = urun.fiyatlar.find((f) => f.sutun === sutun.kod);
              const bos = !fiyat || fiyat.tutar === null;
              return (
                <td
                  key={sutun.kod}
                  className={`pide-hucre ${bos ? "pide-hucre-bos" : ""}`}
                  data-dogrulandi={fiyat?.dogrulandi ?? true}
                >
                  {fiyatYaz(fiyat?.tutar ?? null)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Kitabın tek bir yaprağı. */
function Yaprak({ sayfa, dil, tema }: MotifProps & { sayfa: MenuSayfasi; dil: DilKodu }) {
  const cokSutunlu = sayfa.kategori.sutunlar.length > 1;
  return (
    <section
      id={`s${sayfa.no}`}
      className="kitap-sayfa"
      aria-label={`${metin(sayfa.kategori.ad, dil)} — ${ui("sayfa", dil)} ${sayfa.no}`}
    >
      <div className="kitap-icerik">
        {/* Levha yalnızca çerçeve isteyen temada çizgiye dönüyor; diğerlerinde
            şeffaf bir sarmalayıcı olarak duruyor. */}
        <div className="levha">
          <div className="kitap-baslik-blok">
            <span className="hayalet-no" aria-hidden="true">
              {sayfa.no}
            </span>
            <h2 className="kitap-baslik">{metin(sayfa.kategori.ad, dil)}</h2>
            <BaslikAyraci tema={tema} />
          </div>

          {cokSutunlu ? (
            <CokFiyatliTablo sayfa={sayfa} dil={dil} />
          ) : (
            <ul className="urun-listesi mt-2 md:mt-6">
              {sayfa.urunler.map((urun) => (
                <TekFiyatliSatir
                  key={urun.id}
                  urun={urun}
                  dil={dil}
                  kategoriSlug={sayfa.kategori.slug}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export function MenuKitabiEkrani({
  dil,
  acilis,
  tema,
  yolOneki = "",
}: MotifProps & { dil: DilKodu; acilis: MenuSayfasi; yolOneki?: string }) {
  const sayfaListesi = SAYFALAR.map((s) => ({ slug: s.slug, no: s.no }));
  // Onizlemede `menu/<slug>` diye bir rota yok; dil degistirme baglantisi
  // oradaki tek menu ekranina gitmeli.
  const onizleme = yolOneki !== "";
  const dilYolu = onizleme ? `${yolOneki}/menu` : `/menu/${acilis.slug}`;

  return (
    <div className="kitap-cercevesi">
      <UstBaslik dil={dil} yol={dilYolu} sikisik tema={tema} yolOneki={yolOneki} />

      {/* Kitabın tamamı her rotada basılıyor; hangi sayfada açılacağını
          aşağıdaki senkron script belirliyor. Böylece beş sayfanın hepsi tek
          belgede geliyor ve müşteri kaydırarak menünün her yerine ulaşıyor —
          kategori değiştirmek için menüye dönmesi gerekmiyor. */}
      <div className="kitap-alani">
        <div id={KAP_ID} className="kitap" data-acilis={acilis.no}>
          {SAYFALAR.map((s) => (
            <Yaprak key={s.no} sayfa={s} dil={dil} tema={tema} />
          ))}
        </div>

        {/* Kenarlardaki sayfa çevirme okları. Kitabın kardeşi, çocuğu değil:
            kaydırma kabının içinde olsalardı sayfalarla birlikte kayarlardı. */}
        <SayfaOklari
          kabId={KAP_ID}
          sayfalar={sayfaListesi}
          dil={dil}
          baslangicNo={acilis.no}
        />
      </div>

      {/* TAM SAYFA YÜKLEMEDE ilk konumlandırma. HTML ayrıştırılırken, kap DOM'a
          girdikten hemen sonra çalışıyor; ekrana hiç yanlış sayfa düşmüyor.

          İSTEMCİ TARAFI gezinmede bu script çalışmaz — innerHTML ile DOM'a
          giren bir script'i tarayıcı çalıştırmaz. O yolu SayfaSayaci içindeki
          layout effect kapatıyor; ikisi aynı fark hesabını kullanıyor.

          Fark yöntemi yazma yönünden bağımsız: hedef ile kabın kutuları
          arasındaki mesafe RTL'de kendiliğinden negatif çıkıyor. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var k=document.getElementById(${JSON.stringify(KAP_ID)});if(!k)return;var h=document.getElementById("s"+k.getAttribute("data-acilis"));if(!h)return;k.scrollLeft+=h.getBoundingClientRect().left-k.getBoundingClientRect().left;})();`,
        }}
      />

      {/* Alt şerit: "Menüye dön", aşağı ok ipucu ve sayfa numarası.

          Aşağı ok şeridin ORTASINDA: içeriğin tamamen dışında kaldığı için
          hiçbir ürünü ya da fiyatı örtemiyor. Şeride dir verilmiyor:
          justify-between yazma yönünü kendisi izliyor. Yalnızca sayaç ltr —
          "3 / 5" bidi karışmasın diye. */}
      <div className="alt-serit">
        <Link href={`/${dil}${yolOneki}/menu`} className="alt-serit-baglanti odak">
          {ui("menuyeDon", dil)}
        </Link>

        <AsagiOk
          kabId={KAP_ID}
          sayfalar={sayfaListesi}
          dil={dil}
          baslangicNo={acilis.no}
        />

        <p className="sayfa-numarasi" dir="ltr">
          <span className="sr-only">{ui("sayfa", dil)} </span>
          <SayfaSayaci
            kabId={KAP_ID}
            sayfalar={sayfaListesi}
            dil={dil}
            baslangicNo={acilis.no}
            baslangicSlug={acilis.slug}
            yolOneki={yolOneki}
            adresiGuncelle={!onizleme}
          />
          {" / "}
          {SAYFALAR.length}
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   5 — Organizasyon
   ========================================================================= */
export function OrganizasyonEkrani({
  dil,
  tema,
  yolOneki = "",
}: MotifProps & { dil: DilKodu; yolOneki?: string }) {
  return (
    <div className="menu-sayfa">
      <UstBaslik dil={dil} yol={`${yolOneki}/organizasyon`} tema={tema} yolOneki={yolOneki} />

      <main className="sayfa-govdesi">
        <div className="sayfa-basligi">
          <h1 className="ekran-basligi">{ui("organizasyon", dil)}</h1>
          <BaslikAyraci tema={tema} />
        </div>

        <div className="hazirlaniyor">
          <SofraIkonu className="hazirlaniyor-ikon" />
          <p className="hazirlaniyor-metin">{ui("yakinda", dil)}</p>
        </div>

        <nav className="orta-baglanti">
          <Link href={`/${dil}${yolOneki}/secim`} className="alt-serit-baglanti odak">
            {ui("anaEkranaDon", dil)}
          </Link>
        </nav>
      </main>
    </div>
  );
}

/* =========================================================================
   6 — 404

   METİN UYDURULMADI: bu ekran için `data/arayuz.ts` içinde bir çeviri yok ve
   dört dile kendiliğinden metin eklenmedi. Dile bağlı olmayan bir kompozisyon
   kullanılıyor — büyük "404", temanın motifi ve mevcut "ana ekrana dön"
   bağlantısı. İşletmeden metin gelince buraya eklenir.
   ========================================================================= */
export function BulunamadiEkrani({
  dil,
  tema,
  yolOneki = "",
}: MotifProps & { dil: DilKodu; yolOneki?: string }) {
  return (
    <div className="menu-sayfa">
      <main className="sayfa-govdesi bulunamadi">
        <span className="bulunamadi-sayi" aria-hidden="true">
          404
        </span>
        <TemaMotifi className="bulunamadi-motif" tema={tema} />
        <nav className="orta-baglanti">
          <Link href={`/${dil}${yolOneki}/secim`} className="alt-serit-baglanti odak">
            {ui("anaEkranaDon", dil)}
          </Link>
        </nav>
      </main>
    </div>
  );
}
