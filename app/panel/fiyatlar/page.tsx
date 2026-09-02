import { redirect } from "next/navigation";
import { aktifTema, kategoriler } from "@/data/menuKaynak";
import { metin } from "@/data/menu";
import { mevcutYonetici } from "@/lib/oturum";
import { PanelUst } from "../PanelUst";
import { FiyatFormu, type FiyatSatiri } from "./FiyatFormu";

export const dynamic = "force-dynamic";

export default async function FiyatlarSayfasi() {
  const yonetici = await mevcutYonetici();
  if (!yonetici) redirect("/panel");

  const [liste, tema] = await Promise.all([kategoriler(), aktifTema()]);

  // Panel Turkce: urun ve sutun adlari Turkce gosteriliyor.
  const satirlar: FiyatSatiri[] = liste.flatMap((kategori) =>
    kategori.urunler.map((urun) => ({
      urunId: urun.id,
      kategoriAdi: metin(kategori.ad, "tr"),
      urunAdi: metin(urun.ad, "tr"),
      fiyatlar: kategori.sutunlar.map((sutun) => {
        const f = urun.fiyatlar.find((x) => x.sutun === sutun.kod);
        return {
          sutun: sutun.kod,
          sutunAdi: metin(sutun.baslik, "tr"),
          tutar: f?.tutar ?? null,
          dogrulandi: f?.dogrulandi ?? true,
        };
      }),
    })),
  );

  return (
    <>
      <PanelUst tema={tema} />
      <main className="panel-govde">
        <h1 className="panel-baslik">Fiyatları düzenle</h1>
        <p className="panel-aciklama">
          Değiştirmek istediğiniz fiyatı yazın. Kaydetmeden önce ne
          değiştiğini göstereceğim.
        </p>
        <FiyatFormu satirlar={satirlar} />
      </main>
    </>
  );
}
