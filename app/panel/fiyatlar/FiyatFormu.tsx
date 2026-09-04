"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { fiyatlariKaydet, urunSil, type FiyatDegisikligi } from "../eylemler";

/**
 * Fiyat düzenleme formu.
 *
 * KAYDETMEDEN ÖNCE ÖZET: "Kaydet"e basınca doğrudan yazmıyor, önce ne
 * değiştiğini gösteriyor. Fark üç kattan fazlaysa ya da bir fiyat sıfıra
 * düşüyorsa ayrıca kırmızı uyarı çıkıyor — fazladan yazılan bir sıfır
 * (200 → 2000) tam da orada yakalanıyor.
 *
 * Boş bırakılan kutu "bu üründe bu fiyat yok" demek (menüde "—" görünüyor);
 * sıfır yazmak ise "sıfır lira" demek. İkisi ayrı tutuluyor.
 */

export type FiyatHucresi = {
  sutun: string;
  sutunAdi: string;
  tutar: number | null;
  dogrulandi: boolean;
};

export type FiyatSatiri = {
  urunId: string;
  kategoriAdi: string;
  urunAdi: string;
  fiyatlar: FiyatHucresi[];
};

/** Kutudaki metni tutara çevirir. Boş -> null (fiyat yok). */
function tutaraCevir(metin: string): number | null | "gecersiz" {
  const t = metin.trim();
  if (t === "") return null;
  const n = Number(t.replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return "gecersiz";
  return Math.round(n);
}

function yaz(tutar: number | null): string {
  return tutar === null ? "—" : `${tutar.toLocaleString("tr-TR")} ₺`;
}

/** Büyük değişim: üç kattan fazla fark ya da sıfıra düşme. */
function buyukDegisim(eski: number | null, yeni: number | null): boolean {
  if (yeni === 0 && eski !== 0) return true;
  if (eski === null || yeni === null) return true;
  if (eski === 0) return yeni !== 0;
  const oran = yeni / eski;
  return oran > 3 || oran < 1 / 3;
}

/** Kategori adindan baglanti hedefi — Turkce harfler id'de sorun cikarmasin. */
function bolumKimligi(ad: string): string {
  const harita: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return (
    "bolum-" +
    ad
      .split("")
      .map((h) => harita[h] ?? h)
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

export function FiyatFormu({ satirlar }: { satirlar: FiyatSatiri[] }) {
  const router = useRouter();
  /** anahtar: `${urunId}|${sutun}` -> kutudaki metin */
  const baslangic = useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of satirlar) {
      for (const f of s.fiyatlar) {
        m[`${s.urunId}|${f.sutun}`] = f.tutar === null ? "" : String(f.tutar);
      }
    }
    return m;
  }, [satirlar]);

  const [degerler, setDegerler] = useState<Record<string, string>>(baslangic);
  const [ozetAcik, setOzetAcik] = useState(false);
  /** Silinmek uzere onay bekleyen urun. `null` = onay kutusu kapali. */
  const [silinecek, setSilinecek] = useState<FiyatSatiri | null>(null);
  const [bildirim, setBildirim] = useState<
    { tur: "basari" | "hata"; metin: string } | null
  >(null);
  const [bekliyor, basla] = useTransition();

  /** Değişen hücreler — özet ve kaydetme bunun üzerinden. */
  const degisiklikler = useMemo(() => {
    const liste: {
      urunId: string;
      urunAdi: string;
      sutunAdi: string;
      sutun: string;
      eski: number | null;
      yeni: number | null;
      gecersiz: boolean;
    }[] = [];

    for (const s of satirlar) {
      for (const f of s.fiyatlar) {
        const anahtar = `${s.urunId}|${f.sutun}`;
        const ham = degerler[anahtar] ?? "";
        if (ham === (f.tutar === null ? "" : String(f.tutar))) continue;
        const cozulen = tutaraCevir(ham);
        liste.push({
          urunId: s.urunId,
          urunAdi: s.urunAdi,
          sutunAdi: f.sutunAdi,
          sutun: f.sutun,
          eski: f.tutar,
          yeni: cozulen === "gecersiz" ? null : cozulen,
          gecersiz: cozulen === "gecersiz",
        });
      }
    }
    return liste;
  }, [degerler, satirlar]);

  const gecersizler = degisiklikler.filter((d) => d.gecersiz);
  const buyukler = degisiklikler.filter(
    (d) => !d.gecersiz && buyukDegisim(d.eski, d.yeni),
  );

  function kaydet() {
    const yuk: FiyatDegisikligi[] = degisiklikler
      .filter((d) => !d.gecersiz)
      .map((d) => ({ urunId: d.urunId, sutun: d.sutun, yeniTutar: d.yeni }));

    basla(async () => {
      const sonuc = await fiyatlariKaydet(yuk);
      setOzetAcik(false);
      setBildirim(
        sonuc.ok
          ? { tur: "basari", metin: sonuc.mesaj }
          : { tur: "hata", metin: sonuc.hata },
      );
      if (sonuc.ok) {
        // Kaydedilen degerler artik "mevcut" sayilsin.
        window.scrollTo({ top: 0 });
        setTimeout(() => window.location.reload(), 800);
      }
    });
  }

  /**
   * Ürünü siler.
   *
   * ONAY ZORUNLU ve onay kutusunda ürünün ADI yazıyor: silme geri alınamıyor,
   * bu yüzden tek dokunuşla olmuyor. Silme düğmesi de fiyat kutularından
   * uzakta, satırın en sağında duruyor.
   */
  function sil(satir: FiyatSatiri) {
    basla(async () => {
      const sonuc = await urunSil(satir.urunId);
      setSilinecek(null);
      setBildirim(
        sonuc.ok
          ? { tur: "basari", metin: `"${satir.urunAdi}" silindi.` }
          : { tur: "hata", metin: sonuc.hata },
      );
      if (sonuc.ok) router.refresh();
    });
  }

  // Kategoriye göre grupla — mekân sahibi menüdeki sırayla görsün.
  const gruplar = useMemo(() => {
    const g: { kategoriAdi: string; satirlar: FiyatSatiri[] }[] = [];
    for (const s of satirlar) {
      const son = g[g.length - 1];
      if (son && son.kategoriAdi === s.kategoriAdi) son.satirlar.push(s);
      else g.push({ kategoriAdi: s.kategoriAdi, satirlar: [s] });
    }
    return g;
  }, [satirlar]);

  return (
    <>
      {bildirim ? (
        <p className={`panel-bildirim panel-bildirim-${bildirim.tur}`}>
          {bildirim.metin}
        </p>
      ) : null}

      {/* Kategoriye atlama: 31 ürün tek sayfada, kaydırarak aramak zordu. */}
      {gruplar.length > 1 ? (
        <nav className="panel-atlama" aria-label="Kategoriye git">
          {gruplar.map((grup) => (
            <a
              key={grup.kategoriAdi}
              href={`#${bolumKimligi(grup.kategoriAdi)}`}
              className="panel-atlama-baglanti"
            >
              {grup.kategoriAdi}
            </a>
          ))}
        </nav>
      ) : null}

      {gruplar.map((grup) => (
        <section key={grup.kategoriAdi} id={bolumKimligi(grup.kategoriAdi)}>
          <h2 className="panel-kategori-basligi">{grup.kategoriAdi}</h2>
          <div className="panel-kart">
            {grup.satirlar.map((s) => (
              <div className="panel-urun" key={s.urunId}>
                <div className="panel-urun-ad">
                  <span>
                    {s.urunAdi}
                    {s.fiyatlar.some((f) => !f.dogrulandi) ? (
                      <span className="panel-rozet">teyit edilmedi</span>
                    ) : null}
                  </span>
                  <button
                    type="button"
                    className="panel-sil-dugmesi"
                    disabled={bekliyor}
                    onClick={() => setSilinecek(s)}
                  >
                    Sil
                  </button>
                </div>
                <div
                  className="panel-fiyat-izgara"
                  style={{
                    gridTemplateColumns: `repeat(${s.fiyatlar.length}, minmax(0, 1fr))`,
                  }}
                >
                  {s.fiyatlar.map((f) => {
                    const anahtar = `${s.urunId}|${f.sutun}`;
                    const ilk = f.tutar === null ? "" : String(f.tutar);
                    const degisti = (degerler[anahtar] ?? "") !== ilk;
                    return (
                      <label className="panel-fiyat-hucre" key={f.sutun}>
                        <span className="panel-fiyat-etiket">{f.sutunAdi}</span>
                        <input
                          className="panel-fiyat-girdi"
                          data-degisti={degisti ? "evet" : "hayir"}
                          type="text"
                          inputMode="numeric"
                          placeholder="—"
                          value={degerler[anahtar] ?? ""}
                          onChange={(e) =>
                            setDegerler((d) => ({
                              ...d,
                              [anahtar]: e.target.value,
                            }))
                          }
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="panel-dugme-satiri">
        <button
          type="button"
          className="panel-dugme"
          disabled={degisiklikler.length === 0 || bekliyor}
          onClick={() => setOzetAcik(true)}
        >
          {degisiklikler.length === 0
            ? "Değişiklik yok"
            : `Kaydet (${degisiklikler.length} fiyat)`}
        </button>
        {degisiklikler.length > 0 ? (
          <button
            type="button"
            className="panel-dugme panel-dugme-ikincil"
            disabled={bekliyor}
            onClick={() => setDegerler(baslangic)}
          >
            Vazgeç
          </button>
        ) : null}
      </div>

      {ozetAcik ? (
        <div className="panel-ozet" role="dialog" aria-modal="true">
          <div className="panel-ozet-kutu">
            <h2 className="panel-kart-baslik">Şunlar değişecek</h2>

            {degisiklikler.map((d) => (
              <div
                className="panel-ozet-satir"
                key={`${d.urunId}|${d.sutun}`}
                data-buyuk={
                  !d.gecersiz && buyukDegisim(d.eski, d.yeni) ? "evet" : "hayir"
                }
              >
                <span>
                  {d.urunAdi}
                  {d.sutunAdi !== "Fiyat" ? ` · ${d.sutunAdi}` : ""}
                </span>
                <span className="panel-ozet-degisim">
                  {d.gecersiz
                    ? "geçersiz sayı"
                    : `${yaz(d.eski)} → ${yaz(d.yeni)}`}
                </span>
              </div>
            ))}

            {gecersizler.length > 0 ? (
              <p className="panel-ozet-uyari">
                {gecersizler.length} alanda sayı olmayan bir şey yazılı. Bunlar
                kaydedilmeyecek — düzeltip tekrar deneyin.
              </p>
            ) : null}

            {buyukler.length > 0 ? (
              <p className="panel-ozet-uyari">
                Dikkat: {buyukler.length} fiyatta çok büyük bir değişiklik var
                (üç kattan fazla fark ya da sıfır). Yanlışlıkla fazladan bir
                rakam yazılmış olabilir — yukarıdaki kırmızı satırları kontrol
                edin.
              </p>
            ) : null}

            <div className="panel-dugme-satiri">
              <button
                type="button"
                className="panel-dugme"
                disabled={bekliyor || degisiklikler.length === gecersizler.length}
                onClick={kaydet}
              >
                {bekliyor ? "Kaydediliyor…" : "Evet, kaydet"}
              </button>
              <button
                type="button"
                className="panel-dugme panel-dugme-ikincil"
                disabled={bekliyor}
                onClick={() => setOzetAcik(false)}
              >
                Geri dön
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {silinecek ? (
        <div className="panel-ozet" role="dialog" aria-modal="true">
          <div className="panel-ozet-kutu">
            <h2 className="panel-kart-baslik">Ürün silinsin mi?</h2>
            <p className="panel-aciklama">
              <strong>{silinecek.urunAdi}</strong> menüden tamamen kaldırılacak.
              Bu işlem geri alınamaz.
            </p>
            <div className="panel-dugme-satiri">
              <button
                type="button"
                className="panel-dugme panel-dugme-tehlike"
                disabled={bekliyor}
                onClick={() => sil(silinecek)}
              >
                {bekliyor ? "Siliniyor…" : "Evet, sil"}
              </button>
              <button
                type="button"
                className="panel-dugme panel-dugme-ikincil"
                disabled={bekliyor}
                onClick={() => setSilinecek(null)}
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
