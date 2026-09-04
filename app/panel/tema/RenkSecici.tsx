"use client";

import { useState, useTransition } from "react";
import { TemaMotifi } from "@/components/TemaMotifi";
import {
  FIYAT_PALETI,
  VURGU_PALETI,
  type RenkSecenegi,
  type TemaRenkSecimi,
} from "@/data/renkler";
import type { SecilebilirTema } from "@/data/tema";
import { renkleriDegistir } from "../eylemler";

/**
 * Tema içindeki renk seçimi.
 *
 * HAZIR PALET, RENK SEÇİCİ DEĞİL. Buradaki renklerin hepsi
 * `betikler/renk-kontrast.ts` ile ölçüldü; listeye yalnızca WCAG AA'yı geçen
 * renk giriyor. Yani mekân sahibi ne seçerse seçsin menü okunaklı kalıyor —
 * ekranda uyarı, hata durumu ya da "bu renk olmaz" cevabı yok. Serbest bir
 * renk seçicide bunların hepsi olurdu.
 *
 * ÖNİZLEME GERÇEK ÜRÜNLE. Örnek metin uydurulmuyor, menüdeki ilk ürünün adı
 * ve fiyatı sunucudan geliyor: sahibi kendi menüsünü görüyor.
 *
 * Önizleme kutusu `tema-*` sınıfıyla sarılı ve renkleri satır içi stille
 * alıyor — canlı menüdeki düzeneğin birebir aynısı (bkz. `app/[dil]/layout.tsx`).
 * Bu yüzden panelde görünen renk, menüde görünecek renkle aynı; iki ayrı
 * yerde tekrar tanımlanmıyor, ikisi de `data/renkler.ts`ten besleniyor.
 *
 * Yazı tipleri önizlemede temanın değil panelin: tema fontları yalnızca
 * müşteri tarafındaki `<html>` üzerinde tanımlı. Burada mesele renk, ve
 * yarım yüklenmiş bir yazı tipi yanıltıcı olurdu.
 */

export type OrnekUrun = { ad: string; fiyat: string };

export function RenkSecici({
  tema,
  baslangic,
  ornek,
}: {
  tema: SecilebilirTema;
  baslangic: TemaRenkSecimi;
  ornek: OrnekUrun | null;
}) {
  const vurguListesi = VURGU_PALETI[tema];
  const fiyatListesi = FIYAT_PALETI[tema];

  // Kayıtlı seçim yoksa ya da tanınmıyorsa: listenin ilki, yani temanın
  // varsayılanı. `renkleriCoz` sunucuda da aynı kuralı uyguluyor.
  const [vurgu, setVurgu] = useState(
    () => vurguListesi.find((r) => r.kod === baslangic.vurgu) ?? vurguListesi[0],
  );
  const [fiyat, setFiyat] = useState(
    () => fiyatListesi.find((r) => r.kod === baslangic.fiyat) ?? fiyatListesi[0],
  );
  const [bildirim, setBildirim] = useState<
    { tur: "basari" | "hata"; metin: string } | null
  >(null);
  const [bekliyor, basla] = useTransition();

  function sec(hangi: "vurgu" | "fiyat", renk: RenkSecenegi) {
    if (bekliyor) return;
    const oncekiVurgu = vurgu;
    const oncekiFiyat = fiyat;
    const yeniVurgu = hangi === "vurgu" ? renk : vurgu;
    const yeniFiyat = hangi === "fiyat" ? renk : fiyat;
    if (yeniVurgu.kod === vurgu.kod && yeniFiyat.kod === fiyat.kod) return;

    setVurgu(yeniVurgu);
    setFiyat(yeniFiyat);
    setBildirim(null);

    basla(async () => {
      const sonuc = await renkleriDegistir(tema, {
        vurgu: yeniVurgu.kod,
        fiyat: yeniFiyat.kod,
      });
      if (sonuc.ok) {
        setBildirim({ tur: "basari", metin: "Renk değiştirildi." });
      } else {
        // Kaydedilemediyse ekrandaki seçim de geri alınıyor; yoksa panel
        // menüde olmayan bir rengi seçiliymiş gibi gösterirdi.
        setVurgu(oncekiVurgu);
        setFiyat(oncekiFiyat);
        setBildirim({ tur: "hata", metin: sonuc.hata });
      }
    });
  }

  function sira(
    baslik: string,
    liste: RenkSecenegi[],
    secili: RenkSecenegi,
    hangi: "vurgu" | "fiyat",
  ) {
    return (
      <div className="panel-renk-grup">
        <span className="panel-renk-baslik" id={`renk-${hangi}`}>
          {baslik}
        </span>
        <ul className="panel-renk-listesi" aria-labelledby={`renk-${hangi}`}>
          {liste.map((renk) => (
            <li key={renk.kod}>
              <button
                type="button"
                className="panel-renk-dugmesi"
                aria-pressed={secili.kod === renk.kod}
                disabled={bekliyor}
                onClick={() => sec(hangi, renk)}
              >
                <span
                  className="panel-renk-kutusu"
                  style={{ background: renk.hex }}
                  aria-hidden="true"
                />
                <span className="panel-renk-ad">{renk.ad}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section className="panel-renkler">
      <h2 className="panel-kart-baslik">Renkler</h2>
      <p className="panel-aciklama">
        Seçtiğiniz renk menüye hemen yansır. Buradaki renklerin hepsi okunaklı
        olacak şekilde seçildi; hangisini seçerseniz seçin menü okunur kalır.
      </p>

      {bildirim ? (
        <p className={`panel-bildirim panel-bildirim-${bildirim.tur}`}>
          {bildirim.metin}
        </p>
      ) : null}

      {sira("Vurgu rengi", vurguListesi, vurgu, "vurgu")}
      {sira("Fiyat rengi", fiyatListesi, fiyat, "fiyat")}

      <div className="panel-renk-onizleme-sarmal">
        <span className="panel-renk-baslik">Menüde böyle görünecek</span>
        <div
          className={`panel-onizleme tema-${tema}`}
          style={
            {
              "--t-vurgu": vurgu.hex,
              "--t-fiyat": fiyat.hex,
            } as React.CSSProperties
          }
        >
          <div className="panel-onizleme-levha">
            <TemaMotifi className="panel-onizleme-motif" tema={tema} />
            <span className="panel-onizleme-ad">{ornek?.ad ?? "Ürün adı"}</span>
            <span className="panel-onizleme-fiyat">{ornek?.fiyat ?? "—"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
