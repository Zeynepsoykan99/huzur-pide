"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { urunEkle, type YeniUrun } from "../eylemler";

/**
 * Yeni ürün formu.
 *
 * ÇEVİRİLER: yalnızca Türkçe zorunlu. İngilizce, Arapça ve Rusça alanları
 * isteğe bağlı ve varsayılan olarak kapalı bir bölümde duruyor — mekân sahibi
 * o dilleri bilmiyor, form kalabalık görünmesin. Boş bırakılan dil menüde
 * Türkçesiyle görünüyor (`metin()` zaten Türkçe'ye düşüyor).
 *
 * FOTOĞRAF: Firebase Storage henüz kurulu değil (Blaze planı gerekiyor).
 * Bu yüzden ÇALIŞMAYAN bir yükleme alanı GÖSTERİLMİYOR — mekân sahibi
 * basıp hata almasın. Ürün fotoğrafsız ekleniyor ve menüde kategorisinin
 * yer tutucusuyla görünüyor. Storage açıldığında yalnızca buraya bir alan
 * ve eyleme bir dosya parametresi eklenecek; veri yapısı (`gorsel` alanı)
 * şimdiden hazır.
 */

export type KategoriSecenegi = {
  slug: string;
  ad: string;
  sutunlar: { kod: string; ad: string }[];
};

