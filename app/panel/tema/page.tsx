import { redirect } from "next/navigation";
import { Yaprak } from "@/components/ekranlar";
import { temaFontlari } from "@/app/temalar/aktif";
import { aktifTema, sayfalar, tumRenkSecimleri } from "@/data/menuKaynak";
import {
  SECILEBILIR_TEMALAR,
  VARSAYILAN_TEMA,
  secilebilirTema,
  type SecilebilirTema,
} from "@/data/tema";
import { mevcutYonetici } from "@/lib/oturum";
import { PanelUst } from "../PanelUst";
import { GorunumSecici, type Onizleme } from "./GorunumSecici";

export const dynamic = "force-dynamic";

export default async function TemaSayfasi() {
  const yonetici = await mevcutYonetici();
  if (!yonetici) redirect("/panel");

  const [tema, secimler, tumSayfalar] = await Promise.all([
    aktifTema(),
    tumRenkSecimleri(),
    sayfalar(),
  ]);

  /**
   * Önizleme yaprakları — ÜÇ TEMA İÇİN DE, SUNUCUDA, ÖNCEDEN basılıyor.
   *
   * Menü bileşenleri sunucu bileşeni ve gerçek Firestore verisiyle çalışıyor;
   * istemcide yeniden çizilemezler. Üçü de önden basılıp istemciye düğüm
   * olarak geçince, tema değiştirildiğinde istemcinin yapacağı tek iş
   * hangisini göstereceğini seçmek oluyor — sunucuya gitmiyor, bu yüzden
   * önizleme anlık.
   *
   * Renk için ayrı kopya GEREKMİYOR: renk yalnızca bir CSS değişkeni, aynı
   * markup her renkle çalışıyor. Tema ise motifi (SVG) ve yazı tipini
   * değiştirdiği için kopya başına bir tane gerekiyor.
   *
   * Gösterilen sayfa MENÜNÜN İLK YAPRAĞI (Kapalı Pide): tema değişkenlerinin
   * neredeyse tamamını birden kullanıyor — kategori başlığı, motif ayracı,
   * hayalet sayfa numarası, ürün fotoğrafları, adlar, içindekiler ve üç
   * fiyat sütunu. Uydurma bir örnek kart yerine gerçek sayfa: mekân sahibi
   * kendi menüsünü görüyor ve önizleme sessizce yalan söyleyemiyor.
   *
   * Dil Türkçe — panelin tamamı Türkçe.
   */
  const ilkYaprak = tumSayfalar[0];
  const onizlemeler = Object.fromEntries(
    SECILEBILIR_TEMALAR.map((t) => [
      t,
      {
        // Tema sınıfı + o temanın yazı tipi sınıfları. `next/font` çağrısı
        // sunucuda kalıyor, istemciye yalnızca hazır sınıf adı gidiyor.
        sinif: `tema-${t} ${temaFontlari(t)}`,
        dugum: <Yaprak sayfa={ilkYaprak} dil="tr" tema={t} />,
      } satisfies Onizleme,
    ]),
  ) as Record<SecilebilirTema, Onizleme>;

  // Seçilebilir olmayan bir tema kayıtlıysa (Zeytin) panel onu gösteremez;
  // varsayılana düşülüyor ki ekran boş kalmasın.
  const baslangicTema: SecilebilirTema = secilebilirTema(tema)
    ? tema
    : (VARSAYILAN_TEMA as SecilebilirTema);

  return (
    <>
      <PanelUst tema={tema} />
      <main className="panel-govde">
        <h1 className="panel-baslik">Menü görünümü</h1>
        <p className="panel-aciklama">
          Müşterinin gördüğü menünün görünümünü seçin. Seçtiğiniz anda değişir.
        </p>
        <GorunumSecici
          baslangicTema={baslangicTema}
          baslangicSecimler={secimler}
          onizlemeler={onizlemeler}
        />
      </main>
    </>
  );
}
