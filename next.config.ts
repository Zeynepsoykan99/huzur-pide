import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Uygulamanin tamami /[dil] altinda: kok layout'un <html lang> ve
        // <html dir> degerlerini URL'den okuyabilmesinin tek yolu bu.
        // Kok adres varsayilan olarak Turkce'ye gidiyor; QR kodu dogrudan
        // /tr adresine bakabilir, o zaman bu yonlendirme hic calismaz.
        source: "/",
        destination: "/tr",
        permanent: false,
      },
      // Kategori ici bolme kaldirildi: her kategori artik TEK sayfa ve
      // slug'i kategori slug'inin aynisi. Numarali eski adreslerin hepsi
      // kendi kategorisine geliyor, daha once paylasilmis linkler
      // calismaya devam ediyor.
      //
      // Yon TERSINE dondu: eskiden kapali-pide -> kapali-pide-1 idi. O
      // kurallar silindi; birakilsalardi bu kurallarla sonsuz dongu
      // olustururlardi.
      //
      // Numaralar tek tek yaziliyor (regex'li parametre eslesmesi):
      // boylece gercekten var olmus adresler yonleniyor, hic olmamislar
      // (izgara-9 gibi) 404 kalmaya devam ediyor.
      //
      // salatalar ve tatlilar hep tek sayfaydi, slug'lari degismedi.
      // Akis degisti: QR -> karsilama (/[dil]) -> "Menu" butonu -> dil secimi
      // (/[dil]/dil) -> menu. Menu/Organizasyon secim ekrani kalkti,
      // organizasyon icerigi karsilama sayfasinin bir bolumu oldu.
      //
      // Iki eski adres de karsilama sayfasina geliyor: /secim'in isi zaten
      // oradaki "Menu" butonuna devredildi, /organizasyon'un metni de o
      // sayfanin icinde. Daha once paylasilmis ya da yer imine eklenmis
      // linkler bos sayfaya degil, dogru yere dusuyor.
      { source: "/:dil/secim", destination: "/:dil", permanent: false },
      { source: "/:dil/organizasyon", destination: "/:dil", permanent: false },
      {
        source: "/:dil/menu/kapali-pide-:n(1|2|3)",
        destination: "/:dil/menu/kapali-pide",
        permanent: false,
      },
      {
        source: "/:dil/menu/izgara-:n(1|2|3|4)",
        destination: "/:dil/menu/izgara",
        permanent: false,
      },
      {
        source: "/:dil/menu/icecekler-:n(1|2)",
        destination: "/:dil/menu/icecekler",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