export function UrunFormu({ kategoriler }: { kategoriler: KategoriSecenegi[] }) {
  const router = useRouter();
  const [kategoriSlug, setKategoriSlug] = useState(kategoriler[0]?.slug ?? "");
  const [ad, setAd] = useState({ tr: "", en: "", ar: "", ru: "" });
  const [icerik, setIcerik] = useState({ tr: "", en: "", ar: "", ru: "" });
  const [fiyatlar, setFiyatlar] = useState<Record<string, string>>({});
  const [digerDiller, setDigerDiller] = useState(false);
  const [bildirim, setBildirim] = useState<
    { tur: "basari" | "hata"; metin: string } | null
  >(null);
  const [bekliyor, basla] = useTransition();

  const kategori = kategoriler.find((k) => k.slug === kategoriSlug);
  const sutunlar = kategori?.sutunlar ?? [];

  const enAzBirFiyat = sutunlar.some(
    (s) => (fiyatlar[s.kod] ?? "").trim() !== "",
  );
  const gonderilebilir = ad.tr.trim() !== "" && enAzBirFiyat && !bekliyor;

  function gonder(e: React.FormEvent) {
    e.preventDefault();
    setBildirim(null);

    const yuk: YeniUrun = {
      kategoriSlug,
      ad: {
        tr: ad.tr.trim(),
        en: ad.en.trim() || undefined,
        ar: ad.ar.trim() || undefined,
        ru: ad.ru.trim() || undefined,
      },
      icerik: icerik.tr.trim()
        ? {
            tr: icerik.tr.trim(),
            en: icerik.en.trim() || undefined,
            ar: icerik.ar.trim() || undefined,
            ru: icerik.ru.trim() || undefined,
          }
        : null,
      fiyatlar: sutunlar.map((s) => {
        const ham = (fiyatlar[s.kod] ?? "").trim();
        if (ham === "") return { sutun: s.kod, tutar: null };
        const n = Number(ham.replace(",", "."));
        return {
          sutun: s.kod,
          tutar: Number.isFinite(n) && n >= 0 ? Math.round(n) : null,
        };
      }),
    };

    basla(async () => {
      const sonuc = await urunEkle(yuk);
      if (sonuc.ok) {
        setBildirim({ tur: "basari", metin: sonuc.mesaj });
        setAd({ tr: "", en: "", ar: "", ru: "" });
        setIcerik({ tr: "", en: "", ar: "", ru: "" });
        setFiyatlar({});
        setDigerDiller(false);
        router.refresh();
        window.scrollTo({ top: 0 });
      } else {
        setBildirim({ tur: "hata", metin: sonuc.hata });
      }
    });
  }

  return (
    <form onSubmit={gonder}>
      {bildirim ? (
        <p className={`panel-bildirim panel-bildirim-${bildirim.tur}`}>
          {bildirim.metin}
        </p>
      ) : null}

      <div className="panel-kart">
        <label className="panel-alan">
          <span className="panel-etiket">Hangi bölüme eklensin?</span>
          <select
            className="panel-secim"
            value={kategoriSlug}
            onChange={(e) => setKategoriSlug(e.target.value)}
          >
            {kategoriler.map((k) => (
              <option key={k.slug} value={k.slug}>
                {k.ad}
              </option>
            ))}
          </select>
        </label>

        <label className="panel-alan">
          <span className="panel-etiket">Ürün adı</span>
          <input
            className="panel-girdi"
            type="text"
            required
            value={ad.tr}
            onChange={(e) => setAd({ ...ad, tr: e.target.value })}
            placeholder="Örnek: Kuşbaşılı Pide"
          />
        </label>

        <label className="panel-alan">
          <span className="panel-etiket">
            İçindekiler{" "}
            <span className="panel-etiket-not">(isteğe bağlı)</span>
          </span>
          <input
            className="panel-girdi"
            type="text"
            value={icerik.tr}
            onChange={(e) => setIcerik({ ...icerik, tr: e.target.value })}
            placeholder="Örnek: Kuşbaşı et, biber, domates"
          />
        </label>
      </div>

      <div className="panel-kart">
        <h2 className="panel-kart-baslik">Fiyat</h2>
        <div
          className="panel-fiyat-izgara"
          style={{
            gridTemplateColumns: `repeat(${Math.max(sutunlar.length, 1)}, minmax(0, 1fr))`,
          }}
        >
          {sutunlar.map((s) => (
            <label className="panel-fiyat-hucre" key={s.kod}>
              <span className="panel-fiyat-etiket">{s.ad}</span>
              <input
                className="panel-fiyat-girdi"
                type="text"
                inputMode="numeric"
                placeholder="—"
                value={fiyatlar[s.kod] ?? ""}
                onChange={(e) =>
                  setFiyatlar({ ...fiyatlar, [s.kod]: e.target.value })
                }
              />
            </label>
          ))}
        </div>
        {sutunlar.length > 1 ? (
          <p className="panel-not">
            Bu bölümde üç ayrı fiyat var. Ürünün olmadığı boyutu boş bırakın.
          </p>
        ) : null}
      </div>

      <div className="panel-kart">
        <h2 className="panel-kart-baslik">Diğer diller</h2>
        {!digerDiller ? (
          <>
            <p className="panel-aciklama" style={{ marginBottom: "0.75rem" }}>
              Boş bırakırsanız yabancı müşteri Türkçe adı görür. Sonradan da
              eklenebilir.
            </p>
            <button
              type="button"
              className="panel-dugme panel-dugme-ikincil"
              onClick={() => setDigerDiller(true)}
            >
              Çeviri ekle
            </button>
          </>
        ) : (
          <>
            {(
              [
                ["en", "İngilizce"],
                ["ar", "Arapça"],
                ["ru", "Rusça"],
              ] as const
            ).map(([kod, etiket]) => (
              <div key={kod}>
                <label className="panel-alan">
                  <span className="panel-etiket">{etiket} ad</span>
                  <input
                    className="panel-girdi"
                    type="text"
                    dir={kod === "ar" ? "rtl" : "ltr"}
                    value={ad[kod]}
                    onChange={(e) => setAd({ ...ad, [kod]: e.target.value })}
                  />
                </label>
                {icerik.tr.trim() ? (
                  <label className="panel-alan">
                    <span className="panel-etiket">
                      {etiket} içindekiler
                    </span>
                    <input
                      className="panel-girdi"
                      type="text"
                      dir={kod === "ar" ? "rtl" : "ltr"}
                      value={icerik[kod]}
                      onChange={(e) =>
                        setIcerik({ ...icerik, [kod]: e.target.value })
                      }
                    />
                  </label>
                ) : null}
              </div>
            ))}
          </>
        )}
      </div>

      <p className="panel-not">
        Fotoğraf yükleme henüz açık değil. Ürün şimdilik bölümünün simgesiyle
        görünecek; fotoğraf özelliği açıldığında sonradan eklenebilecek.
      </p>

      <div className="panel-dugme-satiri">
        <button className="panel-dugme" type="submit" disabled={!gonderilebilir}>
          {bekliyor ? "Ekleniyor…" : "Ürünü ekle"}
        </button>
      </div>
    </form>
  );
}
