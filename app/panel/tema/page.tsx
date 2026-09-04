import { redirect } from "next/navigation";
import { aktifTema, kategoriler, renkSecimi } from "@/data/menuKaynak";
import { fiyatYaz, metin } from "@/data/menu";
import { secilebilirTema } from "@/data/tema";
import { mevcutYonetici } from "@/lib/oturum";
import { PanelUst } from "../PanelUst";
import { TemaSecici } from "./TemaSecici";
import { RenkSecici, type OrnekUrun } from "./RenkSecici";

export const dynamic = "force-dynamic";

/**
 * Önizlemede gösterilecek örnek: menüdeki İLK FİYATLI ÜRÜN.
 *
 * Uydurma bir örnek ("Kıymalı Pide · 180 ₺") yazılabilirdi ama mekân sahibi
 * kendi menüsünde olmayan bir satır görürdü. Gerçek ürün hem dürüst hem de
 * rengin kendi içeriğinde nasıl durduğunu gösteriyor.
 */
async function ornekUrun(): Promise<OrnekUrun | null> {
  for (const kategori of await kategoriler()) {
    for (const urun of kategori.urunler) {
      const fiyat = urun.fiyatlar.find((f) => f.tutar !== null);
      if (fiyat) {
        return { ad: metin(urun.ad, "tr"), fiyat: fiyatYaz(fiyat.tutar) };
      }
    }
  }
  return null;
}

export default async function TemaSayfasi() {
  const yonetici = await mevcutYonetici();
  if (!yonetici) redirect("/panel");

  const tema = await aktifTema();
  const [secim, ornek] = await Promise.all([renkSecimi(), ornekUrun()]);

  return (
    <>
      <PanelUst tema={tema} />
      <main className="panel-govde">
        <h1 className="panel-baslik">Menü görünümü</h1>
        <p className="panel-aciklama">
          Müşterinin gördüğü menünün görünümünü seçin. Seçtiğiniz anda değişir.
        </p>
        <TemaSecici baslangic={tema} />

        {/*
          Renk seçimi temaya bağlı: her temanın kendi paleti var, çünkü bir
          temanın zeminine uyan renk diğerininkinde okunmuyor. `key={tema}`
          şart — tema değişince bileşen sıfırdan kuruluyor ve yeni temanın
          kendi kayıtlı seçimiyle açılıyor; yoksa eski temanın seçimi ekranda
          kalırdı.

          Seçilebilir olmayan bir tema (Zeytin) geçerliyse renk bölümü hiç
          çıkmıyor: onun paleti yok, temanın kendi renkleri geçerli.
        */}
        {secilebilirTema(tema) ? (
          <RenkSecici key={tema} tema={tema} baslangic={secim} ornek={ornek} />
        ) : null}
      </main>
    </>
  );
}
