"use client";

import type { RenkSecenegi } from "@/data/renkler";

/**
 * Tema içindeki renk seçimi — SUNUM bileşeni.
 *
 * Durum ve kaydetme `GorunumSecici`da; burada yalnızca kutular çiziliyor.
 *
 * HAZIR PALET, RENK SEÇİCİ DEĞİL. Buradaki renklerin hepsi
 * `betikler/renk-kontrast.ts` ile ölçüldü; listeye yalnızca WCAG AA'yı geçen
 * renk giriyor. Yani mekân sahibi ne seçerse seçsin menü okunaklı kalıyor —
 * ekranda uyarı, hata durumu ya da "bu renk olmaz" cevabı yok.
 *
 * Seçili olan kalın çerçeveyle işaretli, yalnızca renkle değil: renk
 * körlüğünde ayırt edilebilsin diye.
 */
export function RenkSecici({
  vurguListesi,
  fiyatListesi,
  vurgu,
  fiyat,
  bekliyor,
  onSec,
}: {
  vurguListesi: RenkSecenegi[];
  fiyatListesi: RenkSecenegi[];
  vurgu: RenkSecenegi;
  fiyat: RenkSecenegi;
  bekliyor: boolean;
  onSec: (hangi: "vurgu" | "fiyat", renk: RenkSecenegi) => void;
}) {
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
                onClick={() => onSec(hangi, renk)}
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

      {sira("Vurgu rengi", vurguListesi, vurgu, "vurgu")}
      {sira("Fiyat rengi", fiyatListesi, fiyat, "fiyat")}
    </section>
  );
}
