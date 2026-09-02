import { redirect } from "next/navigation";
import { aktifTema } from "@/data/menuKaynak";
import { mevcutYonetici } from "@/lib/oturum";
import { PanelUst } from "../PanelUst";
import { TemaSecici } from "./TemaSecici";

export const dynamic = "force-dynamic";

export default async function TemaSayfasi() {
  const yonetici = await mevcutYonetici();
  if (!yonetici) redirect("/panel");

  const tema = await aktifTema();

  return (
    <>
      <PanelUst tema={tema} />
      <main className="panel-govde">
        <h1 className="panel-baslik">Menü görünümü</h1>
        <p className="panel-aciklama">
          Müşterinin gördüğü menünün görünümünü seçin. Seçtiğiniz anda değişir.
        </p>
        <TemaSecici baslangic={tema} />
      </main>
    </>
  );
}
