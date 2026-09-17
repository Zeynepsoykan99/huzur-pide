import { NextResponse, type NextRequest } from "next/server";
import { ESKI_URETIM_ADI, SITE_ADRESI } from "@/data/adres";

/**
 * İki yönlendirme, ikisi de 308:
 *
 *   1. ESKİ ÜRETİM ADRESİ → YENİ ALAN ADI (Aşama 42).
 *      `huzur-pide.vercel.app` hâlâ sayfa veriyordu; aynı site iki adresten
 *      açılıyor, arama motoru ve paylaşılan linkler ikiye bölünüyordu.
 *      Yol ve sorgu korunuyor (`/tr/menu/izgara?x=1` → aynısı, yeni alanda).
 *      Önizleme dağıtımları başka ad kullandığı için etkilenmiyor
 *      (bkz. `data/adres.ts`).
 *
 *   2. BÜYÜK HARFLİ ADRES → KÜÇÜK HARFLİ.
 *
 * İkisi birden gerekiyorsa TEK yönlendirmede birleşiyor (zincir yok):
 * `huzur-pide.vercel.app/TR/MENU` → `www.…/tr/menu`.
 *
 * Aşağıdaki açıklama ikinci kuralın gerekçesi.
 *
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
  const { pathname, search } = request.nextUrl;
  const kucuk = pathname.toLowerCase();

  // `x-forwarded-host` Vercel'in asıl istek adını taşıyor; yoksa `host`.
  const ad = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();
  if (ad === ESKI_URETIM_ADI) {
    return NextResponse.redirect(new URL(kucuk + search, SITE_ADRESI), 308);
  }

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
