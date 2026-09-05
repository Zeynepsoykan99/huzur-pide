import Image from "next/image";
import Link from "next/link";
import { AsagiOk } from "@/components/AsagiOk";
import {
  InstagramIkonu,
  KonumIkonu,
  PideIkonu,
  SaatIkonu,
  TelefonIkonu,
} from "@/components/Ikonlar";
import { SayfaOklari } from "@/components/SayfaOklari";
import { SayfaSayaci } from "@/components/SayfaSayaci";
import { TemaMotifi } from "@/components/TemaMotifi";
import { UrunGorseli } from "@/components/UrunGorseli";
import { UstBaslik } from "@/components/UstBaslik";
import { ui } from "@/data/arayuz";
import {
  GORSEL_ALT,
  ILETISIM,
  LEZZETLER_METNI,
  MEKAN_GORSELLERI,
  ORGANIZASYON_METNI,
} from "@/data/karsilama";
import {
  DILLER,
  DIL_ADI,
  DIL_BAYRAGI,
  fiyatYaz,
  icerikMetni,
  metin,
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
 * parametreyle alıyor.
 *
 * MENÜ İÇERİĞİNİ DE BİLMİYOR: sayfalar dışarıdan `sayfalar` propuyla geliyor.
 * İçerik Firestore'da (bkz. `data/menuKaynak.ts`); ekranlar onu nereden
 * geldiğini bilmeden basıyor. Böylece hem üretim rotaları hem önizleme rotası
 * aynı bileşenleri kullanabiliyor.
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
   1 — Karşılama. QR okutulunca gelen İLK ekran.

   Akıştaki yeri: QR → BURASI → "Menü" butonu → menü kitabı.

   Ayrı bir dil seçim ekranı YOK: dil, sayfanın en üstündeki bayrak
   şeridinden seçiliyor. Sayfanın dört dilde ayrı kopyası var (`/tr`, `/en`,
   `/ar`, `/ru`) ve QR kökü `/tr`'ye bakıyor — Türkçe bilmeyen müşteri tek
   dokunuşla kendi diline geçiyor, sayfanın tamamını okumak zorunda
   kalmıyor. Menüye girdikten sonra dil değiştirmek için üst şeritteki
   `DilKontrolu` var; o, bulunulan sayfayı koruyarak dil değiştiriyor.

   Görseller tam genişlik arka plan; yazılar üstlerinde, karartma perdesinin
   üzerinde duruyor. Perde dekoratif değil, KONTRAST İÇİN: ölçüldü, gövde
   metni 4,5:1'i, iri başlıklar 3:1'i geçiyor (bkz. `.kars-perde`).
   ========================================================================= */

/**
 * Görsel + karartma perdesi + üstünde içerik — üç bölümde de aynı iskelet.
 *
 * BLOĞUN YÜKSEKLİĞİ SABİT DEĞİL, görselin kendi oranından geliyor: en/boy
 * `--kars-oran` olarak CSS'e veriliyor, görünmez `.kars-oran` parçası da onu
 * `aspect-ratio` yapıyor. Kutunun oranı görselin oranına eşitlendiği için
 * `object-fit: cover` hiçbir şeyi kırpmıyor.
 *
 * Oran bir TABAN: metin sığmazsa blok uzuyor, yazı kesilmiyor (bkz.
 * `.kars-blok`). Dar telefonda Rusça metinle bu gerçekten oluyor.
 *
 * Önceden bloklarda sabit yükseklik vardı (`min-height: 17rem`, masaüstünde
 * `22rem`) ve genişlik ekranla büyüyordu; masaüstünde kutu 1265×352, yani
 * 3,59 oranına ulaşıp görselin %50-65'ini kesiyordu.
 */
function GorselliBolum({
  gorsel,
  alt,
  oncelikli = false,
  children,
  sinif = "",
}: {
  gorsel: { src: string; genislik: number; yukseklik: number };
  alt: string;
  /** Hero'da true: LCP görseli, tembel yüklenmemeli. */
  oncelikli?: boolean;
  children: React.ReactNode;
  sinif?: string;
}) {
  return (
    <div
      className={`kars-blok ${sinif}`}
      style={
        { "--kars-oran": `${gorsel.genislik} / ${gorsel.yukseklik}` } as React.CSSProperties
      }
    >
      <Image
        src={gorsel.src}
        alt={alt}
        width={gorsel.genislik}
        height={gorsel.yukseklik}
        /* Masaustunde blok tam genislik degil, 44rem'lik sutunda duruyor
           (bkz. `.kars-blok` medya sorgusu). `100vw` birakilsaydi 1280px'lik
           ekranda 704px'lik yuvaya 1280'lik dosya indirilirdi. */
        sizes="(min-width: 48rem) 44rem, 100vw"
        priority={oncelikli}
        className="kars-gorsel"
      />
      {/* Boş ve görünmez: bloğun yüksekliğine görselin oranından gelen
          TABANI koyuyor. Metinle aynı grid hücresinde durduğu için satır
          ikisinin büyüğü kadar oluyor — metin sığdıkça kırpma sıfır,
          sığmadığında blok uzuyor ve yazı kesilmiyor. */}
      <div className="kars-oran" aria-hidden="true" />
      <div className="kars-perde" aria-hidden="true" />
      <div className="kars-icerik">{children}</div>
    </div>
  );
}

export function KarsilamaEkrani({ dil, tema }: MotifProps & { dil: DilKodu }) {
  /**
   * Buton DOGRUDAN menuye gidiyor, araya dil secim ekrani girmiyor.
   *
   * Dil secimi iki yerde tekrarlaniyordu: ustteki bayrak seridinde bir kez,
   * butondan sonraki ekranda bir kez daha. Ikincisi kaldirildi — sayfanin
   * dili zaten secilmis durumda, bu yuzden buton bulunulan dilin menusune
   * gidiyor. Menu icinde dil degistirmek isteyen icin ust seritteki
   * `DilKontrolu` var ve o, bulunulan sayfayi koruyor.
   */
  const menuYolu = `/${dil}/menu`;

  return (
    <div className="karsilama">
      {/* Dil şeridi: sayfanın EN üstünde, marka adından da önce. Türkçe
          bilmeyen müşterinin ilk gördüğü şey kendi bayrağı olsun diye. */}
      <nav className="kars-bayraklar" aria-label={ui("dilDegistir", dil)}>
        {DILLER.map((hedef) => (
          <Link
            key={hedef}
            href={`/${hedef}`}
            hrefLang={hedef}
            lang={hedef}
            aria-current={hedef === dil ? "true" : undefined}
            className="kars-bayrak odak"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/flags/${DIL_BAYRAGI[hedef].kod}.svg`}
              alt=""
              aria-hidden="true"
              className="kars-bayrak-simge"
            />
            <span className="kars-bayrak-ad">{DIL_ADI[hedef]}</span>
          </Link>
        ))}
      </nav>

      <GorselliBolum
        gorsel={MEKAN_GORSELLERI.dukkan}
        alt={metin(GORSEL_ALT.dukkan, dil)}
        oncelikli
        sinif="kars-hero"
      >
        {/* Marka adı EKRANDA YOK, belgede var.
            Fotoğrafın kendi tabelasında zaten büyük harflerle "HUZUR PİDE"
            yazıyor; üstüne bir de başlık binince ikisi çakışıyordu. Yazı
            kaldırıldı ama `h1` duruyor: kaldırılsaydı sayfa `h2` ile
            başlardı, yani başlık hiyerarşisi kırılırdı ve sayfanın adı ne
            ekran okuyucuya ne arama motoruna kalırdı. Görünen marka için
            sayfa sonundaki alt bilgi ve sekme adı var. */}
        <h1 className="kars-marka-gizli">Huzur Pide</h1>
        <p className="kars-slogan">{ui("slogan", dil)}</p>

        {/* Menü butonu ilk ekranda, kaydırmadan görünüyor: QR menüde asıl
            iş bu, müşteri aramak zorunda kalmamalı. */}
        <Link href={menuYolu} className="kars-menu-dugmesi odak">
          <PideIkonu className="kars-menu-ikon" />
          <span>{ui("menu", dil)}</span>
          <Ok />
        </Link>
      </GorselliBolum>

      <main>
        <GorselliBolum
          gorsel={MEKAN_GORSELLERI.firin}
          alt={metin(GORSEL_ALT.firin, dil)}
        >
          <h2 className="kars-baslik">{ui("lezzetler", dil)}</h2>
          <BaslikAyraci tema={tema} sinif="kars-ayrac" />
          <p className="kars-metin">{metin(LEZZETLER_METNI, dil)}</p>
        </GorselliBolum>

        <GorselliBolum
          gorsel={MEKAN_GORSELLERI.disGorunum}
          alt={metin(GORSEL_ALT.disGorunum, dil)}
        >
          <h2 className="kars-baslik">{ui("organizasyon", dil)}</h2>
          <BaslikAyraci tema={tema} sinif="kars-ayrac" />
          <p className="kars-metin">{metin(ORGANIZASYON_METNI, dil)}</p>
        </GorselliBolum>

        {/* İletişim görselsiz: telefon ve adres okunması gereken bilgi,
            arka plan üstünde değil düz zeminde duruyor. */}
        <section className="kars-iletisim">
          <h2 className="kars-baslik kars-baslik-koyu">{ui("iletisim", dil)}</h2>
          <BaslikAyraci tema={tema} sinif="kars-ayrac" />

          <ul className="kars-iletisim-listesi">
            <li>
              <a href={ILETISIM.telefonBaglanti} className="kars-satir odak">
                <TelefonIkonu className="kars-satir-ikon" />
                <span className="kars-satir-govde">
                  <span className="kars-satir-etiket">{ui("telefon", dil)}</span>
                  {/* Numara her dilde aynı ve LTR: Arapça sayfada da soldan
                      sağa okunmalı, yoksa parantez ve rakamlar yer değiştirir. */}
                  <bdi className="kars-satir-deger" dir="ltr">
                    {ILETISIM.telefon}
                  </bdi>
                </span>
              </a>
            </li>

            <li>
              <a
                href={ILETISIM.instagramAdres}
                target="_blank"
                rel="noopener noreferrer"
                className="kars-satir odak"
              >
                <InstagramIkonu className="kars-satir-ikon" />
                <span className="kars-satir-govde">
                  <span className="kars-satir-etiket">Instagram</span>
                  <bdi className="kars-satir-deger" dir="ltr">
                    @{ILETISIM.instagramKullanici}
                  </bdi>
                </span>
              </a>
            </li>

            <li>
              <a
                href={ILETISIM.haritaAdresi}
                target="_blank"
                rel="noopener noreferrer"
                className="kars-satir odak"
              >
                <KonumIkonu className="kars-satir-ikon" />
                <span className="kars-satir-govde">
                  <span className="kars-satir-etiket">{ui("adres", dil)}</span>
                  <span className="kars-satir-deger">{ILETISIM.adres}</span>
                  <span className="kars-satir-ek">{ui("yolTarifi", dil)}</span>
                </span>
              </a>
            </li>

            {/* Tıklanacak bir şey yok: bağlantı değil, düz satır. */}
            <li className="kars-satir kars-satir-dural">
              <SaatIkonu className="kars-satir-ikon" />
              <span className="kars-satir-govde">
                <span className="kars-satir-etiket">{ui("calismaSaatleri", dil)}</span>
                <span className="kars-satir-deger">
                  {ui("herGun", dil)}{" "}
                  <bdi dir="ltr">{ILETISIM.saatler}</bdi>
                </span>
              </span>
            </li>
          </ul>

          {/* Sayfa uzun; sonuna kadar okuyan müşteri yukarı dönmek zorunda
              kalmasın diye menü butonu burada tekrarlanıyor. */}
          <Link href={menuYolu} className="kars-menu-dugmesi kars-menu-alt odak">
            <PideIkonu className="kars-menu-ikon" />
            <span>{ui("menu", dil)}</span>
            <Ok />
          </Link>
        </section>
      </main>

      <footer className="kars-dipnot">
        <p>Huzur Pide · {ui("dijitalMenu", dil)}</p>
      </footer>
    </div>
  );
}

/* =========================================================================
   2 — Kategori listesi ("içindekiler")
   ========================================================================= */
export function KategoriListesiEkrani({
  dil,
  sayfalar,
  tema,
  yolOneki = "",
}: MotifProps & { dil: DilKodu; sayfalar: MenuSayfasi[]; yolOneki?: string }) {
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
            {sayfalar.map((sayfa) => (
              <li key={sayfa.slug}>
                {/* Her kategori tek sayfa: slug'ı kategori slug'ının aynısı. */}
                <Link
                  href={
                    onizleme
                      ? `/${dil}${yolOneki}/menu`
                      : `/${dil}/menu/${sayfa.slug}`
                  }
                  className="icindekiler-satir odak"
                >
                  <span className="icindekiler-no" aria-hidden="true">
                    {String(sayfa.no).padStart(2, "0")}
                  </span>
                  <span className="icindekiler-ad">
                    {metin(sayfa.kategori.ad, dil)}
                  </span>
                  <span className="nokta" aria-hidden="true" />
                  <span className="icindekiler-sayfa">
                    <span className="sr-only">{ui("sayfa", dil)} </span>
                    {sayfa.no}
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
   3 — Menü kitabı
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
 *
 * ÜRÜN ADI KENDİ SATIRINDA, FİYATLAR ALTINDA.
 *
 * Ad, fiyat sütunlarıyla yan yana dursaydı dar telefonda ona kalan yer
 * ölçüldü: 320px'te 78-101px. Uzun çeviriler o genişlikte parçalanıyordu —
 * İngilizce ve Rusça "Lahmacun (…)" YEDİ satıra bölünüyordu. Ad kendi
 * satırına alınınca aynı ekranda 192px'e çıkıyor ve en fazla iki satır
 * kalıyor; kazanılan yerin bir kısmı da görsele gitti (3,5rem -> 5rem).
 *
 * YAPI: her ürün kendi `<tbody>`'sinde iki satır. Görsel `rowSpan={2}` ile
 * ikisini birden kaplıyor, ad `colSpan` ile fiyat sütunlarının üstünü.
 * Sütun hizası bozulmuyor — ölçüldü, başlıklarla fiyat hücrelerinin
 * merkezleri arasındaki sapma 0px.
 *
 * Ad artık `scope="row"` DEĞİL `scope="rowgroup"`: kendi satırına taşındığı
 * için tek bir satırı değil, ürünün iki satırlık grubunu etiketliyor. Grubun
 * sınırını da `<tbody>` çiziyor, bu yüzden her ürün ayrı bir gövde.
 */
function CokFiyatliTablo({ sayfa, dil }: { sayfa: MenuSayfasi; dil: DilKodu }) {
  const { kategori, urunler } = sayfa;
  return (
    <table className="pide-tablo mt-2 md:mt-6">
      <caption className="sr-only">
        {metin(kategori.ad, dil)} — {ui("hamurBoyunaGoreFiyatlar", dil)}
      </caption>
      {/* Görsel sütununun genişliğini `.pide-gorsel-hucre` veriyor; burada
          sınıf yok. Eskiden `md:w-52` vardı ve masaüstünde sütunu 208px'e
          çıkarıyordu — görselin kendisi 56px olduğu için aradaki 128px boş
          duruyordu. Ad artık o sütunun yanında değil altında olduğundan o
          boşluk adı sağa itmiş olurdu. */}
      <colgroup>
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
          {kategori.sutunlar.map((sutun) => (
            <th key={sutun.kod} scope="col" className="pide-sutun-basligi">
              {metin(sutun.baslik, dil)}
            </th>
          ))}
        </tr>
      </thead>
      {urunler.map((urun) => (
        <tbody key={urun.id} className="pide-urun">
          <tr>
            <td className="pide-gorsel-hucre" rowSpan={2}>
              <UrunGorseli urun={urun} dil={dil} kategoriSlug={kategori.slug} />
            </td>
            <th
              scope="rowgroup"
              className="pide-ad-hucre"
              colSpan={kategori.sutunlar.length}
            >
              <span className="urun-ad">{metin(urun.ad, dil)}</span>
              {icerikMetni(urun, dil) ? (
                <p className="urun-icerik">{icerikMetni(urun, dil)}</p>
              ) : null}
            </th>
          </tr>
          <tr>
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
        </tbody>
      ))}
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
  sayfalar,
  acilis,
  tema,
  yolOneki = "",
}: MotifProps & {
  dil: DilKodu;
  sayfalar: MenuSayfasi[];
  acilis: MenuSayfasi;
  yolOneki?: string;
}) {
  const sayfaListesi = sayfalar.map((s) => ({ slug: s.slug, no: s.no }));
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
          {sayfalar.map((s) => (
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
          {sayfalar.length}
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   4 — 404

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
          <Link href={`/${dil}${yolOneki}`} className="alt-serit-baglanti odak">
            {ui("anaEkranaDon", dil)}
          </Link>
        </nav>
      </main>
    </div>
  );
}
