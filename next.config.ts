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
    ];
  },
};

export default nextConfig;
