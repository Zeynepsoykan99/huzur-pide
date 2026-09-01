import { redirect } from "next/navigation";
import { aktifTema, kategoriler } from "@/data/menuKaynak";
import { metin } from "@/data/menu";
import { mevcutYonetici } from "@/lib/oturum";
import { PanelUst } from "../PanelUst";
import { UrunFormu, type KategoriSecenegi } from "./UrunFormu";

export const dynamic = "force-dynamic";

export default async function UrunEkleSayfasi() {
  const yonetici = await mevcutYonetici();
  if (!yonetici) redirect("/panel");

  const [liste, tema] = await Promise.all([kategoriler(), aktifTema()]);

  const secenekler: KategoriSecenegi[] = liste.map((k) => ({
    slug: k.slug,
    ad: metin(k.ad, "tr"),
    sutunlar: k.sutunlar.map((s) => ({ kod: s.kod, ad: metin(s.baslik, "tr") })),
  }));

  return (
    <>
      <PanelUst tema={tema} />
      <main className="panel-govde">
        <h1 className="panel-baslik">Yeni ürün ekle</h1>
        <p className="panel-aciklama">
          Türkçe adı ve fiyatı yazmanız yeterli. Diğer diller boş kalırsa
          menüde Türkçesi görünür.
        </p>
        <UrunFormu kategoriler={secenekler} />
      </main>
    </>
  );
}
