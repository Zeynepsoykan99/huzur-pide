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
      // Bolunen kategorilerin eski adresleri ilk sayfalarina gidiyor;
      // daha once paylasilmis linkler calismaya devam ediyor.
      // salatalar ve tatlilar tek sayfa oldugu icin slug'lari degismedi,
      // onlara yonlendirme gerekmiyor.
      {
        source: "/:dil/menu/kapali-pide",
        destination: "/:dil/menu/kapali-pide-1",
        permanent: false,
      },
      {
        source: "/:dil/menu/izgara",
        destination: "/:dil/menu/izgara-1",
        permanent: false,
      },
      {
        // Kapali pide 2+2+2 iken 3+3'e gecti: 3. sayfa artik yok. Eski 3.
        // sayfadaki Karisik ve Lahmacun yeni bolmede 2. sayfada duruyor,
        // bu yuzden hedef ilk sayfa DEGIL, 2. sayfa.
        source: "/:dil/menu/kapali-pide-3",
        destination: "/:dil/menu/kapali-pide-2",
        permanent: false,
      },
      {
        // Icecekler tek sayfaydi, 4+3 olarak bolundu: eski adres artik
        // bir sayfa degil, ilk sayfasina gidiyor.
        source: "/:dil/menu/icecekler",
        destination: "/:dil/menu/icecekler-1",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
