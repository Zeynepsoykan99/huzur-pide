"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  FIYAT_PALETI,
  VURGU_PALETI,
  type RenkSecenegi,
  type TemaRenkSecimi,
} from "@/data/renkler";
import { TEMA_ADI, type SecilebilirTema } from "@/data/tema";
import { renkleriDegistir, temayiDegistir } from "../eylemler";
import { TemaSecici } from "./TemaSecici";
import { RenkSecici } from "./RenkSecici";

/**
 * "Menü görünümü" ekranının tamamı: tema seçimi, renk seçimi ve önizleme.
 *
 * NEDEN TEK BİLEŞEN: önizleme tema İLE rengin birleşimini gösteriyor. İkisi
 * ayrı bileşenlerde kendi durumlarını tutsaydı, tema kartına basıldığında
 * önizleme rengi ancak sunucudan dönen yeni veriyle öğrenirdi — yani bir
 * gidiş dönüş kadar gecikirdi. Durum burada birleşince tıklama ile önizleme
 * arasında hiçbir bekleme kalmıyor.
 *
 * KAYDETME MANTIĞI DEĞİŞMEDİ: seçim yapılır yapılmaz `temayiDegistir` /
 * `renkleriDegistir` çağrılıyor, onlar da Firestore'a yazıp
 * `revalidatePath` diyor. Önizleme bunu BEKLEMİYOR; React durumundan
 * besleniyor, o yüzden anlık. Sunucu isteği arka planda sürüyor.
 *
 * Renk seçimleri temaya göre saklandığı için hepsi sunucudan geliyor
 * (`tumRenkSecimleri`): tema değiştirildiğinde yeni temanın kayıtlı
 * renkleri sunucuya gidilmeden gösterilebiliyor.
 */

export type Onizleme = {
  /** `tema-*` + o temanın yazı tipi sınıfları. Sunucuda hesaplanıyor. */
  sinif: string;
  /** Gerçek menü yaprağı — sunucuda basılmış hazır düğüm. */
  dugum: ReactNode;
};

export function GorunumSecici({
  baslangicTema,
  baslangicSecimler,
  onizlemeler,
}: {
  baslangicTema: SecilebilirTema;
  baslangicSecimler: Record<string, TemaRenkSecimi>;
  onizlemeler: Record<SecilebilirTema, Onizleme>;
}) {
  const [tema, setTema] = useState<SecilebilirTema>(baslangicTema);
  const [secimler, setSecimler] =
    useState<Record<string, TemaRenkSecimi>>(baslangicSecimler);
  const [bildirim, setBildirim] = useState<
    { tur: "basari" | "hata"; metin: string } | null
  >(null);
  const [bekliyor, basla] = useTransition();

  const vurguListesi = VURGU_PALETI[tema];
  const fiyatListesi = FIYAT_PALETI[tema];

  // Kayıtlı seçim yoksa ya da tanınmıyorsa listenin ilki — yani temanın
  // varsayılanı. Sunucudaki `renkleriCoz` de aynı kuralı uyguluyor.
  const vurgu =
    vurguListesi.find((r) => r.kod === secimler[tema]?.vurgu) ?? vurguListesi[0];
  const fiyat =
    fiyatListesi.find((r) => r.kod === secimler[tema]?.fiyat) ?? fiyatListesi[0];

  function temaSec(yeni: SecilebilirTema) {
    if (yeni === tema || bekliyor) return;
    const onceki = tema;
    setTema(yeni);
    setBildirim(null);
    basla(async () => {
      const sonuc = await temayiDegistir(yeni);
      if (sonuc.ok) {
        setBildirim({
          tur: "basari",
          metin: `Menü görünümü "${TEMA_ADI[yeni]}" olarak değiştirildi.`,
        });
      } else {
        // Kaydedilemediyse ekrandaki seçim de geri alınıyor; yoksa panel
        // menüde olmayan bir görünümü seçiliymiş gibi gösterirdi.
        setTema(onceki);
        setBildirim({ tur: "hata", metin: sonuc.hata });
      }
    });
  }

  function renkSec(hangi: "vurgu" | "fiyat", renk: RenkSecenegi) {
    if (bekliyor) return;
    const yeniVurgu = hangi === "vurgu" ? renk.kod : vurgu.kod;
    const yeniFiyat = hangi === "fiyat" ? renk.kod : fiyat.kod;
    if (yeniVurgu === vurgu.kod && yeniFiyat === fiyat.kod) return;

    const oncekiSecimler = secimler;
    setSecimler({ ...secimler, [tema]: { vurgu: yeniVurgu, fiyat: yeniFiyat } });
    setBildirim(null);

    basla(async () => {
      const sonuc = await renkleriDegistir(tema, {
        vurgu: yeniVurgu,
        fiyat: yeniFiyat,
      });
      if (sonuc.ok) {
        setBildirim({ tur: "basari", metin: "Renk değiştirildi." });
      } else {
        setSecimler(oncekiSecimler);
        setBildirim({ tur: "hata", metin: sonuc.hata });
      }
    });
  }

  const onizleme = onizlemeler[tema];

  return (
    <>
      {bildirim ? (
        <p className={`panel-bildirim panel-bildirim-${bildirim.tur}`}>
          {bildirim.metin}
        </p>
      ) : null}

      <TemaSecici secili={tema} bekliyor={bekliyor} onSec={temaSec} />

      <RenkSecici
        vurguListesi={vurguListesi}
        fiyatListesi={fiyatListesi}
        vurgu={vurgu}
        fiyat={fiyat}
        bekliyor={bekliyor}
        onSec={renkSec}
      />

      {/*
        ÖNİZLEME.

        Tema sınıfı ve renkler burada, İÇ İÇE BİR SARMALAYICIDA duruyor —
        `<body class="panel">` üzerinde değil. Panel kendi `--p-*`
        değişkenleriyle kalıyor, `--t-*` yalnızca bu kutunun içinde geçerli.
        `temalar.css` tam da bunun için torun seçici kullanmaktan kaçınıyor.

        Sınıf, temanın YAZI TİPLERİNİ de taşıyor: fontların hepsinde
        `preload: false` olduğu için yalnızca gösterilen temanınkiler,
        yalnızca gösterildiğinde iniyor.

        Renkler satır içi stille: canlı menüdeki düzeneğin aynısı
        (bkz. `app/[dil]/layout.tsx`), yani buradaki renk menüdekiyle aynı.
      */}
      <section className="panel-onizleme-bolum">
        <h2 className="panel-kart-baslik">Menüde böyle görünecek</h2>
        <p className="panel-aciklama">
          Müşterinin telefonunda göreceği hâli. Seçim yaptığınız anda değişir.
        </p>

        <div className="panel-telefon">
          <div
            className={`panel-telefon-ekran ${onizleme.sinif}`}
            style={
              {
                "--t-vurgu": vurgu.hex,
                "--t-fiyat": fiyat.hex,
              } as React.CSSProperties
            }
            /* Önizleme dekoratif bir kopya: gerçek menü zaten müşteriye
               sunuluyor, ekran okuyucunun burayı ikinci kez okumasına gerek
               yok. Seçimin kendisi düğmelerden zaten duyuruluyor. */
            aria-hidden="true"
          >
            {onizleme.dugum}
          </div>
        </div>
      </section>

      <p className="panel-not">
        Menünün tamamını görmek için{" "}
        <a href="/tr/menu" target="_blank" rel="noreferrer">
          müşteri menüsünü yeni sekmede açın
        </a>
        .
      </p>
    </>
  );
}
