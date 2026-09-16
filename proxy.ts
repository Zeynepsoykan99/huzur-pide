import { NextResponse, type NextRequest } from "next/server";

/**
 * Büyük harfli adresleri küçük harfliye yönlendirir (308).
 *
 * NEDEN: Vercel, önceden üretilmiş sayfaları adresle büyük/küçük harfe
 * DUYARSIZ eşleştiriyor. `/tr/MENU/corbalar` ve `/tr/Menu` 200 dönüp
 * `/tr/menu/corbalar` ile aynı içeriği veriyordu — aynı sayfa birden fazla
 * adresten erişilebiliyordu. Ölçüldü (Aşama 40). canonical etiketi arama
 * motoruna doğru adresi söylüyor; bu yönlendirme de kullanıcıyı oraya
 * taşıyor, paylaşılan linkte yanlış biçim yayılmıyor.
 *
 * Uygulamadaki bütün adresler küçük harf: dil kodları, `menu`, kategori
 * slug'ları, `panel`. Bu yüzden "küçük harfe çevir" kuralı hiçbir gerçek
 * adresi bozmuyor. `/TR` gibi önceden 404 olan biçimler de artık doğru
 * sayfaya gidiyor.
 *
 * MALİYET: Vercel'de eşleşen her istekte küçük bir sunucu çağrısı. Bunu
 * daraltmak için:
 *   - statik dosyalar, görseller, `_next` ve metadata dosyaları dışarıda;
 *   - istemcinin kendi ürettiği RSC istekleri (ön yükleme ve gezinme)
 *     dışarıda — onlar uygulamanın kendi küçük harfli linklerinden geliyor.
 * Yani yalnızca TAM SAYFA istekleri buradan geçiyor.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const kucuk = pathname.toLowerCase();
  if (pathname === kucuk) return NextResponse.next();

  const hedef = request.nextUrl.clone();
  hedef.pathname = kucuk;
  return NextResponse.redirect(hedef, 308);
}

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/|mekan/|urunler/|flags/|og/|favicon\\.svg|logo\\.svg|robots\\.txt|sitemap\\.xml).*)",
      missing: [
        { type: "header", key: "rsc" },
        { type: "header", key: "next-router-prefetch" },
      ],
    },
  ],
};
