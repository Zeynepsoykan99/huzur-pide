# Huzur Pide — İlerleme Kaydı

## Proje Özeti

**Proje:** Huzur Pide dijital menü uygulaması
**Güncel aşama:** Aşama 16 tamamlandı (dalda, push onayı bekliyor) — admin paneli çalışıyor: tema, fiyat ve ürün ekleme. Menü Firestore'dan besleniyor, hâlâ statik. Aşama 15 (Çini Levha) da aynı dalda. Bekleyen: Firebase Storage / fotoğraf yükleme, QR adresi, organizasyon içeriği
**Son güncelleme:** 2026-08-28

### Genel Durum

Numaralandırma rapor başlıklarıyla aynı: aşağıdaki her satırın karşılığı
"Raporlar" bölümünde aynı numarayla duruyor.

| Aşama | Konu | Durum |
|---|---|---|
| 1 | Dil seçim ekranı tasarımı | **Tamamlandı** (5/5 adım) |
| 2 | Menü sayfaları tasarımı | **Tamamlandı** (7/7 adım) |
| 3 | Çok dillilik + dil değiştirme + RTL | **Tamamlandı** |
| 4 | Ana seçim ekranı + organizasyon | **Tamamlandı** |
| 5 | Vercel'de canlıya alma | **Tamamlandı** |
| 6 | Menü kitabı — yatay kaydırma | **Tamamlandı** |
| 7 | Denetim ve düzeltmeler | **Tamamlandı** |
| 8 | Sayfa bölme ince ayarı | **Tamamlandı** |
| 9 | Gerçek telefon yüksekliğine sığdırma | **Tamamlandı** |
| 10 | Kategori bağlantısı hatası + sayfa çevirme okları | **Tamamlandı** |
| 11 | Kaydırma çubuğu + Kapalı Pide 2 sayfa | **Tamamlandı** |
| 12 | Üretime çıkış ve canlı doğrulama | **Tamamlandı** |
| 13 | "Düble" → "Duble" yazım düzeltmesi | **Tamamlandı** |
| 14 | Her kategori tek sayfa + aşağı ok ipucu | **Tamamlandı** |
| 15 | Çini Levha teması + dört temalı yapı | **Tamamlandı** (dalda) |
| 16 | Admin paneli — Firebase (Firestore + Auth) | **Tamamlandı** (dalda) |

### Aşama 1 Adımları

- [x] Adım 1 — Proje iskeleti
- [x] Adım 2 — Bayrak SVG'leri
- [x] Adım 3 — index.html iskeleti ve genel layout
- [x] Adım 4 — Dil butonları ve etkileşim durumları
- [x] Adım 5 — RTL hazırlığı, erişilebilirlik ve doğrulama

### Aşama 2 Adımları

- [x] Adım 0 — Next.js'e geçiş
- [x] Adım 1 — GitHub
- [x] Adım 2 — Veri modeli
- [x] Adım 3 — Ekran A: Kategori listesi
- [x] Adım 4 — Ekran B: Kategori sayfaları
- [x] Adım 5 — Görseller
- [x] Adım 6 — Doğrulama

### Canlı Adres

**https://huzur-pide.vercel.app**

Vercel projesi: `zey-ad23/huzur-pide` · üretim dalı `main` · GitHub bağlı,
`main`'e her push otomatik üretim dağıtımı tetikler.

### Depo

https://github.com/Zeynepsoykan99/huzur-pide (**public**, dal: `main`)

### Ekranlar

Dil URL'nin ilk parçası: `tr` · `en` · `ar` · `ru`. `/` adresi `/tr`'ye yönlendirilir.

**Akış:** QR → dil seçimi → ana seçim → menü veya organizasyon

| Yol | Ekran |
|---|---|
| `/[dil]` | Dil seçimi |
| `/[dil]/secim` | Ana seçim — Menü / Organizasyon |
| `/[dil]/organizasyon` | Organizasyon (içerik bekliyor) |
| `/[dil]/menu` | Ekran A — kategori listesi |
| `/[dil]/menu/[sayfa]` | Ekran B — menü kitabının bir yaprağı (aşağıdaki 10 slug) |

**Menü kitabı — 10 sayfa.** Her rota kitabın tamamını basıyor; adresteki slug
kitabın hangi sayfasında açılacağını belirliyor. Parmakla yana kaydırınca
sayfalar arasında geziliyor, adres de kaydıkça güncelleniyor.

| Sayfa | Slug | Kategori | Ürün | İçerik |
|---|---|---|---|---|
| 1 | `kapali-pide-1` | Kapalı Pide (1/2) | 3 | Kıymalı, Kaşarlı, Sucuklu |
| 2 | `kapali-pide-2` | Kapalı Pide (2/2) | 3 | Kıyma-kaşar, Karışık, Lahmacun |
| 3 | `izgara-1` | Izgara (1/4) | 4 | Et + Kuzu |
| 4 | `izgara-2` | Izgara (2/4) | 3 | Köfte |
| 5 | `izgara-3` | Izgara (3/4) | 4 | Tavuk + Karışık |
| 6 | `izgara-4` | Izgara (4/4) | 3 | Saç kavurma + Şiş |
| 7 | `salatalar` | Salatalar | 1 | Çoban salata |
| 8 | `tatlilar` | Tatlı Çeşitleri | 3 | Künefe, Sütlaç, Kabak |
| 9 | `icecekler-1` | İçecekler (1/2) | 4 | Kola, Fanta, Soda, Ayran |
| 10 | `icecekler-2` | İçecekler (2/2) | 3 | Komposto, Meyveli soda, Su |

Izgara bölümlerinin sınırları ürün gruplarına göre seçildi: et, kuzu, köfte,
tavuk, karışık, saç kavurma ve şiş gruplarından hiçbiri sayfa ortasında
bölünmüyor. Bu yüzden bölüm 4+3+4+3, eşit değil.

Bölünen kategorilerin eski adresleri (`kapali-pide`, `izgara`, `icecekler`)
ilk sayfalarına yönlendiriliyor; daha önce paylaşılmış linkler kırılmıyor.
`kapali-pide-3` artık yok — kategori 3 sayfadan 2 sayfaya indi — ve
`kapali-pide-2`'ye yönleniyor: o sayfadaki ürünler şimdi orada.

**Kapalı pide tablosu telefonda farklı:** görsel sütunu kalkıyor ve
açıklamalar tek satıra kırpılıyor. Sebebi sığma: kategori 3+3 bölündüğünde
İngilizce 2. sayfa 800px, Rusça 707px yükseklik istiyordu; hedefteki en kısa
cihaz 629px. Görsel sütunu kalkınca ad sütunu genişliyor. md ve üstünde ikisi
de geri geliyor.

**Kaydırma çubukları gizli.** Hem kitabın yatay kabında (`.kitap`) hem sayfa
içeriğinde (`.kitap-icerik`): `scrollbar-width: none` + `::-webkit-scrollbar`.
Kaydırma işlevi duruyor, yalnızca çubuk çizilmiyor.

**"Menüye dön" düğmesi kitabın alt şeridinde**, sayfa numarasının yanında —
her yaprağın içinde değil. Şerit 44px; düğme 44px dokunma hedefi, sayaç 14px.
Arapça'da düğme sağda, sayaç solda (`justify-between` yazma yönünü izliyor).

**Sayfa çevirme okları** kitabın iki kenarında, dikeyde ortada: 44×44 dokunma
hedefi, görünen kısım kenar boşluğuna sığan 20px'lik daire. İleri ok
`inset-inline-end`, geri ok `inset-inline-start` — Arapça'da ileri sol
kenardadır. 1. sayfada geri ok, son sayfada ileri ok gizlenir. Parmakla
kaydırma bunlardan bağımsız olarak çalışmaya devam eder; oklar aynı kaba
`scrollBy` yapar ve aynı snap noktalarına oturur.

**Açılış sayfası konumlandırması iki yerde:** tam sayfa yüklemede sayfanın
sonundaki satır içi script, istemci tarafı gezinmede (`<Link>`) `SayfaSayaci`
içindeki layout effect. İkisi de `components/kitapKaydirma.ts`'deki yön
bağımsız fark hesabını kullanır. Satır içi script istemci tarafı gezinmede
ÇALIŞMAZ — `innerHTML` ile DOM'a giren script'i tarayıcı çalıştırmaz.

**Hedef ekran:** tek ekran kuralı, tarayıcının **görünür alanı** ≥ 547px
(≥360px genişlikte) ve ≥ 508px (390px'te) olan her telefonda sağlanıyor.
Cihazın fiziksel yüksekliği değil, adres çubuğu açıkken kalan yükseklik esas
alınıyor — kitap belgeyi kaydırmadığı için o çubuk hiç toplanmıyor.
Kapsam dışı: iPhone SE 1. nesil / 5s sınıfı (320×568).

Toplam **58 statik sayfa** (4 dil × 10 menü sayfası + 4 dil × 4 diğer ekran +
`_not-found`). Örnek: `/ar/menu/izgara-1`

### Aşama 1 Çıktısı

`index.html` — tek sayfalık dil seçim ekranı. Dört dil butonu (Türkçe, English,
العربية, Русский), yerel bayrak SVG'leri, bej/sütlü kahve palet, mobile-first
düzen, RTL'e hazır yapı. Henüz işlevsellik yok; butonlar tıklanabilir ama bir şey
yapmıyor — bu bilinçli, Aşama 3'te bağlanacak.

> **Not (Aşama 2, Adım 0):** Bu ekran artık `index.html` değil, Next.js
> uygulaması olarak `app/page.tsx` içinde yaşıyor. Çalıştırmak için proje
> klasöründe `npm run dev` çalıştırıp `http://localhost:3000` adresine gidin.

### Teknoloji ve Kararlar

- Next.js 16.2.12 (App Router, TypeScript) + Tailwind CSS v4
- Aşama 1'de HTML + Tailwind v3 Play CDN idi; Aşama 2 Adım 0'da taşındı
- Bayraklar yerel SVG (`public/flags/`), dış servise bağımlılık yok
- Arapça için Birleşik Arap Emirlikleri bayrağı
- Başlık fontu Marcellus, `next/font/local` ile repodan servis ediliyor; gövde metni sistem fontları
- Mobile-first; RTL'e hazır yapı (yön bağımsız utility'ler)

### Renk Paleti

| İsim | Hex | Kullanım |
|---|---|---|
| cream-50 | #F5EFE6 | Sayfa arka planı (üst) |
| cream-100 | #EDE0D4 | Sayfa arka planı (alt) |
| cream-150 | #E7D6C0 | Kraft — menü kitabı sayfalarının düz zemini |
| cream-200 | #E0CDB8 | Yedek ara ton |
| latte-400 | #C8A27A | Buton normal |
| latte-500 | #B08968 | Buton hover / active |
| latte-600 | #96745A | Kenarlık (ring) |
| cocoa-700 | #6B5342 | İkincil metin |
| cocoa-900 | #4A3728 | Ana yazı rengi |
| paprika-400 | #C2622A | Açık turuncu (yedek) |
| paprika-500 | #B0561F | Kategori başlıkları — bej zemin (Ekran A) |
| paprika-600 | #9A4A1A | Kategori başlıkları — kraft zemin (menü kitabı) |

### Rapor Biçimi

**Aşama başına tek birleşik rapor.** İş tamamen bitmeden rapor yazılmaz, adımlar
arasında ara durum mesajı verilmez. Aşama bitince yukarıdaki özet güncellenir ve
dosyanın sonuna o aşamanın tek raporu eklenir; önceki raporların üzerine yazılmaz.
İstisna: plan onayı, GitHub push onayı, eksik/belirsiz içerik ve engel durumları —
bunlarda çalışma durdurulup sorulur.

---

# Raporlar

## Aşama 1 — Dil Seçim Ekranı · 2026-08-27

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 1 — Dil Seçim Ekranı (Adım 1–5, tamamı)

---

**Yapılanlar:**

*Adım 1 — Proje iskeleti*
- `assets/flags/` ve `assets/css/` klasörleri oluşturuldu
- Git deposu başlatıldı (`git init -b main`)
- `.gitignore` oluşturuldu (OS dosyaları, editör klasörleri, ileride oluşabilecek
  `node_modules/` ve `dist/`, geçici test çıktıları)
- `ILERLEME.md` oluşturuldu: üstte proje özeti, aşama durum tablosu, adım kontrol
  listesi, teknoloji kararları ve renk paleti

*Adım 2 — Bayrak SVG'leri*
- 4 bayrak çizildi: `tr.svg`, `gb.svg`, `ae.svg`, `ru.svg` — her biri kendi resmi
  en-boy oranında ve resmi renk kodlarıyla
- Tümü `viewBox` tabanlı, sabit `width`/`height` yok; CSS ile serbestçe ölçekleniyor
- Her dosyaya `role="img"`, Türkçe `aria-label` ve `<title>` eklendi
- Yerel HTTP sunucusu ayağa kaldırılıp bayraklar tarayıcıda hem 80px hem de buton
  içindeki gerçek boyutunda (24px) render edilerek görsel olarak doğrulandı

*Adım 3 — index.html iskeleti ve genel layout*
- `<html lang="tr" dir="ltr">`, UTF-8, `viewport-fit=cover`'lı viewport meta'sı,
  `theme-color`, açıklama meta'sı
- Tailwind Play CDN + inline `tailwind.config`: renk paleti (`cream`, `latte`,
  `cocoa`) ve font aileleri (`display`, `body`) tanımlandı
- Google Fonts'tan Marcellus başlık fontu `preconnect` + `display=swap` ile bağlandı
- Sayfa iskeleti: `header` (logo + başlık + ayraç + slogan), `main` (dil seçimi
  başlığı + buton konteyneri), `footer`
- "Dil Seçiniz" altına dört dildeki karşılığı eklendi; her biri kendi `lang`
  niteliğiyle, Arapça olan ayrıca `dir="rtl"` ile (karışık metin içinde doğru sıra için)
- `assets/logo.svg`: sütlü kahve halka içinde, kertikli hamur kenarı, malzemesi ve
  buharı olan pide silüeti
- `assets/favicon.svg`: sekme ikonu için sadeleştirilmiş versiyon
- `assets/css/custom.css`: dokunma parlaması kapatma, yatay taşma engeli, `dvh`
  yedeği, `prefers-reduced-motion` desteği

*Adım 4 — Dil butonları ve etkileşim durumları*
- Dört buton eklendi: Türkçe, English, العربية, Русский
- Her buton üç parça: sabit genişlikli bayrak slotu, dil adı, sağda ince ok
- `<style type="text/tailwindcss">` bloğu içinde `@layer components` altında
  `.lang-btn`, `.flag-slot`, `.flag`, `.lang-name`, `.lang-arrow` sınıfları `@apply`
  ile tanımlandı
- Etkileşim durumları: hover'da bir ton koyulaşma + hafif yukarı kalkma + gölge
  büyümesi + okun ileri kayması; active'de geri basılma; focus-visible'da koyu kahve
  odak halkası
- Tailwind config'e `future: { hoverOnlyWhenSupported: true }` eklendi
- Düzen: mobilde tek sütun dikey liste, `md` ve üstünde 2x2 grid
- `header` + `main` dikeyde ortalanan bir gruba alındı, `footer` sayfanın altında kaldı

*Adım 5 — RTL hazırlığı, erişilebilirlik ve doğrulama*
- Tarayıcıda `<html dir="rtl">` verilerek düzenin aynalanması test edildi: bayraklar
  sağa, oklar sola geçti, metinler sağa yaslandı — hiçbir CSS düzeltmesi gerekmedi
- Okun yönü CSS değişkeni üzerinden `dir`'e duyarlı hale getirildi
- `#language-list`'e `role="group"` ve `aria-labelledby="lang-heading"` eklendi
- Kontrast oranları tarayıcıda WCAG formülüyle hesaplandı (aşağıdaki tabloya bakınız)
- Etiket puntosu her ekran boyutunda 20px/600'e sabitlendi
- Doğrulanan diğer noktalar: buton yüksekliği tam 56px, yatay taşma yok, sekme sırası
  dört butonu doğru sırayla geziyor, erişilebilir isimler doğru, konsolda hata yok
- Son görsel doğrulama 390x844 (telefon), 768x1024 (tablet) ve 1280x800 (masaüstü)
  çözünürlüklerinde yapıldı

---

**Oluşturulan/Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `index.html` | yeni — dil seçim ekranı |
| `ILERLEME.md` | yeni — ilerleme kaydı |
| `.gitignore` | yeni |
| `assets/logo.svg` | yeni — pide logosu |
| `assets/favicon.svg` | yeni — sekme ikonu |
| `assets/css/custom.css` | yeni — Tailwind dışı taban stiller |
| `assets/flags/tr.svg` | yeni — Türkiye |
| `assets/flags/gb.svg` | yeni — Birleşik Krallık |
| `assets/flags/ae.svg` | yeni — Birleşik Arap Emirlikleri |
| `assets/flags/ru.svg` | yeni — Rusya |

Git geçmişi (`main` dalı):

```
0bc0309  Adim 5: RTL hazirligi, erisilebilirlik duzeltmeleri ve dogrulama
5d9855d  Adim 4: dort dil butonu ve etkilesim durumlari
b0970aa  Adim 3: index.html iskeleti, palet, logo ve favicon
8b07d4d  Adim 2: TR, GB, AE, RU bayrak SVG'leri
b6735be  Adim 1: proje iskeleti, .gitignore ve ILERLEME.md
```

---

**Alınan kararlar:**

*Yapı ve teknoloji*
- **Dal adı `main`** seçildi, modern varsayılan.
- **Palet Tailwind config'e isimlendirilmiş renk olarak taşındı** (`bg-latte-400`,
  `text-cocoa-900`). Sınıf isimleri hex kodlarıyla dolmuyor, bir tonu değiştirmek tek
  satırlık iş. Ara tonlar (`cream-200`, `latte-600`, `cocoa-700`) da şimdiden tanımlandı.
- **`node_modules/` ve `dist/` şimdiden `.gitignore`'a eklendi**; ileride Tailwind
  CDN'den build sistemine geçilirse dosyayı tekrar düzenlemek gerekmeyecek.
- **`<a>` değil `<button type="button">`** kullanıldı. Dil seçimi bir sayfa navigasyonu
  değil, uygulama içi durum değişikliği olacak.
- **`data-lang` ve `data-dir` nitelikleri şimdiden eklendi.** Aşama 3'te JS bu iki
  niteliği okuyup `<html lang>` ve `<html dir>` değerlerini ayarlayacak; HTML'e tekrar
  dokunmak gerekmeyecek.
- **Ok işareti `<img>` değil inline `<svg>`.** 4 ayrı ağ isteği yerine tek satır
  işaretleme; `currentColor` kullandığı için hover'da metinle birlikte renk değiştiriyor.

*Bayraklar*
- **Dosya adları ISO 3166 ülke kodu ile:** `tr`, `gb`, `ae`, `ru`. `en.svg` yerine
  `gb.svg`; dosya bir ülkeyi temsil ediyor, dili değil. Dil kodu (`en`) ile ülke kodu
  (`gb`) ayrımı ileride dil mantığı yazılırken karışıklığı önleyecek.
- **Arapça için Birleşik Arap Emirlikleri bayrağı** seçildi. Suudi Arabistan bayrağı
  üzerindeki Kelime-i Şehadet hat yazısı elle çizilen SVG'de doğru render edilemezdi.
- **Her bayrak resmi oranında bırakıldı**, ortak bir orana zorlanmadı: tr 3:2, gb 1:2,
  ae 2:1, ru 3:2. Bayrağı esnetmek hem yanlış hem saygısız olurdu.
- **Türk bayrağı resmi ölçülere göre:** dış daire r=200 @ (425,400), iç daire r=160 @
  (535,400), yıldız çevrel yarıçapı 100 @ (683,400), bir ucu hilale bakacak şekilde
  döndürülmüş.
- **Union Jack'in çapraz kolları** `clipPath` ile doğru "counterchanged" (aynalı
  kaydırmalı) biçimde çizildi; basitleştirilmiş simetrik versiyon kullanılmadı.
- Dört dosya toplam ~1.6 KB, sıfır dış bağımlılık — uygulama tamamen çevrimdışı da
  çalışır.
- **Sabit 48px bayrak slotu:** oranlar farklı olduğu için bayraklar doğrudan yan yana
  konsaydı metinler kaydırılırdı. Slot sayesinde en geniş bayrak (Union Jack) slotu
  doldururken diğerleri ortalanıyor, dört metin de aynı hizada başlıyor.
- **Bayraklara ince kenarlık (`ring-1 ring-cocoa-900/25`) eklendi.** Rusya, BK ve BAE
  bayraklarındaki beyaz alanlar sütlü kahve zeminde sınırsız kalıyordu.

*Tasarım*
- **Arka plan düz renk değil, `cream-50` → `cream-100` dikey gradyan.** Tek düz bej
  cansız duruyordu; çok hafif geçiş derinlik veriyor, istenen aralığın içinde kalıyor.
- **Marcellus sadece başlıkta**; gövde metni bilinçli olarak sistem fontlarında.
  Mobilde anında render olur, ikinci font indirmeyi beklemez — menüde okunabilirlik ve
  hız gövde için karakterden önemli.
- **`min-h-dvh`** kullanıldı (`min-h-screen` değil): mobilde adres çubuğu görünüp
  kaybolurken `100vh` sayfayı kaydırıyor. Eski tarayıcılar için `@supports` ile `vh`
  yedeği bırakıldı.
- **Genişlik kademeli sınırlı:** `max-w-md` → `sm:max-w-lg` → `lg:max-w-xl`.
  Tablet/masaüstünde menü ekrana yayılıp seyrelmiyor.
- **Logo başta "göz" gibi okunuyordu** — hamur kenarı inceltilip kertikler, malzeme
  noktaları ve buhar eklenerek net bir pide silüetine dönüştürüldü, tarayıcıda tekrar
  doğrulandı.
- **Dil adları kendi dilinde yazıldı** ("English", "العربية", "Русский" — "İngilizce,
  Arapça, Rusça" değil). Rusça bilen müşteri "Rusça" kelimesini okuyamaz ama
  "Русский"i tanır; dil seçim ekranlarında standart yaklaşım budur.
- **Arapça etiket bir punto büyük gösteriliyor.** Arap alfabesi aynı punto değerinde
  latin harflerden gözle görülür şekilde küçük görünür.
- `<img>` etiketlerine `width`/`height` verildi (layout kayması / CLS önlemi). Logo
  dekoratif olduğu için `alt=""` + `aria-hidden` — altındaki `<h1>` aynı bilgiyi veriyor.

*Etkileşim ve erişilebilirlik*
- **`hoverOnlyWhenSupported` açıldı.** Bu ayar olmadan dokunmatik ekranda bir butona
  dokunduktan sonra hover durumu ekranda "yapışıp" kalıyor. Menü ağırlıklı olarak
  telefondan açılacağı için önemli.
- **Odak göstergesi `ring` değil `outline` ile yapıldı.** Butonun normal halinde zaten
  bir `ring-1` kenarlığı var; ikisi de `box-shadow` kullandığı için çakışıyorlardı.
- **Minimum dokunma hedefi 56px** (`min-h-[3.5rem]`). WCAG 2.5.5'in önerdiği 44px'in
  üzerinde; telefondan tek elle rahat basılıyor.
- **Active durumunda renk yerine hareket kullanıldı.** Basılma efekti `latte-600`
  (#96745A) ile veriliyordu; ölçüm bu kombinasyonun 2.65:1 kontrast verdiğini, yani
  basılı tutulduğu sürece metnin okunaksız hale geldiğini gösterdi. Active artık
  `latte-500`'de kalıp `scale-[0.985]` ile hafifçe küçülüyor ve gölgesi azalıyor.
  Dokunsal geri bildirim korundu, kontrast 3.55:1'e çıktı. `latte-600` kenarlıkta
  kullanılmaya devam ediyor.
- **Etiket puntosu 20px'e sabitlendi** (önce mobilde 18px, `sm`'den sonra 20px idi).
  WCAG'ın "büyük metin" eşiği 14pt/18.66px kalın; 18px bu eşiğin hemen altında kaldığı
  için hover durumu dar bir masaüstü penceresinde teknik olarak başarısız oluyordu.
  Ayrıca restoran menüsü loş ışıkta ve her yaştan müşteri tarafından okunuyor — 20px
  zaten daha iyi bir tercih.
- **Otomatik erişilebilirlik denetim aracı (axe vb.) kurulmadı.** Sayfada dört buton ve
  bir başlık var; kontrast, odak görünürlüğü, dokunma hedefi, erişilebilir isim ve sekme
  sırası tek tek elle ölçüldü. Menü sayfaları eklendiğinde tekrar değerlendirilmeli.

*RTL*
- **Yön bağımlı hiçbir utility kullanılmadı.** `px`, `gap`, `text-start` gibi yönden
  bağımsız sınıflar tercih edildi; `ml`/`mr`/`left`/`right` hiç geçmiyor. RTL testinde
  düzenin kendiliğinden aynalanmasının nedeni bu — ayrı bir stil dosyası veya `rtl:`
  varyantı gerekmedi.
- **Arapça buton etiketinden `dir="rtl"` kaldırıldı.** Etiket tek yönlü bir metin, yön
  işareti olmadan da doğru render oluyor; `dir="rtl"` verildiğinde ise metin buton
  içinde sağa yaslanıp diğer üç butonla hizasını bozuyordu. Sayfa RTL'e geçtiğinde dördü
  birden aynalanacağı için doğru davranış bu. `lang="ar"` korundu (font seçimi ve ekran
  okuyucu telaffuzu için gerekli). Başlık altındaki karışık metin içinde geçen Arapça
  ibarede ise `dir="rtl"` bilinçli olarak korundu.
- **Ok yönü Tailwind'in `rtl:` varyantı yerine CSS değişkeniyle çözüldü.** `rtl:`
  varyantı işe yarardı ama hover kaymasıyla birlikte dört ayrı sınıf kombinasyonu
  gerekiyordu. Değişken yaklaşımı tek transform ifadesiyle hem yönü hem kaymayı
  yönetiyor; `scaleX` önce yazıldığı için koordinat sistemi terslendiğinde kayma da
  kendiliğinden doğru yöne gidiyor.

---

**Ölçüm sonuçları (WCAG kontrast, tarayıcıda hesaplandı):**

| Kombinasyon | Oran | Sonuç |
|---|---|---|
| Metin / buton (normal) | 4.77:1 | AA geçer |
| Metin / buton (hover) | 3.55:1 | 20px/600 büyük metin — AA geçer |
| Metin / buton (active) | 3.55:1 | düzeltme sonrası — AA geçer |
| Metin / sayfa arka planı | 9.83:1 | AAA geçer |
| Alt metin / sayfa | 5.51:1 | AA geçer |

Diğer ölçümler: buton yüksekliği 56px · yatay taşma yok · odaklanabilir öğe sayısı 4 ·
erişilebilir isimler doğru · konsolda hata yok (tek uyarı Tailwind CDN'in "üretimde
kullanma" uyarısı, bu aşama için beklenen ve kabul edilmiş durum).

---

**Bu aşamada bilinçli olarak yapılmayanlar:**
- Butonlara tıklama davranışı bağlanmadı — istendiği gibi yalnızca tasarım yapıldı
- `dir="rtl"` uygulanmadı, sadece altyapısı kuruldu
- Tailwind CDN'den gerçek build'e geçilmedi; canlıya çıkmadan önce yapılmalı
- Kök dizindeki mevcut boş `huzur pide` dosyasına dokunulmadı, git takibine alınmadı

---

**Sıradaki adım:** Aşama 2 — menü sayfalarının tasarımı (kategori listesi, ürün
kartları, fiyat gösterimi, geri dönüş ve dil değiştirme kontrolü). Bu aşamanın planı
ayrıca çıkarılıp onaya sunulacak.

=== RAPOR SONU ===

---


## Aşama 2 — Menü Sayfaları · 2026-08-27

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 2 — Menü Sayfaları (Adım 0–6, tamamı)

---

**Yapılanlar:**

*Adım 0 — Next.js'e geçiş*
- Ortam doğrulandı: Node v24.19.0, npm 11.17, `gh` 2.97 yetkili
- Next.js 16.2 hattının son kararlı sürümü tespit edilip sabitlendi: **16.2.12**
- `create-next-app@16.2.12` ile iskelet kuruldu (App Router + TypeScript + Tailwind v4 + ESLint), geçici dizinde üretilip mevcut projeye birleştirildi
- Tailwind CDN kaldırıldı; palet `app/globals.css` içindeki `@theme` bloğuna taşındı
- Palete `paprika-400/500/600` turuncu tonları eklendi
- Marcellus, Google Fonts CDN'inden çıkarıldı: tam TTF indirilip woff2'ye çevrildi (17,9 KB), repoya kondu, `next/font/local` ile servis ediliyor
- Dil seçim ekranı `app/page.tsx` + `app/layout.tsx` olarak taşındı; görünüm birebir korundu
- Varlıklar `assets/` → `public/` taşındı; `index.html`, `assets/`, Next'in örnek SVG'leri ve kök dizindeki boş `huzur pide` dosyası silindi
- `.gitignore` Next projesine göre yeniden yazıldı
- `sharp` kurulum betiği onaylandı (npm 11'in `allow-scripts` kapısı) — `next/image` için gerekli

*Adım 1 — GitHub*
- `gh auth status` kontrol edildi: `Zeynepsoykan99`, scope `repo` — ek yetkilendirme gerekmedi
- `huzur-pide` **private** reposu oluşturuldu, `origin` remote'u bağlandı
- Push öncesi içerik raporlanıp onay alındı; 7 commit gönderildi, `main` upstream ayarlandı

*Adım 2 — Veri modeli*
- `data/menu.ts` oluşturuldu: menünün tek kaynağı, hiçbir içerik bileşenlere gömülmüyor
- Dört dili taşıyan `Cevrilebilir` tipi: `tr` zorunlu, `en`/`ar`/`ru` opsiyonel
- 5 kategori, 31 ürün Türkçe girildi; diğer dillerin alanları hiç yazılmadı
- Çok sütunlu fiyat: pidelerde 3 sütun, diğerlerinde tek; Lahmacun'un olmayan iki fiyatı `null`
- Teyit edilmemiş 4 fiyat hücresi `dogrulandi: false` ile işaretlendi
- İçecekler `huzurpide.com.tr/menu` adresinden alındı, onayın sonrası doğrulanmış olarak girildi
- Yardımcılar: `metin()`, `fiyatYaz()`, `kategoriBul()`, `dogrulanmamisFiyatlar()`, `eksikCeviriler()`
- Veri, verilen listeye karşı **programatik olarak** doğrulandı: geçici bir betik ürün sırasını, adlarını ve her fiyat hücresini tek tek karşılaştırdı — 31 üründe sıfır uyuşmazlık. Betik doğrulama sonrası silindi.

*Adım 3 — Ekran A: Kategori listesi*
- `app/menu/page.tsx`: basılı menülerdeki içindekiler sayfası mantığında liste
- Her satırda kategori adı, noktalı ayraç, sağda sayfa numarası
- Noktalı ayraç için boş bir eleman kullanıldı; içine sıfır genişlikli boşluk konarak metin temel çizgisi kazandırıldı, böylece ad ve sayfa numarasıyla aynı hizaya oturuyor
- `components/UstBaslik.tsx` yazıldı: her menü sayfasının üstünde "Huzur Pide" başlığı; başlığa basınca dil seçim ekranına dönülüyor

*Adım 4 — Ekran B: Kategori sayfaları*
- `app/menu/[kategori]/page.tsx`: beş kategori sayfası tek şablondan üretiliyor, `generateStaticParams` ile hepsi statik
- Tek fiyatlı kategoriler: esnek satırlar, ad — noktalı ayraç — fiyat
- Çok fiyatlı kategori (kapalı pideler): gerçek `<table>`, üç fiyat sütunu ve sütun başlıkları
- Görsel yuvası: mobilde 3,5rem'lik kare küçük görsel satırın başında, `md` ve üstünde 11rem'lik 16:9 görsel bir başta bir sonda alternatif
- Uzun ürün adları için `items-baseline-last`: ad iki satıra taştığında noktalar ve fiyat adın son satırının hizasına oturuyor

*Adım 5 — Görseller*
- `huzurpide.com.tr` taranıp menümüzdeki ürünlerle **kesin eşleşen** 7 görsel indirildi
- `sharp` ile 800x450 webp'e dönüştürüldü (kalite 78, merkezden kırpma)
- Toplam 396 KB; kaynak dosyalara göre %28–87 küçülme
- `next/image` ile `sizes="(min-width: 768px) 176px, 56px"` — telefona 800px'lik dosya inmiyor

*Adım 6 — Doğrulama*
- 7 sayfa x 3 genişlik (390/768/1280) = **21 kontrol**, LTR'de yatay taşma yok
- Aynı 21 kontrol `dir="rtl"` ile tekrarlandı — yine yatay taşma yok
- Kontrast, sayfada gerçekten kullanılan her metin rengi tarayıcıdan okunarak ölçüldü (yarı saydam renkler zemine karıştırıldı), üç zemin üzerinde: `cream-50`, `cream-100` ve satır hover'ı
- Uzun ad testi: Arapça ve Rusça uzun karşılıklar enjekte edilip 390px RTL'de denendi
- `npx tsc --noEmit`, `npm run lint`, `npm run build` — üçü de temiz
- Konsol: 21 sayfa yüklemesinde 0 hata, 0 uyarı

---

**Oluşturulan/Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `app/layout.tsx` | yeni — kök layout, `next/font/local`, metadata |
| `app/page.tsx` | yeni — dil seçim ekranı (taşındı) |
| `app/globals.css` | yeni — `@theme` paleti, taban katmanı, bileşen sınıfları |
| `app/menu/page.tsx` | yeni — Ekran A |
| `app/menu/[kategori]/page.tsx` | yeni — Ekran B |
| `app/fonts/Marcellus-Regular.woff2` | yeni — 17,9 KB |
| `components/UstBaslik.tsx` | yeni — sayfa başlığı |
| `data/menu.ts` | yeni — menü verisi |
| `public/urunler/*.webp` | yeni — 7 ürün görseli, 396 KB |
| `public/flags/*.svg`, `public/logo.svg`, `public/favicon.svg` | taşındı |
| `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs` | yeni |
| `.gitignore` | yeniden yazıldı |
| `index.html`, `assets/**`, `huzur pide` | silindi |

---

**Alınan kararlar:**

*Next.js'e geçiş*
- **16.2.12'ye tam sürümle sabitlendi**, `^` ile değil. QR menüde beklenmedik bir minor güncellemenin tasarımı bozma riski, otomatik yama almanın faydasından büyük.
- **Tailwind v4** (Next 16 varsayılanı). `tailwind.config.js` yok; palet `@theme` bloğunda. İsimlendirilmiş renk isteği karşılanıyor, sadece tanım yeri değişti.
- **`hoverOnlyWhenSupported` kaldırıldı** — v4'te varsayılan davranış.
- **Marcellus tek dosyada, tam karakter kümesiyle.** Google fontu `latin` + `latin-ext` diye ikiye bölüyor; Türkçe'de ş/ğ latin-ext'te, ç/ı latin'de. `next/font/local` alt küme başına `unicode-range` desteklemediği için iki dosya doğru çalışmazdı. Tam TTF (42 KB) indirilip woff2'ye sıkıştırıldı: 17,9 KB tek dosya, iki alt kümenin toplamından (23,4 KB) küçük.
- **`next/font/google` değil `next/font/local`** — google varyantı da kendi alan adımızdan servis eder ama derleme anında Google'a bağlanır. Dosya repoda olunca derleme de çevrimdışı çalışıyor.
- **Marcellus'ta kiril ve arap alfabesi yok.** Sadece başlıklarda kullanılıyor; Rusça/Arapça başlıklarda tarayıcı `Georgia → serif` yedeğine düşecek. Gövde metni zaten sistem fontlarında.
- **Bayrak ve logo için `next/image` değil `<img>`** — dört bayrağın oranı farklı ve `w-auto` ile ölçekleniyorlar, `next/image` sabit boyut istiyor; 300 byte'lık SVG'de optimizasyonun kazancı da yok. Ürün fotoğraflarında `next/image` düzgün kullanıldı.

*Veri modeli*
- **Eksik çeviri için boş string değil, alanın hiç yazılmaması.** `en: ""` ile alanın olmaması farklı şeyler: birincisi "çevrildi ama boş", ikincisi "henüz çevrilmedi". `eksikCeviriler()` bu ayrım sayesinde çalışıyor.
- **`tr` zorunlu, diğer diller opsiyonel** — eksik çeviri derleme hatası vermiyor, ama `metin()` çeviri yoksa Türkçe'ye düşüyor, ekranda hiçbir zaman boşluk kalmıyor.
- **Fiyat sayı değil, `{ sutun, tutar, dogrulandi }` nesnesi.** Doğrulama bayrağı hücre seviyesinde olmalıydı: Kaşarlı'nın 1,5 Hamur fiyatı teyitli ama 1 Hamur ve Düble değil.
- **`tutar: null` = "bu sütunda satılmıyor"** — `0` yazmak "bedava" demek olurdu; ekranda tire gösteriliyor.
- **`sayfaNo` veriye kondu**, ekranda hesaplanmadı — bu bir içerik kararı, admin panelinden düzenlenecek.

*Tasarım*
- **Kapalı pideler için gerçek `<table>` kullanıldı.** İlk sürüm CSS ızgarasıyla yazılmıştı; ölçüm, başlık satırının ayrı bir ızgara olması yüzünden "1 Hamur" sütununun fiyat hücrelerinden **23,7px kaymış** olduğunu gösterdi. Tabloya geçilince beş sütunun da sağ kenarı piksel piksel oturdu. Ek kazanç: `<th scope="col">` sayesinde ekran okuyucu her hücrenin hangi sütuna ait olduğunu kendiliğinden söylüyor.
- **Görsel alternasyonu `order` ile yapıldı**, `ml/mr` ile değil. `order` yazma yönüne göre çalıştığı için `dir="rtl"` verildiğinde alternasyon da kendiliğinden aynalanıyor.
- **Alternasyon sayacı ürün indeksi değil, görselli ürün sayacı.** Aradaki görselsiz ürünler sırayı bozmasın diye.
- **Kapalı pide sayfasında görsel taraf değiştirmiyor**, hep satırın başında duruyor. Üç fiyat sütunlu bir tabloda görselin sağa sola atlaması hem tablo yapısıyla çelişiyor hem de sütun hizasını bozuyordu. Alternasyon tek fiyatlı kategorilerde (Izgara, Tatlı) uygulanıyor — asıl okunduğu yer orası.
- **`items-baseline-last`**: ürün adı iki satıra taştığında noktalar ve fiyat adın **son** satırının hizasına oturuyor. Düz `items-baseline` ile fiyat ilk satırın yanına, yani adın ortasına denk geliyordu.
- **Fiyat hücrelerine `whitespace-nowrap`.** Uzun Arapça adlar sütunu sıkıştırdığında "400" ile ₺ alt alta düşüyordu; ad sütunu zaten esnek, sarması gereken o.
- **Ekran A'daki kategori adları 24px'e büyütüldü.** Ölçüm, 18px/400 turuncu metnin normal metin sayıldığını ve 4,5:1 eşiğini geçemediğini gösterdi (satır hover'ında 3,54:1'e kadar düşüyordu). 24px WCAG'ın "büyük metin" eşiği, orada eşik 3:1 oluyor ve rahat geçiliyor. Fontu koyulaştırmak da bir seçenekti ama Marcellus'un tek ağırlığı var, tarayıcı sahte kalın üretirdi.
- **`paprika-500` büyük metinde, `paprika-600` küçük metinde.** İki duraklı skala tam bu yüzden tanımlanmıştı.
- **Sayfa numaraları içerik hacmine göre verildi** (~8 satır + 1 görsel ≈ 1 basılı sayfa): pide 1-2, ızgara 3-4, salatalar 5, tatlı 6, içecekler 7.
- **Ekran A'nın satırları kategori sayfalarına bağlandı.** İçindekiler sayfasının doğası bu; ayrıca bağlanmasa Ekran B'ye ulaşmanın yolu kalmazdı. Dil seçim ekranındaki butonlar ise işlevsiz bırakıldı — dil mantığı Aşama 3'te.
- **Görsel yuvası mobilde boşken de duruyor** (3,5rem), `md` üstünde kapanıyor. Telefonda bütün ürün adlarının aynı hizada başlaması için; masaüstünde boş yuva yer israfı olurdu.

*Görseller*
- **Yalnızca ürünle kesin eşleşen görseller alındı.** Kaşarlı için sitedeki "Peynirli Pide", Komposto için "Komposto (Çilek)" kullanılmadı — ikisi de farklı ürün. Veri dosyasına bunu açıklayan yorum bırakıldı ki ileride yanlışlıkla doldurulmasın.
- **Menümüzde olmayan ürünlerin görselleri alınmadı** (çorbalar, dönerler, spesiyaller, hamburgerler).
- **800x450, kalite 78, merkezden kırpma.** Kaynaklar 16:9; mobil kare küçük görsel `object-cover` ile kırpılıyor. 800px, retina ekranda 176px'lik masaüstü gösterimi için yeterli üst sınır.

---

**Ölçüm sonuçları:**

*Yatay taşma — 7 sayfa x 3 genişlik x 2 yön = 42 kontrol*

| Yön | Kontrol | Taşan |
|---|---|---|
| LTR | 21 | 0 |
| RTL | 21 | 0 |

*Kontrast (sayfada kullanılan her metin rengi, üç zemin üzerinde)*

| Metin | Punto/Ağırlık | Tür | Eşik | cream-50 | cream-100 | hover | Sonuç |
|---|---|---|---|---|---|---|---|
| Kategori adı (Ekran A) | 24 / 400 | büyük | 3:1 | 4.38 | 3.86 | 3.54 | ✓ |
| Kategori başlığı (Ekran B) | 30 / 400 | büyük | 3:1 | 4.38 | 3.86 | — | ✓ |
| "Huzur Pide" | 24 / 400 | büyük | 3:1 | 9.83 | 8.68 | 7.96 | ✓ |
| Ürün adı | 16 / 500 | normal | 4.5:1 | 9.83 | 8.68 | — | ✓ |
| Fiyat | 14 / 600 | normal | 4.5:1 | 9.83 | 8.68 | — | ✓ |
| Sayfa no / alt metin | 12–14 / 600 | normal | 4.5:1 | 6.25 | 5.51 | 5.05 | ✓ |

*Diğer*

- `npx tsc --noEmit`: temiz
- `npm run lint`: temiz
- `npm run build`: hatasız, 9 sayfa statik üretildi (5 kategori dahil)
- Konsol: 21 sayfa yüklemesinde **0 hata, 0 uyarı**
- İçindekiler satır yüksekliği 61px (WCAG 2.5.5 dokunma hedefi eşiğinin üzerinde)
- Ürün görselleri toplam 396 KB

---

**Bu aşamada bilinçli olarak yapılmayanlar:**
- Dil değiştirme mantığı, arama, filtre, sepet — istendiği gibi yalnızca tasarım
- `en`/`ar`/`ru` çevirileri girilmedi; yapı hazır, alanlar boş
- Dil seçim ekranındaki butonlar hâlâ işlevsiz
- `dir="rtl"` varsayılan olarak uygulanmadı, sadece test edildi

**Eksik kalan / karar bekleyen:**
- Referans menü görseli bana ulaşmadı; yerleşim sözlü tarife göre kuruldu
- 31 üründen 24'ünün görseli yok (Kaşarlı, Sucuklu, Lahmacun, Künefe, Çoban Salata, içeceklerin tamamı ve ızgaraların çoğu)
- 4 fiyat hücresi hâlâ teyit edilmemiş: Kıymalı/1 Hamur, Kaşarlı/1 Hamur, Kaşarlı/Düble, Kabak Tatlısı

**Sıradaki adım:** Aşama 3 — dil değiştirme mantığı ve çevirilerin girilmesi. `en`/`ar`/`ru` için 50'şer alan bekliyor; çeviriler birlikte girilecek. Bu aşamanın planı ayrıca çıkarılıp onaya sunulacak.

=== RAPOR SONU ===

---

## Aşama 3 — Çok Dillilik ve Dil Değiştirme · 2026-08-27

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 3 — Çok Dillilik (Adım 1–6, tamamı)

---

**Yapılanlar:**

*Adım 1 — GitHub sorunu*
- Depo üç ayrı kaynaktan doğrulandı: yerel takip referansı, `git ls-remote` ile uzak depo, GitHub API'sinden `main` dalının ucu — üçü de aynı SHA (`afbda64`)
- Teşhis: depoda sorun yoktu, sorun görünürlüktü. Private depo yalnızca sahibinin oturumunda görünür.
- Onayınla depo **public** yapıldı (`gh repo edit --visibility public`)
- Depo adı değiştirilmedi

*Adım 2 — Görsel yer tutucuları*
- `gorsel` alanı opsiyonel olmaktan çıkıp **zorunlu ve nullable** oldu (`Gorsel | null`); fotoğrafı olmayan 24 ürünün her birinde artık açık bir `gorsel: null,` satırı var
- `gorselsizUrunler()` yardımcısı eklendi
- `components/UrunGorseli.tsx`: fotoğraf varsa `next/image`, yoksa yer tutucu
- Yer tutucu gerçek görselle birebir aynı ölçüde (mobilde 3,5rem kare, `md` üstünde 11rem 16:9) — fotoğraf eklendiğinde satır hizası hiç değişmiyor
- İçinde logodaki pide silüetinin sadeleştirilmiş hâli; `cream-200` zemin, `latte-600/20` ince kenarlık, gölge yok

*Adım 3 — Ürün içerikleri*
- 31 ürünün tamamı için Türkçe içerik önerisi hazırlanıp onayına sunuldu; 9 kalemde tahmin yürütüldüğü ayrıca işaretlendi
- Onay sonrası `icerik` alanı eklendi ve 28 ürünün Türkçe açıklaması girildi
- Kola, Fanta ve Su'da `icerik: null` — dört dilde de kendilerini anlatıyorlar
- `icerikMetni()`: Türkçe'de **her zaman** null döner; açıklama yalnızca en/ar/ru'da render ediliyor

*Adım 4 — Çeviriler*
- Yaklaşım onaylandı: Türkçe yemek adı korunur, parantez içinde o dildeki karşılığı verilir
- Girilen çeviriler: 5 kategori adı, 4 sütun başlığı, 31 ürün adı, 28 içerik, 7 görsel alt metni, 10 arayüz metni
- `data/arayuz.ts` oluşturuldu: arayüz metinleri menü verisinden ayrı tutuluyor
- `eksikCeviriler()` artık `icerik` alanını da kontrol ediyor; üç dilde de **sıfır eksik**

*Adım 5 — Dil değiştirme işlevi*
- Rota yapısı dil önekli hâle getirildi: `/[dil]/menu/[kategori]`
- Uygulamanın tamamı `app/[dil]/` altına taşındı; kök layout `<html lang>` ve `<html dir>` değerlerini URL'den okuyor
- `/` adresi `next.config.ts` içinde `/tr`'ye yönlendiriliyor
- Dil seçim ekranındaki butonlar artık gerçek bağlantı: `/ar/menu` gibi
- `components/DilKontrolu.tsx`: her menü sayfasının başlığı altında bayrak + kısaltma sırası; aktif dil `aria-current="true"` ve sütlü kahve zeminle işaretli
- Dil değiştirince aynı sayfada kalınıyor (`/tr/menu/tatlilar` → `/ar/menu/tatlilar`)
- Geçersiz dil kodu 404 veriyor (`/xx/menu`)

*Adım 6 — Doğrulama*
- 4 dil × 7 sayfa × 3 genişlik = **84 yatay taşma kontrolü**
- Kontrast: dört dilde beş sayfa taranıp gerçekten kullanılan **14 ayrı metin kombinasyonu** ölçüldü, dört zemin üzerinde (cream-50, cream-100, satır hover'ı, aktif dil rozeti)
- Dil değiştirme davranışı tarayıcıda tıklanarak doğrulandı
- Font yedeği dört dilde incelendi
- `tsc`, `lint`, `build`, konsol

---

**Oluşturulan/Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `app/[dil]/layout.tsx` | taşındı + yeniden yazıldı — `<html lang dir>` URL'den |
| `app/[dil]/page.tsx` | taşındı + yeniden yazıldı — dil seçimi, butonlar artık bağlantı |
| `app/[dil]/menu/page.tsx` | taşındı — Ekran A, dört dilde |
| `app/[dil]/menu/[kategori]/page.tsx` | taşındı — Ekran B, dört dilde, içerik açıklamalı |
| `components/DilKontrolu.tsx` | yeni — dil değiştirme kontrolü |
| `components/UrunGorseli.tsx` | yeni — fotoğraf veya yer tutucu |
| `components/UstBaslik.tsx` | güncellendi — dil parametresi ve dil kontrolü |
| `data/arayuz.ts` | yeni — 10 arayüz metni, dört dil |
| `data/menu.ts` | güncellendi — dört dil, içerik alanı, dil yardımcıları |
| `app/globals.css` | güncellendi — yer tutucu, dil kontrolü, içerik stilleri |
| `next.config.ts` | güncellendi — `/` → `/tr` yönlendirmesi |

---

**Alınan kararlar:**

*GitHub*
- **Teşhis önce üç kaynaktan doğrulandı**, yerel `origin/main` referansına güvenilmedi. Yerel takip referansı bayat olabilir; `git ls-remote` ve GitHub API doğrudan uzak depoyu sorguluyor.
- **Depo adı ve görünürlüğü kendiliğinden değiştirilmedi**, önce soruldu.

*Yer tutucular*
- **`gorsel` alanı opsiyonel değil, zorunlu ve nullable yapıldı.** Opsiyonel bırakılsaydı fotoğrafı olmayan ürün veri dosyasında hiçbir iz bırakmazdı; şimdi 24 satır açıkça duruyor ve fotoğraf gelince o satırı doldurmak yetiyor.
- **Yer tutucu fotoğrafla aynı ölçüde.** Küçük tutulsaydı fotoğraf eklendiğinde satır yüksekliği değişir, düzen oynardı.
- **Yer tutucu çizgiyle değil dolguyla çizildi.** İlk sürüm ince konturluydu; mobilde 56px'lik kutuda çizgi kalınlığı 1px'in altına düşüp kayboluyordu. İki farklı dolgu opaklığı şekli her boyutta okunur tutuyor.
- **Gölge verilmedi.** Yer tutucu öne çıkmamalı; fotoğraflarda gölge var, yer tutucuda yok — bu fark bilinçli.

*İçerik ve çeviri*
- **Türkçe açıklama veride var ama ekranda yok.** Yerel müşteri ürünü zaten tanıyor; açıklama yalnızca yabancı dillerde gösteriliyor. Türkçe metin çevirilerin kaynağı ve işletmenin onayladığı hâli, o yüzden silinmedi.
- **Ad çevirisinde üç istisna uygulandı:** (1) O dilde yerleşik ad varsa parantez yok — Arapça'da *لحم بعجين*, *كنافة*; Rusça'da *Компот*. (2) Türkçe ad zaten parantez taşıyorsa ikincisi eklenmedi. (3) Tanımlayıcı adlar düz çevrildi — "Et Izgara 1 KG" bir yemek adı değil, tarif.
- **Soda ve Meyveli Soda'da Türkçe ad bilinçli olarak korunmadı.** İngilizce'de "soda" gazlı meşrubat demek, Türkçe'de maden suyu. Ad korunsaydı yabancı müşteri yanlış şey sipariş ederdi.
- **Arayüz metinleri menü verisinden ayrı dosyada.** Menü içeriği ileride admin panelinden düzenlenecek; "Menüye dön" yazısı panelde düzenlenebilir olmamalı.
- **Eksik çeviri için boş string değil, alanın hiç yazılmaması** kuralı korundu.

*Dil yönlendirmesi*
- **URL tabanlı, çerez veya `localStorage` değil.** QR menüde müşteri linki paylaşıyor: Arapça menüyü paylaşan müşterinin arkadaşı da Arapça açmalı. Çerezle tutulsaydı link dili taşımazdı.
- **Uygulamanın tamamı `[dil]` altında.** Next.js'te `<html>` etiketini yalnızca kök layout basabiliyor ve kök layout route parametresini ancak kendisi dinamik bir segmentin altındaysa okuyabiliyor. Bu yüzden dil seçim ekranı da `/tr`, `/en`, `/ar`, `/ru` olarak dört kopya hâlinde üretiliyor — her biri kendi dilinde ve Arapça olanı RTL.
- **Bunun bir yan etkisi var:** `/` artık gerçek bir sayfa değil, `/tr`'ye yönlendiriyor. Planda "`/` dilden bağımsız dil seçimi" demiştim; çerçevenin kısıtı yüzünden değişti. QR kodu doğrudan `/tr` adresine bakarsa yönlendirme hiç çalışmaz.
- **Kazanç:** Arapça sayfalar daha ilk baytta `dir="rtl"` ile geliyor. Sayfa önce soldan sağa çizilip sonra aynalanmıyor.
- **Dil değiştirme için JavaScript yok.** Her seçenek düz bir bağlantı; 4 dil × 5 kategori = 20 kategori sayfası derleme anında statik üretiliyor, sunucuda hesap yapılmıyor.
- **Dil değiştirince aynı sayfada kalınıyor.** Kontrol, dil önekinden sonraki yolu parametre olarak alıyor.
- **Bayrak + kısaltma birlikte** (senin tercihin). 390px'te sığması için bayrak 14px, punto 12px, iç boşluk dar tutuldu; dokunma hedefi `min-h-9` (36px) ile korundu.
- **Aktif dil yalnızca renkle değil**, zemin ve kenarlıkla da ayrılıyor — renk körlüğü için.

*Tasarım düzeltmeleri*
- **İçerik açıklaması ilk sürümde yanlış yere düşüyordu.** Pide tablosunda `ayrac-satir` flex kapsayıcısının içine konmuştu, böylece noktalarla aynı satırda bir flex öğesi hâline gelip adın yanına sıkışıyordu. Ad + noktalar üst satırda, açıklama altında ayrı blok olarak ayrıldı.
- **Açıklamaya `font-normal` verildi.** Pide tablosunda açıklama `<th scope="row">` içinde duruyor ve `th` varsayılan olarak kalın; açıklama da kalın geliyordu.
- **Dil seçim ekranındaki ayraç noktası kendi rengini bıraktı.** Sütlü kahve tonda 12px'lik bir nokta AA eşiğini geçemiyordu (en düşük 2,45:1); artık paragrafın rengini miras alıyor.

---

**Ölçüm sonuçları:**

*Yatay taşma — 4 dil × 7 sayfa × 3 genişlik*

| Kontrol | Taşan |
|---|---|
| 84 | **0** |

*Kontrast — dört dilde kullanılan 14 metin kombinasyonu, dört zemin üzerinde*

| Metin | Punto/Ağırlık | Tür | Eşik | En düşük | Sonuç |
|---|---|---|---|---|---|
| Kategori adı (Ekran A) | 24 / 400 | büyük | 3:1 | 3.17 | ✓ |
| Kategori başlığı (Ekran B) | 30 / 400 | büyük | 3:1 | 3.17 | ✓ |
| Slogan / "Menü" / sütun başlığı | 12–14 / 400–600 | normal | 4.5:1 | 4.53 | ✓ |
| Dil kısaltması (pasif) | 12 / 600 | normal | 4.5:1 | 4.53 | ✓ |
| Ürün içerik açıklaması | 12 / 400 | normal | 4.5:1 | 4.53 | ✓ |
| "Menüye dön" | 14 / 600 | normal | 4.5:1 | 4.53 | ✓ |
| "Huzur Pide" | 24–36 / 400 | büyük | 3:1 | 7.12 | ✓ |
| Dil adı (seçim ekranı) | 20–24 / 600 | büyük | 3:1 | 7.12 | ✓ |
| Dil kısaltması (aktif) | 12 / 600 | normal | 4.5:1 | 7.12 | ✓ |
| Ürün adı / fiyat | 14–16 / 500–600 | normal | 4.5:1 | 7.12 | ✓ |

**14 kombinasyonun tamamı geçiyor, başarısız kalan yok.**

*Diğer*

- `npx tsc --noEmit`: temiz
- `npm run lint`: temiz
- `npm run build`: hatasız, **30 sayfa statik üretildi** (4 dil ekranı + 4 menü + 20 kategori + not-found)
- Konsol: 84 sayfa yüklemesinde **0 hata, 0 uyarı**
- Rota testi: `/tr` `/en` `/ar` `/ru` `/tr/menu` `/ar/menu` `/ar/menu/kapali-pide` `/ru/menu/izgara` → hepsi 200; `/xx/menu` → 404; `/` → 307 → `/tr`
- Dil değiştirme: `/tr/menu/tatlilar` üzerinde AR'ye tıklandı → `/ar/menu/tatlilar`, `<html lang="ar" dir="rtl">`, başlık "الحلويات", ilk ürün "كنافة" — sayfa korundu

---

**Bilinen sorun — font yedeği (çözülmedi, istendiği gibi):**

Marcellus'un karakter kümesi latin + latin-ext. Kiril ve Arap alfabesi yok.

| Dil | Başlıklarda kullanılan font | Nasıl görünüyor |
|---|---|---|
| Türkçe | Marcellus | Tasarlandığı gibi |
| İngilizce | Marcellus | Tasarlandığı gibi |
| Rusça | Georgia (yedek) | Kabul edilebilir — Georgia'nın Kiril desteği iyi, klasik bir serif. Marcellus'tan biraz daha kalın ve geniş duruyor, marka karakteri zayıflıyor. |
| Arapça | Sistem naskh serifi (Georgia'da da Arapça yok, zincir generic serif'e düşüyor) | Okunaklı ama nötr. Marcellus'un klasik havasıyla ilgisi yok; Windows'ta Times New Roman'ın Arapça yüzü çıkıyor, başka işletim sistemlerinde başka bir font çıkacak — yani görünüm cihazdan cihaza değişiyor. |

"Huzur Pide" marka adı latin harfli olduğu için dört dilde de Marcellus'la render ediliyor — marka tutarlılığı korunuyor. Sorun yalnızca kategori başlıklarında.

Font kararını birlikte vereceğiz.

---

**Karar bekleyen / eksik kalan:**
- Arapça çevirilerin bir ana dili konuşan tarafından gözden geçirilmesi öneriliyor (özellikle Türkçe adın harf çevirisiyle yazıldığı kalemler: كاشارلي, كاريشيك, ساتش كافورما)
- 24 ürünün fotoğrafı hâlâ yok — yer tutucu gösteriliyor
- 4 fiyat hücresi teyit edilmemiş: Kıymalı/1 Hamur, Kaşarlı/1 Hamur, Kaşarlı/Düble, Kabak Tatlısı
- Marcellus'un Arapça ve Kiril'de yedeğe düşmesi
- Referans menü görseli hiç ulaşmadı; yerleşim sözlü tarife göre kuruldu

**Sıradaki adım:** Font kararı ve eksik fotoğraflar. İkisi de senin girdine bağlı.

=== RAPOR SONU ===

---

## Aşama 4 — Ana Seçim Ekranı · 2026-08-27

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 4 — Ana Seçim Ekranı (Adım 1–5, tamamı)

---

**Yapılanlar:**

*Adım 1 — Çeviriler*
- `data/arayuz.ts`'e dört yeni metin eklendi, dördü de dört dilde:
  `organizasyon`, `bolumSecin`, `yakinda`, `anaEkranaDon`
- Kullanılmayan hale gelen `anaSayfa` anahtarı kaldırıldı
- Veri dosyasına, "organization" (kurum) ile karıştırılmaması için açıklayıcı yorum bırakıldı

*Adım 2 — Ana seçim ekranı*
- `app/[dil]/secim/page.tsx` oluşturuldu, dört dilde statik üretiliyor
- İki kart: Menü → `/[dil]/menu`, Organizasyon → `/[dil]/organizasyon`
- `components/Ikonlar.tsx`: `PideIkonu` ve `SofraIkonu`
- `.secim-karti` stili: yükseklik 96px, ikon 40–44px, başlık gösterim fontunda 24–30px

*Adım 3 — Organizasyon sayfası*
- `app/[dil]/organizasyon/page.tsx` oluşturuldu, dört dilde statik
- Üst başlık + dil kontrolü diğer sayfalarla aynı
- Ortada "hazırlanıyor" bloğu: sofra ikonu + tek satır metin
- Altında "Ana ekrana dön" bağlantısı
- Hizmet, kapasite, iletişim gibi hiçbir bilgi eklenmedi — elimizde yok

*Adım 4 — Bağlantı güncellemeleri*
- Dil seçim butonları `/[dil]/menu` yerine `/[dil]/secim`'e bağlandı
- `UstBaslik`'teki logo/marka bağlantısı `/[dil]` yerine `/[dil]/secim`'e gitti; erişilebilir etiketi de "Ana ekrana dön" oldu
- Dil seçim ekranına dönüş yolu başlıktaki dil kontrolü üzerinden korundu

*Adım 5 — Doğrulama*
- 4 dil × 9 sayfa × 3 genişlik = **108 yatay taşma kontrolü**
- Kontrast: dört dilde beş sayfa taranıp **16 metin kombinasyonu** ölçüldü; sayfa zeminlerinde beş farklı arka plan, kart üzerindeki metinler kart ve kart-hover zeminlerinde
- Akış uçtan uca tarayıcıda tıklanarak izlendi
- Rota testi, konsol, `tsc`, `lint`, `build`

---

**Oluşturulan/Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `app/[dil]/secim/page.tsx` | yeni — ana seçim ekranı |
| `app/[dil]/organizasyon/page.tsx` | yeni — organizasyon (içerik bekliyor) |
| `components/Ikonlar.tsx` | yeni — pide ve sofra ikonları |
| `data/arayuz.ts` | güncellendi — 4 yeni metin, 1 kullanılmayan kaldırıldı |
| `app/[dil]/page.tsx` | güncellendi — dil butonları `/secim`'e |
| `components/UstBaslik.tsx` | güncellendi — logo `/secim`'e |
| `app/globals.css` | güncellendi — kart ve "hazırlanıyor" stilleri |

---

**Alınan kararlar:**

*Rota*
- **Mevcut rotalara hiç dokunulmadı**, iki yeni rota eklendi. `/[dil]` hâlâ dil seçimi ve QR'ın indiği yer; ana seçim `/[dil]/secim`'e geldi. Ana seçimi `/[dil]`'e taşımak, çalışan giriş noktasını değiştirmek olurdu — kazancı yok, riski var.
- **Slug'lar Türkçe** (`secim`, `organizasyon`), mevcut `kapali-pide` / `izgara` ile tutarlı.
- **`UstBaslik` logosu artık dil seçimine değil ana seçime dönüyor.** Uygulamanın bir "ana ekranı" olduğu andan itibaren logonun oraya dönmesi doğru davranış; dil değiştirmek isteyen zaten başlıktaki dil kontrolünü kullanıyor.

*İki ekranın ayrışması*
- **Ayrışma içerikle değil yapıyla sağlandı.** Dil ekranı kimlik ağırlıklı kaldı (80px logo, 48px marka, slogan, dikeyde ortalanmış). Ana seçim ekranı **menü sayfalarıyla aynı `UstBaslik`'i** kullanıyor (44px logo, 24px marka, dil kontrolü). Böylece dil seçimi "kapı", ana seçim "içerisi" gibi okunuyor — ikinci bir açılış ekranı hissi vermiyor.
- **Kartlar dil butonlarından bilinçli olarak iri:** 96px / 56px yükseklik, 40px ikon, gösterim fontunda başlık. Dil butonlarında gövde fontu ve 20px vardı. Aynı bileşenin tekrarı gibi durmuyor.
- **Kart açıklamaları senin tercihinle çıkarıldı.** Şunu belirtmem gerek: "Organizasyon" kelimesi tek başına, özellikle yabancı müşteride ne anlattığını tam söylemiyor. İkonu bu yüzden anlamlı seçtim (sofra), ama açıklama satırı istersen sonradan eklenebilir — çevirileri hazır.

*İkonlar*
- **Pide ikonu ilk sürümde göz gibi okunuyordu.** Mercek şeklinin içinde ikinci bir mercek vardı; 40px'te tam bir göz. İç mercek kaldırılıp yerine üç malzeme noktası ve üste buhar konunca şekil netleşti. Logoda da tam olarak aynı düzeltme yapılmıştı.
- **Sofra ikonu ilk sürümde film makarası gibi okunuyordu.** Masa ve sandalyelerin hepsi daireydi. Sandalyeler yuvarlak köşeli dikdörtgene çevrilip masaya bakacak şekilde döndürülünce sofra olduğu anlaşılır oldu.
- İkisi de `currentColor` kullanıyor, hover'da başlıkla birlikte koyulaşıyorlar.

*Çeviriler*
- **EN "Events"** — restoran sektöründe standart terim. "Organization" kesinlikle yanlış olurdu (kurum demek). "Special Occasions" daha açıklayıcı ama buton için uzun.
- **AR "المناسبات"** — *munāsabāt*: düğün, nişan, kutlama, anma için Arapça'daki tam karşılık.
- **RU "Банкеты"** — Rusça'da restoranda düğün/kutlama rezervasyonu ararken kullanılan terim.
- **`bolumSecin` ekranda görünmüyor**, yalnızca ekran okuyucu ve sayfa başlığı için. Ekranda ayrı bir başlık istenmemişti; iki kart kendini anlatıyor.

---

**Ölçüm sonuçları:**

*Yatay taşma — 4 dil × 9 sayfa × 3 genişlik*

| Kontrol | Taşan |
|---|---|
| 108 | **0** |

*Kontrast — 16 metin kombinasyonu*

| Metin | Punto/Ağırlık | Zemin | Eşik | En düşük | |
|---|---|---|---|---|---|
| Organizasyon başlığı | 30 / 400 | sayfa | 3:1 | 3.17 | ✓ |
| Kategori adı (Ekran A) | 24 / 400 | sayfa | 3:1 | 3.17 | ✓ |
| Dil adı (seçim ekranı) | 20–24 / 600 | kart | 3:1 | 3.55 | ✓ |
| Kart başlığı (Menü / Organizasyon) | 24–30 / 400 | kart | 3:1 | 3.55 | ✓ |
| "Hazırlanıyor" metni | 16 / 400 | hazırlanıyor bloğu | 4.5:1 | 4.53 | ✓ |
| Diğer 11 kombinasyon | — | — | — | ≥ 4.53 | ✓ |

**16/16 geçiyor, başarısız yok.**

*Akış testi — uçtan uca tarayıcıda tıklanarak*

| Adım | Sonuç |
|---|---|
| `/tr` → RU butonu | `/ru/secim`, `lang=ru` — kartlar "Меню" / "Банкеты" |
| Банкеты kartı | `/ru/organizasyon`, başlık "Банкеты" |
| Dil kontrolünden AR | `/ar/organizasyon`, `lang=ar dir=rtl`, başlık "المناسبات" — **aynı sayfada kalındı** |
| Ana ekrana dön | `/ar/secim`, RTL korundu |
| Menü kartı | `/ar/menu`, kategori listesi |

*Diğer*

- Rota testi: `/tr/secim` `/en/secim` `/ar/secim` `/ru/secim` `/tr/organizasyon` `/ar/organizasyon` `/tr/menu` `/ar/menu/izgara` `/tr` → hepsi 200; `/xx/secim` → 404
- `npx tsc --noEmit`: temiz
- `npm run lint`: temiz
- `npm run build`: hatasız, **30 → 38 sayfa statik** (4 dil × 2 yeni sayfa)
- Konsol: 108 sayfa yüklemesinde **0 hata, 0 uyarı**
- **Mevcut menü akışı bozulmadı** — tüm kategori sayfaları ve dil değiştirme çalışıyor

---

**Karar bekleyen / eksik kalan (Aşama 3'ten devam):**
- Organizasyon sayfasının içeriği: hizmetler, kapasite, iletişim — hiçbiri girilmedi
- Arapça çevirilerin ana dili konuşan biri tarafından gözden geçirilmesi
- 24 ürünün fotoğrafı yok
- 4 fiyat hücresi teyit edilmemiş
- Marcellus'un Arapça ve Kiril'de yedek fonta düşmesi — font kararı bekliyor
- İstersen kart açıklama satırı (çevirileri hazır)

**Sıradaki adım:** Organizasyon içeriği, font kararı ve eksik fotoğraflar — üçü de senin girdine bağlı.

=== RAPOR SONU ===

---

## Aşama 5 — Vercel'de Canlıya Alma · 2026-08-27

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 5 — Vercel Dağıtımı (Adım 1–5, tamamı)

---

**Yapılanlar:**

*Adım 1 — CLI ve hesap durumu*
- Vercel CLI kurulu bulundu: **58.9.1** (v59.7.0 mevcut; güncelleme gerekmediği için yapılmadı)
- Oturum **açıktı**: `zeynepsoykan99`, aktif kapsam `zey-ad23` ("Zey")
- Hiçbir hesap oluşturma veya ilişkilendirme yapılmadı, yalnızca mevcut oturum okundu

*Adım 2 — Dağıtım öncesi kontrol*
- Yerel `main` ile `origin/main` aynı noktada (`2af2369`), fark 0/0 — `git ls-remote` ile uzak depodan doğrulandı
- Commit edilmemiş değişiklik yoktu
- `next build` temiz, 38 statik sayfa
- Ortam değişkeni ihtiyacı yok
- Node: yerel v24.19.0, Vercel varsayılanı 24.x — uyumlu

*Adım 3 — Projeyi bağlama*
- `vercel link` ile `zey-ad23/huzur-pide` projesi oluşturuldu
- GitHub deposu **otomatik bağlandı** (`Zeynepsoykan99/huzur-pide`); `vercel git connect` ile ayrıca doğrulandı
- Framework Next.js olarak kendiliğinden algılandı; kök dizin, build/install komutu, Node sürümü Vercel varsayılanında bırakıldı
- `vercel link` bir `.env.local` (OIDC token) oluşturdu ve `.gitignore`'a `.vercel` + `.env*` ekledi. `.env*` zaten vardı, yinelenen satır temizlendi. **İkisinin de git tarafından yok sayıldığı doğrulandı** — token depoya sızmadı.

*Adım 4 — İlk üretim dağıtımı*
- `vercel --prod` ile dağıtıldı, durum **READY**, build süresi **29 sn**
- Üretim adresi: **https://huzur-pide.vercel.app** (istenen ad boştu, ek almadı)
- Dağıtım kimliği: `dpl_GW6N6fFzL6QTeLEbr5AvjFoTzJuH`
- **Dağıtım koruması kapalı** — canlı adres giriş yapmadan açılıyor, ayar değişikliği gerekmedi

*Adım 5 — Canlı doğrulama*
- HTTP testleri, tarayıcıda görsel doğrulama, 108 taşma kontrolü, varlık bütünlüğü, font ve görsel optimizasyonu, QR gecikme ölçümü

---

**Oluşturulan/Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `.gitignore` | güncellendi — `.vercel` eklendi, yinelenen `.env*` temizlendi |
| `.vercel/project.json` | yeni, **git'e girmiyor** — proje bağlantısı |
| `.env.local` | yeni, **git'e girmiyor** — Vercel OIDC token |

Uygulama kodunda hiçbir değişiklik yapılmadı.

---

**Canlı test sonuçları:**

*Rotalar — hepsi canlı adres üzerinden*

| Test | Sonuç |
|---|---|
| Kök adres | `/` → **307** → `Location: /tr` ✓ |
| Dört dilin giriş sayfaları | `/tr` `/en` `/ar` `/ru` → **200** ✓ |
| Ana seçim ekranı | `/tr/secim` `/en/secim` `/ar/secim` `/ru/secim` → **200** ✓ |
| Organizasyon | `/tr/organizasyon` `/en/organizasyon` `/ar/organizasyon` `/ru/organizasyon` → **200** ✓ |
| Menü listesi | `/tr/menu` `/en/menu` `/ar/menu` `/ru/menu` → **200** ✓ |
| Kategori sayfaları (tr, 5 kategori) | hepsi **200** ✓ |
| Kategori (ar/ru/en örnekleri) | hepsi **200** ✓ |
| Geçersiz rotalar | `/xx/menu` `/tr/menu/olmayan-kategori` `/tr/olmayan-sayfa` `/zz` → **404** ✓ |

*Arapça RTL*

| Sayfa | `<html>` |
|---|---|
| `/ar` | `lang="ar" dir="rtl"` ✓ |
| `/ar/secim` | `lang="ar" dir="rtl"` ✓ |
| `/ar/menu` | `lang="ar" dir="rtl"` ✓ |
| `/ar/organizasyon` | `lang="ar" dir="rtl"` ✓ |
| `/ar/menu/izgara` | `lang="ar" dir="rtl"` ✓ |
| `/tr`, `/ru/menu` (karşılaştırma) | `dir="ltr"` ✓ |

Tarayıcıda görsel olarak da doğrulandı: `/ar/menu/kapali-pide` tam aynalanmış — görseller sağda, fiyat sütunları hizalı, açıklamalar adların altında.

*Varlıklar — indirilip yerel dosyalarla karşılaştırıldı*

| Dosya | HTTP | Tür | Boyut | Yerelle aynı |
|---|---|---|---|---|
| `/logo.svg` | 200 | image/svg+xml | 1.226 B | ✓ |
| `/flags/tr.svg` | 200 | image/svg+xml | 396 B | ✓ |
| `/flags/ae.svg` | 200 | image/svg+xml | 347 B | ✓ |
| `/urunler/kiymali-pide.webp` | 200 | image/webp | 37.464 B | **birebir** ✓ |
| `/urunler/karisik-izgara.webp` | 200 | image/webp | 62.132 B | ✓ |
| `/urunler/sutlac.webp` | 200 | image/webp | 46.166 B | ✓ |
| Marcellus woff2 | 200 | font/woff2 | 17.980 B | **birebir** ✓ |

*Font*

`document.fonts` → `marcellus loaded`. Genişlik ölçümüyle doğrulandı: başlık Marcellus'la 174,1px, Georgia'ya zorlandığında 178,7px — yani font gerçekten uygulanıyor, yedeğe düşmüyor. Kendi alan adımızdan servis ediliyor, Google'a hiçbir istek gitmiyor.

*Görsel optimizasyonu (`next/image`)*

Telefonda 56px gösterilen ürün fotoğrafı için tarayıcı `w=64` sürümü indiriyor:

| Sürüm | Boyut |
|---|---|
| Kaynak `sutlac.webp` | 46.166 B |
| `_next/image?w=256` | 7.022 B |
| `_next/image?w=64` (telefonun indirdiği) | **1.036 B** |

Yani telefona kaynağın **%2,2'si** iniyor. Adım 5'te koyduğumuz `sizes` niteliği işini yapıyor.

*Yerleşim ve konsol*

| Kontrol | Sonuç |
|---|---|
| Yatay taşma (4 dil × 9 sayfa × 3 genişlik) | **108 kontrol, 0 taşma** |
| Konsol | **0 hata, 0 uyarı** |

---

**QR kodunun bakacağı adres**

Ölçüm (8'er örnek, ortalama):

| Adres | Ortalama süre | Yönlendirme |
|---|---|---|
| `https://huzur-pide.vercel.app/` | **0,415 sn** | 1 |
| `https://huzur-pide.vercel.app/tr` | **0,223 sn** | 0 |

Kök adres bir fazladan gidiş-dönüş yapıyor: önce 307 yanıtı (0,21 sn), sonra `/tr` (0,20 sn). **Aradaki fark yaklaşık 190 ms** — masada telefonla açan müşteri için gözle görülür olmasa da ölçülebilir bir gecikme.

İki adresin gösterdiği ekran **aynı**: `/tr` dil seçim ekranı, dört dil butonuyla. Kök adres de oraya gidiyor.

QR kodun karmaşıklığı açısından fark yok — 21 ve 24 karakter aynı QR sürümüne sığıyor.

**Önerim: QR `https://huzur-pide.vercel.app/tr` adresine baksın.** Yönlendirme atlanır, sayfa doğrudan açılır. Kök adres yine çalışmaya devam eder — elle yazan veya eski bir QR'ı okutan müşteri de aynı yere gider. **Karar senin.**

---

**Bundan sonra kod değişikliği canlıya nasıl yansıyacak**

```
kod değişikliği  →  git commit  →  git push origin main
                                          ↓
                              Vercel değişikliği algılar
                                          ↓
                              npm install + next build (~30 sn)
                                          ↓
                     https://huzur-pide.vercel.app güncellenir
```

- **`main`'e her push otomatik üretim dağıtımı tetikler.** Ayrıca bir komut çalıştırmaya gerek yok.
- **Başka bir dala push edilirse** Vercel ayrı bir önizleme adresi üretir; üretim adresi etkilenmez.
- **Build başarısız olursa** dağıtım yayına alınmaz; canlı adres son çalışan sürümde kalır.
- **Geri alma:** Vercel panelinden önceki bir dağıtım "Promote to Production" ile anında geri getirilebilir; yeni build beklenmez.

---

**Yapılmayanlar (istendiği gibi):**
- Alan adı bağlanmadı — Vercel'in ücretsiz adresi kullanılıyor
- Hiçbir plan değişikliği yapılmadı
- Hiçbir koruma/güvenlik ayarı değiştirilmedi
- Vercel'in varsayılan build ayarlarına dokunulmadı

**Hatırlatma:** Vercel'in Hobby planı ticari kullanıma kapalı. Bu bir restoranın müşteri menüsü. "Devam et, sorumluluk bende" dedin ve öyle yapıldı; kapsamın hangi planda olduğunu CLI'dan okuyamıyorum, panelden bakman gerekir.

**Sıradaki adım:** QR adresi kararı. Ayrıca Aşama 3-4'ten bekleyenler duruyor: organizasyon içeriği, font kararı, 24 ürünün fotoğrafı, 4 teyit edilmemiş fiyat, Arapça çevirilerin kontrolü.

=== RAPOR SONU ===

---

## Aşama 6 — Menü Kitabı · 2026-08-27

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 6 — Menü Kitabı (tasarım ve gezinme değişiklikleri, tamamı)

---

**Yapılanlar:**

*1 — Menü sayfalarını bölme*
- `sayfaNo: string` alanı kaldırıldı, yerine `sayfaBolumleri: number[]` geldi
- Kapalı pideler 3+3 = 2 sayfaya, ızgaralar 7+7 = 2 sayfaya bölündü
- Salatalar (1 ürün), Tatlılar (3 ürün), İçecekler (7 ürün) bölünmedi
- `MenuSayfasi` tipi eklendi: kitaptaki tek bir yaprak
- `sayfalariUret()`: MENU'yü `sayfaBolumleri`'ne göre düz sayfa dizisine çeviriyor; toplam tutmazsa derleme anında hata
- `SAYFALAR`: 7 yapraklık kitap dizisi, `sayfaBul()`, `kategorininIlkSayfasi()`, `sayfaAraligi()` yardımcıları
- Kategori listesindeki sayfa numaraları artık veriden türetiliyor (1-2, 3-4, 5, 6, 7)

*2 — Kitap gibi yatay kaydırma*
- `app/[dil]/menu/[kategori]/page.tsx` → `app/[dil]/menu/[sayfa]/page.tsx` olarak yeniden adlandırıldı ve tamamen yazıldı
- Tek bir rota tüm 7 sayfayı **yatay scroll-snap kitap** olarak basıyor
- Saf CSS `scroll-snap-type: x mandatory` — parmak takibi ve ivme tarayıcının native davranışı, JavaScript ile taklit edilmiyor
- `snap-always`: hızlı parmak hareketinde birden fazla sayfa atlanmıyor
- Animasyon yok — istendiği gibi düz geçiş
- İlk konumlandırma gömülü senkron script ile (`scrollIntoView`) — React effect'inden önce çalışıyor, paylaşılan link doğru sayfada açılıyor
- `components/SayfaSayaci.tsx`: `"use client"` bileşeni, `IntersectionObserver` ile aktif sayfayı algılıyor, "3 / 7" sayacını güncelliyor, `history.replaceState` ile URL'i değiştiriyor
- RTL'de (Arapça) kaydırma yönü kendiliğinden tersleniyor, ek kod yazılmadı
- `scrollIntoView` kullanıldı, elle `scrollLeft` hesabı değil — RTL'de `scrollLeft` negatif oluyor ve tarayıcıdan tarayıcıya değişiyordu
- Sayfa içi dikey kaydırma yatay kaydırmayı etkilemiyor (`overscroll-y-contain overscroll-x-auto`)

*3 — Arka plan değişikliği*
- `cream-150: #e7d6c0` rengi paleteye eklendi — düz kraft tonu
- `.kitap-cercevesi` düz kraft zemin kullanıyor, gradyan kaldırıldı
- Değişiklik yalnızca menü sayfalarında; dil seçimi, ana seçim ve kategori listesi eski bej gradyanda kaldı

*4 — Yazı boyutları büyütme*
- Ürün adı: 16px → 18px (sm: 18 → 20)
- Fiyat: 14px → 16px (sm: 16 → 18)
- İçerik açıklaması: 12px → 14px (sm: 14 → 15)
- Sütun başlıkları (pide): 11px → 12px (sm: 12 → 14)
- Pide fiyat hücreleri: 14px → 16px (sm: 16 → 18)
- Görsel yuvası: mobilde 56px → **80px**, md üstünde 176px → **208px**
- Ürün satırı dikey boşluğu: 10px → **16px**
- Tablo hücre iç boşlukları da büyütüldü

*5 — Kompakt başlık*
- `UstBaslik`'e `sikisik` prop'u eklendi — kitap modunda 28px logo, azaltılmış boşluklar, ayraç kaldırıldı
- `DilKontrolu`'na `sikisik` prop'u eklendi — üst boşluk azaltıldı
- Kitap ekran yüksekliğine sığmak zorunda; başlığa harcanan her piksel ürün satırlarından gidiyor

*6 — Eski URL yönlendirmeleri*
- `next.config.ts`'e `/kapali-pide` → `/kapali-pide-1` ve `/izgara` → `/izgara-1` yönlendirmeleri eklendi
- Daha önce paylaşılmış linkler kırılmıyor
- Tek sayfalık kategorilerin slug'ları değişmedi (salatalar, tatlilar, icecekler)

---

**Oluşturulan/Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `app/[dil]/menu/[sayfa]/page.tsx` | yeniden adlandırıldı + tamamen yazıldı — kitap formatı |
| `components/SayfaSayaci.tsx` | yeni — sayaç ve URL senkronu |
| `data/menu.ts` | güncellendi — `sayfaBolumleri`, `MenuSayfasi`, sayfa yardımcıları |
| `app/globals.css` | güncellendi — kitap stilleri, büyütülmüş puntolar, kraft zemin |
| `components/UstBaslik.tsx` | güncellendi — sıkışık varyant |
| `components/DilKontrolu.tsx` | güncellendi — sıkışık varyant |
| `app/[dil]/menu/page.tsx` | güncellendi — türetilmiş sayfa numaraları, ilk sayfaya bağlantı |
| `next.config.ts` | güncellendi — eski kategori adresleri için yönlendirme |

---

**Kitabın yapısı:**

| Sayfa | Slug | Kategori | Ürün |
|---|---|---|---|
| 1 | `kapali-pide-1` | Kapalı Pide Çeşitleri (1/2) | 3 |
| 2 | `kapali-pide-2` | Kapalı Pide Çeşitleri (2/2) | 3 |
| 3 | `izgara-1` | Izgara Çeşitleri (1/2) | 7 |
| 4 | `izgara-2` | Izgara Çeşitleri (2/2) | 7 |
| 5 | `salatalar` | Salatalar | 1 |
| 6 | `tatlilar` | Tatlı Çeşitleri | 3 |
| 7 | `icecekler` | İçecekler | 7 |

Kategori listesindeki numaralar (1-2, 3-4, 5, 6, 7) artık **gerçek sayfaları** gösteriyor.

---

**Alınan kararlar:**

*Sayfa bölme*
- **Salatalar, Tatlılar ve İçecekler bölünmedi.** Salatalar 1, Tatlılar 3 ürün — bölmek yarısı boş sayfa üretirdi. İçecekler 7 ürün ama satırları en kısa olanlar; bölünmüş Izgara sayfalarıyla aynı yoğunlukta.
- **Bölüm toplamı ürün sayısını tutmazsa derleme hata veriyor.** Sessizce ürün kaybetmektense derlemeyi durdurmak doğru; canlıya eksik menüyle çıkılamaz.
- **Sayfa numarası artık veriye elle yazılmıyor, bölümden türetiliyor.** Elle yazıldığında bölme değiştiğinde numara yalan söylerdi.

*Renk*
- **Düz kraft, gradyan yok.** "Kağıt gibi dursun" denildi; kağıdın tonu düzdür.
- **Sadece ürün sayfaları değişti.** Dil seçimi, ana seçim ve kategori listesi eski bej gradyanda kaldı — ayrım "menünün içindesin" demenin bir yolu oldu.

*Yatay kaydırma*
- **Saf CSS scroll-snap.** JavaScript ile taklit edilen kaydırmalar telefonda hantal hisseder.
- **Animasyon yok.** Snap yalnızca hizalar; kağıt kıvrılması, 3B dönme, gölge yok.
- **`snap-always` eklendi:** hızlı parmak hareketinde birden fazla sayfa atlanmıyor.
- **RTL için ek kod yazılmadı** — `dir="rtl"` verildiğinde kaydırma yönü kendiliğinden tersine dönüyor.
- **İlk konumlandırma gömülü senkron script ile.** Effect ilk boyamadan sonra çalışır; paylaşılan link açılırken bir kare boyunca 1. sayfa görünürdü.
- **`scrollIntoView` kullanıldı**, `scrollLeft` değil. RTL'de `scrollLeft` tarayıcıdan tarayıcıya değişiyordu.
- **`replaceState`, `pushState` değil.** Geri tuşu 7 sayfalık yığınla dolmasın.

*JavaScript kaybı*

Statik üretim ve dil değiştirme **bozulmadı**: 46 sayfanın hepsi derleme anında statik, dil değiştirme hâlâ düz bağlantı.

| İşlev | JS varsa | JS yoksa |
|---|---|---|
| Parmakla kaydırma | ✅ | ✅ CSS, etkilenmiyor |
| Menünün tamamını gezme | ✅ | ✅ |
| Sayfa içi dikey kaydırma | ✅ | ✅ |
| Paylaşılan linkte doğru sayfada açılma | ✅ | ❌ 1. sayfada açılır |
| Kaydırdıkça adresin güncellenmesi | ✅ | ❌ |
| Sayacın güncellenmesi | ✅ | ❌ açılış sayfasında kalır |

> **Düzeltme (Aşama 7'de ölçüldü):** Bu tablonun ilk sürümünde "paylaşılan
> linkte doğru sayfada açılma" satırı JavaScript kapalıyken de ✅ yazıyordu.
> Yanlıştı: konumlandırmayı yapan gömülü script de JavaScript, JS kapalıyken
> çalışmıyor. Ölçüm: JS kapalıyken `/tr/menu/izgara-2` açıldığında kitap
> 1. sayfada duruyor ama sayaç "Sayfa 4 / 7" yazıyor — ikisi çelişiyor.
> Senin şartın yine karşılanıyor: sayfaların hepsi belgede, CSS kaydırma
> çalışıyor, müşteri menünün tamamını gezebiliyor.

---

**Yakalanan üç hata:**

1. **Yatay kaydırma hiç çalışmıyordu.** `.kitap-icerik` üzerindeki `overscroll-behavior: contain` iki eksende birden geçerliydi. `overflow-y: auto` verilen elemanda `overflow-x` de otomatik `auto`ya dönüyor, kutu yatayda da kaydırma kabı sayılıyor ve `contain` parmağın yatay hareketini üstteki kaba geçirmiyordu. Sadece Y eksenine `contain` verilerek düzeltildi. **Gerçek dokunmatik testte çıktı.**

2. **Belge yatay kayıyordu.** 7 sayfanın toplam genişliği (2733px) `<html>` seviyesine sızıyordu. `.kitap`'a `contain: paint` verilerek kesildi.

3. **`overflow-x: hidden` yeterli değildi.** `hidden` yalnızca kullanıcı hareketini engelliyor. Taban kural `html, body { overflow-x: clip }` olarak değiştirildi.

---

**Ölçüm sonuçları:**

*Yatay taşma — 4 dil × 11 sayfa × 3 genişlik*

| Kontrol | Taşan |
|---|---|
| **132** | **0** |

*Kontrast — kraft zeminde*

| Metin | Punto/Ağırlık | Tür | Eşik | Oran | |
|---|---|---|---|---|---|
| Kategori başlığı | 24 / 400 | büyük | 3:1 | **4.39** | ✓ |
| Dil kısaltması (pasif) | 12 / 600 | normal | 4.5:1 | **5.02** | ✓ |
| "Menüye dön" | 14 / 600 | normal | 4.5:1 | **5.02** | ✓ |
| İçerik açıklaması | 14 / 400 | normal | 4.5:1 | **5.02** | ✓ |
| Marka adı | 18 / 400 | normal | 4.5:1 | **7.91** | ✓ |
| Dil kısaltması (aktif) | 12 / 600 | normal | 4.5:1 | **6.69** | ✓ |
| Ürün adı | 18 / 500 | normal | 4.5:1 | **7.91** | ✓ |
| Fiyat | 16 / 600 | normal | 4.5:1 | **7.91** | ✓ |

**8/8 geçiyor, başarısız yok.**

*Gerçek dokunmatik kaydırma (CDP)*

| Yön | Hareket | Sonuç |
|---|---|---|
| LTR | parmak sağdan sola | 1 → 2 → 3 → 4, sayaç ve adres takip etti |
| LTR | parmak soldan sağa | 4 → 3, geri gitti |
| RTL (Arapça) | parmak soldan sağa | 1 → 2 → 3, ileri gitti ✓ |
| RTL (Arapça) | parmak sağdan sola | 3 → 2, geri gitti ✓ |
| Her adımda | belge kaydı mı | hayır (`window.scrollX === 0`) |

*Sayfa içi dikey kaydırma*

Izgara 1. sayfada (7 satır) dikey parmak hareketi içeriği 262px kaydırdı;
kitabın yatay konumu değişmedi. Dikey kaydırma sayfanın içinde kalıyor,
sayfa atlatmıyor.

*Snap davranışı*

Kaba 0.7 sayfalık bir konum verildiğinde tarayıcı 1.0'a çekti; 0.3 ve 0.6'lık
yumuşak kaydırmalar en yakın sayfaya oturdu. `scroll-snap-type: x mandatory`
doğru çalışıyor.

*Diğer*

- `npx tsc --noEmit`: temiz
- `npm run lint`: temiz
- `npm run build`: hatasız, **38 → 46 statik sayfa** (4 dil × 7 menü sayfası)
- Konsol: 132+ sayfa yüklemesinde **0 hata, 0 uyarı**
- Rota testi: 7 sayfa slug'ı 4 dilde 200; eski adresler 307 → ilk sayfa; geçersiz → 404

---

**Not:**

7 satırlı Izgara sayfaları 390px'te tek ekrana sığmıyor, bir miktar dikey kayıyor. Pide, Salata ve Tatlı sayfaları tek ekrana sığıyor.

Gösterge olarak sadece sayfa numarası kullanıldı ("3 / 7"). İkonlu/noktalı bir gösterge sonradan eklenebilir.

**Karar bekleyen (önceki aşamalardan):** organizasyon içeriği · Arapça çevirilerin kontrolü · 24 ürünün fotoğrafı · 4 teyit edilmemiş fiyat · font kararı · QR adresi (kök mü `/tr` mi)

**Sıradaki adım:** Canlıya alındı (`f3dcd35`, Vercel build 20 sn, durum READY). Bekleyen içerik kararları.

=== RAPOR SONU ===

---

## Aşama 7 — Denetim ve Düzeltmeler · 2026-08-27

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 7 — Antigravity oturumu sonrası denetim, kayıt düzeltmeleri ve
sayfa/görsel düzenlemeleri (tamamı)

---

**Neden bu aşama var:**

Aşama 6'nın kodu bitmiş ama commit edilmemişken oturum kesildi. Araya başka bir
AI aracı (Antigravity) girdi. Bu aşama önce ne olduğunu tespit etti, sonra
onaylanan maddeleri düzeltti.

---

**1 — Antigravity oturumunun tespiti**

Kaynak: `~/.gemini/antigravity-ide/brain/87ef742f…/implementation_plan.md` ve
`task.md` (27 Ağustos 17:16–17:49).

| Ne yaptı | Sonuç |
|---|---|
| Kod dosyalarına dokundu mu | **Hayır.** `f3dcd35` içindeki kod değişikliklerinin tamamı Aşama 6'da yazılmış ve doğrulanmış hâliyle duruyor. |
| `ILERLEME.md` | Aşama 6 raporunu kendi cümleleriyle yeniden yazıp ekledi |
| Commit | `f3dcd35` ve `e0e5be6` — **onay alınmadan** |
| Push + dağıtım | GitHub'a push etti, Vercel üretim dağıtımını tetikledi — **onay alınmadan** |

Kendi planında "hiçbir commit veya push yapmayacağım" yazıp ikisini de yapmış.
Kullanıcı kararı: **push geri alınmayacak**, kod doğru ve canlı sürüm sağlıklı.
Push öncesi onay kuralı aynen geçerli.

`Documents/GitHub/huzur-pide` altında 7 commit geride, temiz bir klon daha var;
orada çalışılmamış.

---

**2 — Denetim sonuçları (düzeltmeden önce)**

| Kontrol | Sonuç |
|---|---|
| `tsc` / `lint` / `build` | Temiz, 46 statik sayfa |
| 132 sayfa yüklemesi (4 dil × 11 sayfa × 3 genişlik) | 0 konsol hatası, 0 uyarı, 0 yatay taşma, 0 taşan öğe |
| `dir` / `lang` | 132/132 doğru |
| Rotalar | 25 sayfa 200 · 3 eski adres 307 · 3 geçersiz 404 |
| Veri | 5 kategori, 31 ürün, dört dilde **0 eksik çeviri** |
| Kontrast | 14/14 geçiyor |
| Gezinme zinciri (4 dil) | Tam çalışıyor |
| Dokunmatik kaydırma | LTR ve RTL doğru yönde |

Menüde çalışmayan bir şey bulunmadı. Bulgular belge hataları ve tasarım
konularıydı.

---

**3 — `ILERLEME.md` kayıt düzeltmeleri**

| Ne | Öncesi | Sonrası |
|---|---|---|
| Ekranlar tablosu | Eski slug'lar, "38 statik sayfa", örnek `/ar/menu/izgara` | 9 sayfalık kitap tablosu, **54 statik sayfa**, örnek `/ar/menu/izgara-1` |
| JS'siz davranış | "Paylaşılan linkte doğru sayfada açılma: JS yoksa ✅" | ❌ 1. sayfada açılır + sayaç uyuşmazlığı notu |
| Renk paleti | `cream-150` yok, paprika açıklamaları eski | Kraft eklendi, paprika-500/600 kullanım yerleri yazıldı |
| Sıkışık başlık logosu | "32px" | **28px** (`h-7 w-7`; 32 yalnızca `width` özniteliği) |
| Kontrast: aktif dil | "7.91" | **6.69** — ilk ölçüm çipin kendi yarı saydam zeminini saymamıştı |
| Eksik ölçüler | Yoktu | Görsel yuvası 56→80 / 176→208px, satır boşluğu 10→16px, snap ve sayfa içi dikey kaydırma ölçümleri geri eklendi |
| Aşama numarası | Başlık "Aşama 7", ortada boşluk | Başlık **"Aşama 6"**; üstteki durum tablosu rapor başlıklarıyla aynı numaralandırmaya çekildi |

Numaralandırma notu: tablo ile rapor başlıkları baştan beri iki ayrı şema
kullanıyordu (tabloda RTL ayrı bir satırdı, başlıklarda Aşama 3'ün içindeydi).
RTL satırı Aşama 3'e katıldı; artık tablodaki her numaranın karşılığı aynı
numaralı bir rapor. Eski rapor başlıklarına dokunulmadı. Commit mesajlarındaki
"Asama 7" ifadesi geçmişte kaldı, değiştirilmedi.

---

**4 — Sayfa bölme (Izgara 3'e, İçecekler 2'ye)**

- `izgara`: `sayfaBolumleri` `[7, 7]` → **`[5, 5, 4]`**
- `icecekler`: `[7]` → **`[4, 3]`**
- Kitap 7 → **9 sayfa**, statik sayfa sayısı 46 → **54**
- Kategori listesindeki numaralar veriden türetildiği için kendiliğinden
  güncellendi: 1-2 · 3-5 · 6 · 7 · 8-9
- `icecekler` artık bir sayfa değil: `/[dil]/menu/icecekler` → `icecekler-1`
  yönlendirmesi eklendi, eski linkler kırılmadı

*Dikey sığma ölçümü — 390 × 844, dört dil × 9 sayfa = 36 sayfa:*

| Sayfa | TR | EN | AR | RU |
|---|---|---|---|---|
| 1 Kapalı pide 1 | sığıyor | sığıyor | sığıyor | sığıyor |
| 2 Kapalı pide 2 | sığıyor | **+126px** | sığıyor | **+33px** |
| 3 Izgara 1 | **+38px** | **+38px** | **+38px** | **+38px** |
| 4 Izgara 2 | **+38px** | **+38px** | **+38px** | **+81px** |
| 5 Izgara 3 | sığıyor | sığıyor | sığıyor | sığıyor |
| 6 Salatalar | sığıyor | sığıyor | sığıyor | sığıyor |
| 7 Tatlılar | sığıyor | sığıyor | sığıyor | sığıyor |
| 8 İçecekler 1 | sığıyor | sığıyor | sığıyor | sığıyor |
| 9 İçecekler 2 | sığıyor | sığıyor | sığıyor | sığıyor |

**26/36 sayfa tek ekrana sığıyor.** Öncesinde Izgara sayfaları 262px, İçecekler
262px taşıyordu; İçecekler tamamen çözüldü, Izgara taşması 262px → 38px'e indi.

Sığmayan 10 sayfanın sebebi ölçülebilir: sayfa yüksekliği 692px, sabit kısım
(başlık + "Menüye dön" + alt boşluk) 170px, satırlara kalan **522px**. Bir ızgara
satırı 112px → 522/112 = 4,66. Yani **5 satır sığmıyor, 4 sığıyor.**

---

**5 — Kategoriye göre yer tutucu ikonu**

Fotoğrafı olmayan 24 ürün için tek bir yassı mercek şekli kullanılıyordu; 80px'e
büyüyünce göze benziyordu ve İçecekler sayfasında yedi tanesi alt alta desen gibi
okunuyordu. Ayrıca kolaya pide silüeti göstermek anlamca yanlıştı.

| Kategori | Yeni ikon |
|---|---|
| Kapalı pide | Üstten pide — malzeme noktaları ve buhar |
| Izgara | Üç parçalı şiş |
| Salatalar | Kâse ve yapraklar |
| Tatlılar | Ayaklı tatlı kâsesi |
| İçecekler | Bardak ve pipet |

- Hepsi 48×48 kare `viewBox`, ikisi opaklık (0.4 zemin şekli / 0.6 detay)
- Kontur değil **dolgu**: yuva 56–80px'te ince konturun çizgisi 1px'in altına
  düşüp kayboluyor
- Yüksekliğe göre ölçekleniyor (`h-[52%] w-auto`): yuva mobilde kare, md üstünde
  16:9 — genişliğe göre ölçeklenseydi geniş yuvada taşardı
- Bilinmeyen kategori gelirse pide ikonuna düşüyor, ekran boş kalmıyor
- `UrunGorseli` artık `kategoriSlug` alıyor

---

**6 — Arapça'da pide tablosunda ad sütununun sıkışması**

Ölçülen sebep: 390px'te görsel sütunu 96px yiyordu, ada 110px kalıyordu. Sorun
yalnız Arapça'da değildi — İngilizce ve Rusça da 3 satıra sarıyordu, Türkçe adlar
kısa olduğu için gözden kaçmıştı.

Çözüm: çok fiyatlı tabloda görsel telefonda 80px → **56px**. Tek fiyatlı
sayfalarda 80px kalıyor (orada satırı yalnız görsel ve ad paylaşıyor), md üstünde
her yerde 208px'e dönüyor.

| Dil | Ad sütunu | En uzun ad | Satır sayısı |
|---|---|---|---|
| TR | 96 → 96px | Kıymalı | 1 → 1 |
| EN | 105 → **115px** | Kıymalı (Minced Beef) | 3 → 3 |
| AR | 110 → **133px** | كيما وكاشار (لحم مفروم وجبن) | **5 → 3** |
| AR | — | كيمالي (لحم مفروم) | **3 → 2** |
| RU | 122 → 122px | Кыймалы (с фаршем) | 3 → 3 |

Arapça satır yükseklikleri de düştü: 170 → 126px, 201 → 151px.

---

**Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `data/menu.ts` | `sayfaBolumleri`: izgara `[5,5,4]`, icecekler `[4,3]` |
| `components/Ikonlar.tsx` | Beş yer tutucu ikonu eklendi |
| `components/UrunGorseli.tsx` | Kategoriye göre ikon seçimi, `kategoriSlug` prop'u |
| `app/[dil]/menu/[sayfa]/page.tsx` | `kategoriSlug` aktarımı, pide tablosu görsel sütunu 56px |
| `app/globals.css` | `.pide-tablo` içindeki görsel telefonda 56px |
| `next.config.ts` | `/[dil]/menu/icecekler` → `icecekler-1` yönlendirmesi |
| `ILERLEME.md` | Üst özet, ekranlar tablosu, palet ve Aşama 6 raporundaki kayıt düzeltmeleri |

---

**Doğrulama:**

- `npx tsc --noEmit`: temiz
- `npm run lint`: temiz
- `npm run build`: hatasız, **46 → 54 statik sayfa**
- **156 sayfa yüklemesi** (4 dil × 13 sayfa × 3 genişlik): 0 konsol hatası,
  0 uyarı, 0 yatay taşma, 0 taşan öğe, 156/156 doğru `dir`/`lang`, font yüklü
- Kontrast (gerçek pikselden, 14 kombinasyon): **14/14 geçiyor**, en düşük 4.39
- Rotalar: 9 slug × 4 dil 200 · `kapali-pide`/`izgara`/`icecekler` 307 → ilk
  sayfa · geçersiz slug 404
- Gezinme zinciri dört dilde: 20/20 doğru
- Gerçek dokunmatik (CDP): LTR 1→2, 5→4, 8→9 · RTL 1→2, 9→8 — yön doğru
  aynalanıyor, her adımda `window.scrollX === 0`
- Sayfa içi dikey kaydırma yatay konumu değiştirmiyor
- Görünen görseller dört dilde de yükleniyor

---

**Not — dürüst kalmak adına:**

1. **Izgara sayfaları hâlâ 38px taşıyor.** 5 satır 390px'e sığmıyor; sığması için
   sayfa başına 4 satır gerekiyor. Tam sığan bölüm şu olurdu: Izgara **4+4+3+3**
   (4 sayfa), Kapalı pide **2+2+2** (3 sayfa, çünkü İngilizce/Rusça açıklamalar
   uzun), diğerleri aynı → kitap 11 sayfa. Bu senin onayladığın 5+5+4'ün ötesinde
   olduğu için yapmadım; istersen tek satırlık değişiklik.
2. **5+5+4 bölmesi köfte ve karışık gruplarını ikiye ayırıyor.** Sıra şöyle:
   et, et, kuzu, kuzu, | köfte, köfte, köfte, tavuk, tavuk, | karışık, karışık,
   saç, şiş, şiş. 5+5+4 sınırları 5 ve 10'a düşüyor, ikisi de grup ortası.
   **4+5+5** aynı sayfa sayısıyla grupları bütün bırakırdı. Bu bölmeyi ben
   önermiştim, grup sınırlarını hesaba katmamıştım.
3. **`next/image` `sizes` değeri eski:** `(min-width: 768px) 176px, 56px` yazıyor,
   gerçek ölçüler 208px ve 80px. Aşama 6'da yuvayı büyütürken güncellemeyi
   atlamışım. Görünür bir etkisi yok (tarayıcı iki değerde de aynı 256px'lik
   dosyayı seçiyor), o yüzden kapsam dışı bırakıp bildiriyorum.
4. **Üst başlıktaki logo 28px'te hâlâ bir miktar göze benziyor.** Yer tutucular
   çözüldü ama logonun kendisi Aşama 1'den beri aynı; kapsam dışı bıraktım.

**Karar bekleyen (önceki aşamalardan):** organizasyon içeriği · Arapça
çevirilerin ana dili konuşan biri tarafından kontrolü · 24 ürünün fotoğrafı ·
4 teyit edilmemiş fiyat · font kararı · QR adresi (kök mü `/tr` mi)

**Sıradaki adım:** Push onayı bekleniyor. Push edilirse Vercel otomatik
dağıtımı tetiklenir.

=== RAPOR SONU ===

---

## Aşama 8 — Sayfa Bölme İnce Ayarı · 2026-08-27

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 8 — Kitabı 11 sayfaya çıkarma, sığma doğrulaması ve `sizes`
düzeltmesi (tamamı)

---

**1 — Bölme sınırları: grup bütünlüğü + sığma**

İki kısıt vardı ve ikisi de sağlandı, feda edilen olmadı:

*Sığma kısıtı.* 390 × 844'te bir menü sayfası 692px; sabit kısım (kategori
başlığı + "Menüye dön" + alt boşluk) 170px; satırlara kalan **522px**. Bir ızgara
satırı 112px → 522/112 = 4,66, yani **sayfa başına en fazla 4 satır**.

*Grup kısıtı.* Izgara ürünleri yedi gruba ayrılıyor: et (2), kuzu (2), köfte (3),
tavuk (2), karışık (2), saç kavurma (1), şiş (2).

Grupları bozmadan, hiçbir sayfa 4 satırı geçmeden yapılan bölme:

| Sayfa | Ürün | Gruplar |
|---|---|---|
| `izgara-1` | 4 | et + kuzu |
| `izgara-2` | 3 | köfte (bütün) |
| `izgara-3` | 4 | tavuk + karışık |
| `izgara-4` | 3 | saç kavurma + şiş |

**4+3+4+3.** Senin yazdığın 4+4+3+3 ile aynı sayfa sayısı (4), ama 4+4+3+3'ün
ikinci sınırı 8. üründe düşüyor ve tavuk grubunu ikiye bölüyordu. 4+3+4+3'te
hiçbir grup bölünmüyor. Çakışma çıkmadığı için sormadan uyguladım.

*Kapalı pide.* 2+2+2 uygulandı. Buradaki kalemler grup oluşturmuyor, her biri
ayrı bir pide çeşidi. Bölme sebebi sığma: tablo satırları İngilizce ve Rusça
açıklamalarla 264px'e kadar çıkıyor, 3'er bölündüğünde ikinci sayfa taşıyordu.

*İçecekler* 4+3, *Salatalar* 1, *Tatlılar* 3 — değişmedi, zaten sığıyorlardı.

Kitap **9 → 11 sayfa**, statik sayfa **54 → 62**.

---

**2 — Sığma doğrulaması (390 × 844, 4 dil × 11 sayfa = 44 sayfa)**

| Dil | Sığan | Taşan |
|---|---|---|
| TR | 11 / 11 | 0 |
| EN | 11 / 11 | 0 |
| AR | 11 / 11 | 0 |
| RU | 11 / 11 | 0 |
| **Toplam** | **44 / 44** | **0** |

Her sayfanın içeriği tam 692px veya altında; hiçbirinde dikey kaydırma çubuğu
oluşmuyor. Öncesi: 36 sayfanın 10'u taşıyordu (Izgara 38px, İngilizce kapalı
pide 126px, Rusça 33–81px).

*Daha küçük ekran (360 × 640).* Bu ekranda sayfa yüksekliği 692 değil 488px.
Türkçe 11 sayfanın **6'sı** burada dikey kayıyor (618px ve 506px'lik sayfalar).
Senin verdiğin hedef 390px'ti ve orada tamamı sığıyor; 360 × 640 bilgi olsun diye
ölçüldü. Dikey kaydırmanın sayfanın içinde kaldığı, kitabın yatay konumunu
bozmadığı bu ekranda ayrıca doğrulandı (`kitap.scrollLeft` 1080 → 1080,
sayfa içi `scrollTop` 0 → 130).

---

**3 — `next/image` `sizes` düzeltmesi**

Öncesi `(min-width: 768px) 176px, 56px` — Aşama 6'da görsel yuvası büyütülürken
güncellenmemişti.

Gerçekte iki ölçü var, ikisi de yazıldı:

| Yer | Telefon | md üstü |
|---|---|---|
| Tek fiyatlı sayfalar | **80px** | **208px** |
| Çok fiyatlı pide tablosu | **56px** | **208px** |

`UrunGorseli` artık `dar` prop'u alıyor; pide tablosu bunu veriyor.

---

**Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `data/menu.ts` | `sayfaBolumleri`: kapalı pide `[2,2,2]`, izgara `[4,3,4,3]` — ikisine de gerekçe yorumu eklendi |
| `components/UrunGorseli.tsx` | `sizes` gerçek ölçülere çekildi, `dar` prop'u eklendi |
| `app/[dil]/menu/[sayfa]/page.tsx` | Pide tablosu `dar` gönderiyor |
| `ILERLEME.md` | Üst özet, ekranlar tablosu (11 sayfa, 62 statik sayfa) |

Kategori listesindeki sayfa numaraları veriden türetildiği için kendiliğinden
güncellendi: **1-3 · 4-7 · 8 · 9 · 10-11**. Eski adres yönlendirmeleri
(`kapali-pide`, `izgara`, `icecekler` → ilk sayfa) yerinde ve çalışıyor.

---

**Doğrulama:**

- `npx tsc --noEmit` · `npm run lint` · `npm run build`: temiz, **62 statik sayfa**
- **180 sayfa yüklemesi** (4 dil × 15 sayfa × 3 genişlik): 0 konsol hatası,
  0 uyarı, 0 yatay taşma, 0 taşan öğe, 180/180 doğru `dir`/`lang`, font yüklü
- Dikey sığma: **44/44 sayfa** 390px'te tek ekrana sığıyor
- Kontrast (gerçek pikselden, 14 kombinasyon): 14/14 geçiyor
- Rotalar: 11 slug × 4 dil 200 · 3 eski adres 307 → ilk sayfa · `izgara-5` ve
  geçersiz slug 404
- Gezinme zinciri dört dilde: 20/20 doğru
- Gerçek dokunmatik (CDP): LTR 1→2, 7→6, 10→11 · RTL 1→2, 5→4, 11→10 — yön
  doğru aynalanıyor, her adımda `window.scrollX === 0`
- Sayfa içi dikey kaydırma yatay konumu bozmuyor (360 × 640'ta ölçüldü)
- Görünen görseller dört dilde de yükleniyor

---

**Not:**

Kapalı pide tablosunda uzun İngilizce adlar hâlâ dar bir sütuna sarıyor:
"Lahmacun (Thin Flatbread with Minced Meat)" 390px'te **6 satır**. Sayfa artık
sığıyor, yani bozulma değil — ama sütun dar. Sebebi Aşama 7'de ölçülenle aynı:
ad sütunu üç fiyat sütunuyla yeri paylaşıyor. Tam çözümü görsel sütununu
telefonda tamamen gizlemek olurdu; o seçenek reddedilmişti.

**Karar bekleyen (önceki aşamalardan):** organizasyon içeriği · Arapça
çevirilerin ana dili konuşan biri tarafından kontrolü · 24 ürünün fotoğrafı ·
4 teyit edilmemiş fiyat · font kararı · QR adresi (kök mü `/tr` mi)

**Sıradaki adım:** Push onayı bekleniyor.

=== RAPOR SONU ===

---

## Aşama 9 — Gerçek Telefon Yüksekliğine Sığdırma · 2026-08-28

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 9 — Kitabın her telefonda tek ekrana sığması (ölçüm, seçenek
sunumu ve B seçeneğinin uygulanması — tamamı)

---

**1 — Ölçüm: yanlış hedefe ölçülüyormuş**

Aşama 8'de "390×844'te 44/44 sığıyor" denmişti. 844, iPhone 12'nin **cihaz**
yüksekliği; Safari'de adres çubuğu açıkken görünür alan **390×664**. Üstelik bu
kitapta adres çubuğu hiç toplanmıyor: sayfa `h-dvh`, belge kaymıyor, kaydırma iç
kutuda oluyor — adres çubuğunu toplayan şey ise belge kaydırmasıdır.

Gerçek görünür alanlarla ölçüldüğünde (dört dil × 11 sayfa, Chrome + Playwright
cihaz profilleri) listelenen 11 telefonun **10'unda** kitap tek ekrana
sığmıyordu; yalnızca Pixel 7/8 sınıfı (839px) temizdi. En kötü dil her cihazda
Rusça, en iyisi Türkçe.

**2 — Seçenekler ölçüldü, B seçildi**

Sunulan seçeneklerden **B** onaylandı: küçültme yok, 11 sayfa korunuyor,
iPhone SE 1. nesil hedef dışı.

Sayfa sayısını artırmak tek başına çözmüyordu: grupları bütün bırakma kuralı
nedeniyle **köfte grubu (3 ürün, dört dilin en kötüsünde 364–403px)** bir duvar
yaratıyor ve kitap 20 sayfaya çıksa bile 360×640'ta 85px taşma kalıyordu.

**3 — Uygulanan değişiklikler**

Hiçbir fotoğraf, ürün adı, açıklama veya kategori başlığı küçültülmedi.

*Yapısal (asıl kazanç):* "Menüye dön" düğmesi her yaprağın içinden alınıp
kitabın alt şeridine, sayfa sayacının yanına taşındı. Düğme orada üst
boşluğuyla birlikte **sayfa başına 80px** yiyordu. Alt şerit bundan
yükselmedi — yüksekliğini zaten 44px'lik dokunma hedefi belirliyor.

*Boşluklar (yalnızca `md` altında, yani telefonda):*

| Yer | Önce | Sonra |
|---|---|---|
| Ürün satırı dikey dolgusu | 16px | 10px |
| Pide tablosu hücre dolgusu | 16px | 10px |
| Başlık ile liste arası | 24px | 8px |
| Sayfa alt boşluğu | 32px | 12px |
| Üst şerit dolgusu | 16 / 8px | 6 / 0px |

`md` (768px) ve üstünde bütün eski değerler geri geliyor.

Sabit alan **322px → 180px** (sabit çerçeve 152→126, sayfa içi sabit 170→54).

**Sayfa sayacının puntosu 14px'te kaldı, bedeli sıfır.** Ölçüldü: şeridin
yüksekliğini 44px'lik düğme belirliyor, sayacın 20px'lik satırı onun altında
kalıyor. Şerit dört dilde de tam **44px** — eski sayaç şeridiyle aynı.

**4 — Sığma doğrulaması (gerçek görünür alan yüksekliğiyle)**

15 cihaz profili × 4 dil × 11 sayfa:

| Cihaz | Görünür alan | TR | EN | AR | RU |
|---|---|---|---|---|---|
| Galaxy S5 / Note | 360×640 | — | — | — | — |
| iPhone 13 mini | 375×629 | — | — | — | — |
| iPhone 11 Pro | 375×635 | — | — | — | — |
| iPhone SE 3 / 8 | 375×667 | — | — | — | — |
| iPhone 16e | 390×651 | — | — | — | — |
| iPhone 15 / 16 | 393×659 | — | — | — | — |
| iPhone 12–14 | 390×664 | — | — | — | — |
| iPhone 11 | 414×715 | — | — | — | — |
| Pixel 9 | 360×732 | — | — | — | — |
| iPhone 15 Pro Max | 430×739 | — | — | — | — |
| Galaxy S8 | 360×740 | — | — | — | — |
| iPhone 17 Pro Max | 440×763 | — | — | — | — |
| Galaxy S24 | 360×780 | — | — | — | — |
| Pixel 7 / 8 | 412×839 | — | — | — | — |
| **iPhone SE 1. nesil** | **320×568** | **3/20** | **9/81** | **4/49** | **6/111** |

*(— = sıfır taşma; hücre = kaç sayfa kayıyor / en büyük taşma px)*

**Hedefteki 14 cihazın tamamında, dört dilde, 11 sayfanın hepsi tek ekrana
sığıyor: 616/616.** Öncesi: aynı ölçümde 10 cihazda taşma vardı.

Hedef dışı bırakılan iPhone SE 1. nesil'de (320×568) 22 sayfa hâlâ kayıyor;
en büyüğü Rusça `tatlilar` +111px. Kararı gereği bırakıldı.

Tek ekran kuralının sağlandığı en düşük görünür yükseklik: **547px**
(≥360px genişlikte), **508px** (390px'te), 647px (320px genişlikte).

**5 — Diğer doğrulamalar**

- `npx tsc --noEmit` · `npm run lint` · `npm run build`: temiz, **62 statik sayfa**
- 240 sayfa yüklemesi (4 dil × 15 sayfa × 4 genişlik): **0 konsol hatası/uyarısı**,
  0 yatay taşma, 240/240 doğru `dir` + `lang`
- Kontrast, gerçek pikselden: "Menüye dön" 5.02 (hover 7.42), sayaç 5.02 —
  hepsi 4.5 eşiğini geçiyor, Arapça dahil
- Alt şerit Arapça'da doğru tarafta: `dir=rtl`'de düğme sağda, sayaç solda;
  üç cihaz × dört dilde çakışma yok
- Dokunma hedefi: düğme **44×104–128px** (44px asgari sağlanıyor)
- Gerçek dokunmatik (CDP, iPhone 12): LTR 4→5→6→5 · RTL 4→3→2→3 — yön doğru
  aynalanıyor, `window.scrollX = 0`
- Gezinme zinciri dört dilde **24/24**, "Menüye dön"ün yeni yeri dahil
- Rotalar: 11 slug × 4 dil 200 · 3 eski adres 307 · `izgara-5` ve geçersiz slug 404
- Kategori listesi sayfa numaraları: 1-3 · 4-7 · 8 · 9 · 10-11 (değişmedi)
- JavaScript kapalıyken "Menüye dön" bağlantısı çalışıyor (`href="/tr/menu"`)
- iPhone SE 1'de sayfa içi dikey kaydırma kitabın yatay konumunu bozmuyor
  (`kitap.scrollLeft` 1280 → 1280, sayfa `scrollTop` 0 → 87, belge kaymıyor)

**Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `app/globals.css` | Satır/hücre dolguları, sayfa alt boşluğu; yeni `.alt-serit` ve `.alt-serit-baglanti`; `.sayfa-numarasi` sadeleşti |
| `app/[dil]/menu/[sayfa]/page.tsx` | Yapraktan `nav` kaldırıldı, alt şerit eklendi; liste üst boşluğu `mt-2 md:mt-6` |
| `components/UstBaslik.tsx` | Sıkışık şeridin telefon dolgusu 16/8 → 6/0 |
| `ILERLEME.md` | Özet, durum tablosu, ekranlar bölümü |

`data/menu.ts` **değişmedi** — bölme, sayfa sayısı, adresler ve yönlendirmeler
aynı.

**Not:**

Kapalı pide tablosunda uzun İngilizce/Rusça adlar dar ad sütununda çok satıra
sarmaya devam ediyor ("Kıymalı (Minced Beef)" 390px'te 3 satır). Sayfalar artık
bol boşlukla sığdığı için bu daha görünür oldu. Aşama 8'de de vardı, sebebi
aynı: ad sütunu üç fiyat sütunuyla yer paylaşıyor. Kapsam dışı bırakıldı,
düzeltmesi ayrı bir karar.

**Sıradaki adım:** Push onayı bekleniyor.

=== RAPOR SONU ===

---

## Aşama 10 — Kategori Bağlantısı Hatası ve Sayfa Çevirme Okları · 2026-08-28

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 10 — Canlıdaki iki hatanın giderilmesi (tamamı)

---

**1 — Hata 1: kategori bağlantıları yanlış sayfaya gidiyordu**

*Sebep.* Kitabın hangi sayfada açılacağını `page.tsx`'in sonundaki satır içi
`<script>` belirliyordu. Bu script yalnızca **tam sayfa yüklemede** çalışıyor.
Kategori listesindeki bağlantılar Next.js `<Link>`, yani **istemci tarafı
gezinme**: belge yeniden yüklenmiyor, React ağacı güncelliyor ve
`dangerouslySetInnerHTML` ile basılan script `innerHTML` üzerinden DOM'a
girdiği için **tarayıcı onu çalıştırmıyor**. `data-acilis` doğru yazılıyordu,
kimse okumuyordu; kitap 1. sayfada (Kapalı Pide) kalıyordu. Üstüne
IntersectionObserver 1. sayfayı görüp adresi de `kapali-pide-1`'e geri
yazıyordu.

*Düzeltme.* Aynı konumlandırma `SayfaSayaci` içinde, boyamadan önce çalışan bir
layout effect'e eklendi; bağımlılığı `baslangicNo`, yani rota parametresi
değişince yeniden çalışıyor. Satır içi script kaldı (tam sayfa yüklemede ilk
boyamadan önce doğru sayfayı gösteren tek şey o). İkisi tek bir yardımcıyı
kullanıyor: `components/kitapKaydirma.ts`.

Yardımcı yön bağımsız — hedef sayfa ile kabın kutuları arasındaki **farkı**
kullanıyor, `scrollLeft`'in işaretiyle uğraşmıyor. Satır içi script de
`scrollIntoView({behavior:"instant"})` yerine aynı fark hesabına geçti; eski
tarayıcılarda `"instant"` geçersiz enum sayılıp `TypeError` atabiliyordu.

*Uygulama sırasında çıkan ikinci sorun.* İlk sürüm `scrollBy()` kullanıyordu ve
kitap hedef ne olursa olsun yalnızca **bir** sayfa ilerliyordu. Sebep:
sayfalarda `scroll-snap-stop: always` var (hızlı parmak hareketinde sayfa
atlanmasın diye) ve bu, programatik `scrollBy` çağrısını da bir snap noktasında
durduruyor. Anlık konumlandırma doğrudan `scrollLeft` atamasına çevrildi; ok
düğmeleri hep tek sayfa ilerlediği için orada yumuşak `scrollBy` kaldı.

**2 — Testler bunu neden yakalamadı**

- Rota testleri yalnızca **HTTP durum kodu** bakıyordu. Kitabın 11 sayfası tek
  belgede; `/tr/menu/tatlilar` her hâlükârda 200 döner.
- Gezinme zinciri testi yalnızca **adresi** doğruluyordu (`waitForURL`). Adres
  bir an doğru oluyor, gözlemci sonradan geri yazıyor; test o kadar beklemiyordu.
- Sığma, dokunma ve konsol testlerimin hepsi `page.goto()` ile başlıyordu, yani
  **tam sayfa yükleme**. Satır içi script her testimde çalıştı. Müşterinin
  izlediği yolu (listeden tıklama) hiç taklit etmedim.

Özeti: hiçbir test **"adreste yazan kategori" ile "ekranda görünen kategori"**
arasında karşılaştırma yapmıyordu.

*Yöntem değişikliği (kalıcı).* Bundan sonra her gezinme testi tıklamadan sonra
görünen sayfanın **kategori başlığını ve ilk ürün adını** beklenen değerle
karşılaştırıyor; testler gerçek tıklamayla (istemci tarafı gezinme) yapılıyor
ve hem Chrome hem WebKit motorunda çalıştırılıyor.

**3 — Hata 2: parmakla kaydırma**

*Üretilemedi.* Canlı sitede ve yerelde, Chrome ve WebKit 26.5 motorlarında,
iPhone 12 ve Galaxy S5 profillerinde, gerçek dokunma olaylarıyla, hem doğrudan
yüklemede hem listeden tıklayarak girdikten sonra, LTR ve RTL — kaydırma her
durumda çalışıyor.

*Planlanan `touch-action` düzeltmesi denendi ve GERİ ALINDI.* `.kitap` için
`pan-x`, `.kitap-icerik` için `pan-y` verildiğinde kaydırma **tamamen durdu**
(ölçüldü: 4 → 4, sayfa değişmedi). Sebep: tarayıcı, dokunmanın başladığı
elemandan yukarı doğru bütün ata zincirinin `touch-action` değerlerini
**kesiştiriyor**; `pan-y ∩ pan-x` boş küme oluyor. Yani bu yöntem bu sorun için
kullanılamaz. Sebebi CSS'e yorum olarak yazıldı ki tekrar denenmesin.

*Bekleyen hipotez.* Hata 1 düzeltilmeden önce her kategori aynı Kapalı Pide
sayfalarını açıyordu; 1., 2. ve 3. sayfaların başlığı aynı ("Kapalı Pide
Çeşitleri") ve ikisi de iki satır. Kaydırma çalışıyor ama sayfa değişmiyor gibi
görünmüş olabilir. Önizlemede doğrulanacak.

Ok düğmeleri bu belirsizlikten bağımsız olarak sayfa çevirmeyi garanti ediyor.

**4 — Ok düğmeleri**

Yeni bileşen `components/SayfaOklari.tsx`. Kitabın kardeşi (`.kitap-alani`
sarmalayıcısı içinde), çocuğu değil — kaydırma kabının içinde olsalardı
sayfalarla birlikte kayarlardı.

| Özellik | Değer |
|---|---|
| Dokunma hedefi | 44 × 44 px (şeffaf) |
| Görünen kısım | 20 px daire (sm üstünde 24), 12 px chevron |
| Konum | Dikeyde tam ortada, kenara dayalı |
| İçerik örtme | **0 px²** — dört dilde, 11 sayfada yazı kutularıyla ölçüldü |
| Yön | İleri `inset-inline-end`, geri `inset-inline-start` |
| Arapça | İleri ok **solda ve sola bakıyor**, geri ok sağda ve sağa |
| Uçlar | 1. sayfada geri ok, 11. sayfada ileri ok **gizli** |
| Kontrast | 6.03:1 |
| JavaScript kapalı | Oklar hiç render edilmiyor; kaydırma çalışmaya devam ediyor |

Görünen daire, 44px'lik dokunma alanının ortasında değil **dış kenarında**
duruyor. İlk sürümde ortadaydı ve 28px'ti: Arapça `kapali-pide-2` sayfasında
"440 ₺" fiyatının ilk rakamını örtüyordu (231–279 px² örtüşme, yazı
kutularıyla ölçüldü). Şimdi daire sayfanın kendi 20px'lik kenar boşluğunun
içinde kalıyor.

Yeni arayüz metinleri `data/arayuz.ts`'e eklendi: `sonrakiSayfa`, `oncekiSayfa`
(dört dilde, onaylandığı gibi). `data/menu.ts` değişmedi.

**5 — Doğrulama**

*Her testte adres VE ekranda görünen içerik birlikte kontrol edildi.*

| Test | Sonuç |
|---|---|
| Kategori listesinden gerçek tıklama (4 dil × 5 kategori) — adres + kategori başlığı + ilk ürün adı | **20/20** |
| Aynı sayfalar doğrudan yüklenince (4 dil × 11 sayfa) | **44/44** |
| Ok ile ileri 1→11 ve geri 11→1, her adımda içerik kontrolü (4 dil) | **80/80** |
| Uçlarda okun gizli olması (4 dil × 2 uç) | **8/8** |
| Ok kenarı, chevron yönü, dokunma hedefi, dikey merkez, daire boyutu | **24/24** |
| **Chrome toplam** | **188/188** |
| **WebKit 26.5 toplam** | **188/188** |

- Parmakla kaydırma (gerçek dokunma olayları): TR 4→5→4, AR 4→3→4 (doğru
  aynalanıyor); listeden tıklayarak girdikten sonra TR 9→10→9, AR 9→8→9;
  belge yatayda hiç kaymıyor
- Sığma, Aşama 9'daki 15 cihaz profili × 4 dil × 11 sayfa: **bozulmadı**,
  hedefteki 14 cihazda 0 taşma (kapsam dışı iPhone SE 1. nesil aynı kaldı)
- 240 sayfa yüklemesi (4 dil × 15 sayfa × 4 genişlik): **0 konsol
  hatası/uyarısı**, 0 yatay taşma, 240/240 doğru `dir` + `lang`
- Kontrast: "Menüye dön" 5.02 · sayaç 5.02 · ok chevron 6.03 — hepsi geçiyor
- JavaScript kapalı: ok sayısı 0, "Menüye dön" bağlantısı çalışıyor
- Rotalar: 44 sayfa 200 · 3 eski adres 307 · `izgara-5` ve geçersiz slug 404
- `tsc`, `lint`, `build` temiz — 62 statik sayfa

**Değiştirilen/eklenen dosyalar:**

| Dosya | Durum |
|---|---|
| `components/kitapKaydirma.ts` | **Yeni** — yön bağımsız konumlandırma yardımcısı |
| `components/SayfaOklari.tsx` | **Yeni** — sayfa çevirme okları |
| `components/SayfaSayaci.tsx` | İstemci tarafı gezinmede konumlandırma |
| `app/[dil]/menu/[sayfa]/page.tsx` | `.kitap-alani` sarmalayıcı, oklar, satır içi script |
| `app/globals.css` | Ok stilleri; `touch-action` denemesinin gerekçesi yorum olarak |
| `data/arayuz.ts` | `sonrakiSayfa`, `oncekiSayfa` |
| `ILERLEME.md` | Özet, durum tablosu, ekranlar bölümü |

**Sıradaki adım:** Dalın push edilmesi ve Vercel önizleme adresi için onay
bekleniyor.

=== RAPOR SONU ===

---

## Aşama 11 — Kaydırma Çubuğu ve Kapalı Pide'nin 2 Sayfaya İnmesi · 2026-08-28

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 11 — Dikey kaydırma çubuğunun gizlenmesi ve Kapalı Pide
bölmesinin 3+3 yapılması (tamamı)

---

**1 — Dikey kaydırma çubuğu gizlendi**

`.kitap-icerik`'e `scrollbar-width: none` ve `::-webkit-scrollbar { display: none }`
eklendi — kitabın yatay kabında (`.kitap`) Aşama 6'dan beri kullanılan yöntemin
aynısı. İkisi birlikte bütün tarayıcıları kapsıyor: `scrollbar-width` standart
özellik (Firefox 64+, Chrome/Edge 121+, Safari 18.2+), `::-webkit-scrollbar`
eski Safari ve Chrome/Edge için.

Kaydırma **işlevi** duruyor; bu özellikler yalnızca çubuğun çizilmesini
etkiliyor, `overflow` değerine dokunmuyor. Sayfaların taştığı tek profilde
(iPhone SE, kapsam dışı) gerçek parmakla dikey kaydırma denendi:
`scrollTop` 0 → 117 (EN), 0 → 43 (RU); kitabın yatay konumu değişmedi
(320 → 320, Arapça'da −320 → −320). Chrome ve WebKit'te aynı sonuç.

Masaüstünde klasik çubuğun ayırdığı yer de sıfırlandı (`offsetWidth −
clientWidth = 0`); o pikseller içeriğe döndü, yatay taşma ölçümü değişmedi.
Ok düğmelerine dokunulmadı.

**2 — Kapalı Pide 2+2+2 → 3+3**

`data/menu.ts`'te yalnızca `sayfaBolumleri` satırı ve üstündeki gerekçe yorumu
değişti; ürün, fiyat, çeviri içeriğine dokunulmadı.

| | Önce | Sonra |
|---|---|---|
| Kitap | 11 sayfa | **10 sayfa** |
| Statik sayfa | 62 | **58** |
| Kategori listesi | 1-3 · 4-7 · 8 · 9 · 10-11 | **1-2 · 3-6 · 7 · 8 · 9-10** |
| Son sayfa sayacı | 11 / 11 | **10 / 10** |

`next.config.ts`'e yönlendirme eklendi: **`/:dil/menu/kapali-pide-3` →
`kapali-pide-2`**. Hedef ilk sayfa değil ikinci sayfa, çünkü eski 3. sayfadaki
Karışık ve Lahmacun yeni bölmede orada duruyor.

**3 — Sığdırma (E seçeneği)**

3+3 bölmesi tek başına hedefteki 14 cihazda **21 kombinasyonda taşıyordu**
(EN `kapali-pide-2` 11 cihazda +20…+171px, RU 7 cihazda +40…+78px, AR 1
cihazda +61px, EN `kapali-pide-1` 2 cihazda +3/+9px). Sebep, Lahmacun'un uzun
İngilizce adının dar ad sütununda altı satıra sarması.

Beş seçenek ölçülüp sunuldu, **E** onaylandı ve uygulandı — yalnızca `md`
altında (telefon), tablet ve masaüstünde her şey eskisi gibi:

- Pide tablosunda **görsel sütunu telefonda gizli**. Hücreleri gizlemek
  yetmiyor, `<col>`'un kendisi de kalkmalı — yoksa genişliğini ayırmaya devam
  ediyor. Kalkınca ad sütunu genişliyor, uzun adlar daha az satıra sarıyor.
  (6 pide ürününden yalnızca 2'sinin fotoğrafı var.)
- Pide tablosundaki **açıklamalar telefonda tek satır** (`line-clamp-1`).
  İlk satır kalıyor; Türkçe bilmeyen müşteri içindekiler fikrini yine alıyor.

Sonuç: hedefteki 14 cihazın tamamında, dört dilde, 10 sayfanın hepsi tek
ekrana sığıyor — **0 taşma**.

Kapsam dışı iPhone SE 1. nesil'de (320×568) durum iyileşti ama taşma sürüyor:
TR 3 sayfa/+20px · EN 8/+117 · AR 3/+49 · RU 7/+111. (E öncesi: EN 9/+232,
AR 5/+133, RU 8/+139.)

**4 — Doğrulama**

*Her testte adres VE ekranda görünen içerik birlikte kontrol edildi.*

| Test | Sonuç |
|---|---|
| Kategori listesinden gerçek tıklama (4 dil × 5 kategori) — adres + kategori başlığı + ilk ürün adı | 20/20 |
| Doğrudan yükleme (4 dil × 10 sayfa) | 40/40 |
| Ok ile ileri 1→10 ve geri 10→1, her adımda içerik (4 dil) | 72/72 |
| Uçlarda gizlilik, kenar, chevron yönü, dokunma hedefi, dikey merkez, boyut | 44/44 |
| **Chrome toplam** | **176/176** |
| **WebKit 26.5 toplam** | **176/176** |

- Sığma: 15 cihaz profili × 4 dil × 10 sayfa — hedefteki 14 cihazda **0 taşma**
- Parmakla kaydırma: TR 3→4→3, AR 3→2→3; listeden tıklayarak girdikten sonra
  TR 8→9→8, AR 8→7→8; belge yatayda hiç kaymıyor
- Ok düğmesinin metni örtmesi: **0 px²**, dört dilde
- 224 sayfa yüklemesi (4 dil × 14 sayfa × 4 genişlik): **0 konsol
  hatası/uyarısı**, 0 yatay taşma, 224/224 doğru `dir` + `lang`
- Rotalar: 40 sayfa 200 · `kapali-pide-3` 307 → `kapali-pide-2` ·
  `kapali-pide`/`izgara`/`icecekler` 307 · `kapali-pide-4`, `izgara-5` ve
  geçersiz slug 404
- Kategori listesi numaraları ve sayaç dört dilde tutarlı
- `tsc`, `lint`, `build` temiz — **58 statik sayfa**

**Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `app/globals.css` | Kaydırma çubuğu gizlendi; `.pide-gorsel-hucre` telefonda gizli |
| `data/menu.ts` | Yalnızca `sayfaBolumleri`: `[2,2,2]` → `[3,3]` |
| `next.config.ts` | `kapali-pide-3` → `kapali-pide-2` yönlendirmesi |
| `app/[dil]/menu/[sayfa]/page.tsx` | Görsel sütunu (`<col>`, `<th>`) telefonda gizli; tablo açıklamaları `line-clamp-1 md:line-clamp-none` |
| `ILERLEME.md` | Özet, durum tablosu, ekranlar bölümü |

Palet, tipografi, boşluklar ve diğer kategorilerin bölmesi değişmedi.

**Sıradaki adım:** Push onayı bekleniyor.

=== RAPOR SONU ===

---

## Aşama 12 — Üretime Çıkış ve Canlı Doğrulama · 2026-08-28

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 12 — `duzeltme/kategori-baglantisi-ve-ok` dalının `main`'e
alınması, üretime çıkış ve canlı adres üzerinde doğrulama (tamamı)

---

**1 — Birleştirme ve üretime çıkış**

Dal `main`'e `--no-ff` ile alındı (birleştirme işlemesi `cfbca88`); Aşama 10 ve
11'in iki işlemesi tek birleştirme altında toplandı, dal geçmişi korundu.
Push öncesi `tsc --noEmit` ve `next build` yeniden çalıştırıldı: temiz, **58
statik sayfa**.

`main`'e push edildiğinde Vercel üretim dağıtımını otomatik tetikledi. Yeni
sürümün canlıya indiği, sürüm işareti olarak `kapali-pide-3` adresiyle
ölçüldü: eski sürümde gerçek bir sayfa (200), yeni sürümde yönlendirme (307).
Push ile ilk 307 arasında yaklaşık 15 saniye geçti.

**2 — Rotalar (canlı adres, HTTP)**

| Ölçüm | Sonuç |
|---|---|
| 4 dil × 10 sayfa | 40/40 → 200 |
| `kapali-pide` · `izgara` · `icecekler` (4 dil) | 12/12 → 307, ilk sayfaya |
| `kapali-pide-3` (4 dil) | 4/4 → 307, **`kapali-pide-2`'ye** |
| `/` kök adres | 307 → `/tr` |
| `kapali-pide-4`, `izgara-5`, `salatalar-2`, geçersiz slug, `/de/...` | 5/5 → 404 |

`kapali-pide-3`'ün hedefi bilinçli olarak ilk sayfa değil: eski 3. sayfadaki
Karışık ve Lahmacun yeni bölmede 2. sayfada duruyor. Canlıda içerikle
doğrulandı — adres `kapali-pide-2`'ye indi ve ekranda görünen ürünler
Kıyma & Kaşar, Karışık, Lahmacun çıktı.

**3 — Kategori listesinden gerçek tıklama (4 dil × 5 kategori)**

Her dilde kategori listesi açıldı, beş bağlantıya sırayla **tıklandı**, her
tıklamadan sonra adres değil **ekranda görünen** ölçüldü: hangi sayfa
bölümünün görüş alanını kapladığı (`getBoundingClientRect` örtüşmesi), o
bölümün başlığı, ürünleri ve alt şeritteki sayaç.

| Dil | Sonuç |
|---|---|
| TR | 5/5 — Kapalı Pide (1/2) s.1 · Izgara (1/4) s.3 · Salatalar s.7 · Tatlı s.8 · İçecekler (1/2) s.9 |
| EN | 5/5 — Closed Pide · Grilled Dishes · Salads · Desserts · Drinks |
| AR | 5/5 — البيدة المغلقة · المشويات · السلطات · الحلويات · المشروبات |
| RU | 5/5 — Закрытая пиде · Блюда на гриле · Салаты · Десерты · Напитки |

Her ölçümde görüş alanında **tek** sayfa vardı ve tam 390 px kaplıyordu —
yarım kalmış, iki sayfanın arasına oturmuş bir görüntü hiç oluşmadı.
Kategori listesindeki numaralar (1-2 · 3-6 · 7 · 8 · 9-10) sayaçla tutarlı.

**4 — Oklar (4 dil × 18 adım)**

Her dilde 1. sayfadan başlanıp ileri okla 10'a, sonra geri okla 1'e yüründü;
her adımda görünen bölüm, başlığı ve sayaç okundu.

| Dil | İleri | Geri | Uçlarda |
|---|---|---|---|
| TR | 9/9 | 9/9 | s.1'de yalnız "Sonraki", s.10'da yalnız "Önceki" |
| EN | 9/9 | 9/9 | aynı |
| AR | 9/9 | 9/9 | aynı |
| RU | 9/9 | 9/9 | aynı |

**Toplam 72/72.** Arapça'da yön ayrıca ölçüldü: `dir="rtl"`, "sonraki" düğmesi
solda (x=0) ve chevron aynalanmış (`matrix(-1,0,0,1,0,0)`), "önceki" sağda
(x=346) ve düz. İleri gidildiğinde kap **sola** hareket etti (`scrollLeft`
0 → −3514), geri gidildiğinde sağa (−3514 → 0) — dokuz adımın dokuzunda da.
Düğme boyutu dört dilde 44×44 px.

**Ölçüm sırasında karşılaşılan yanılsama.** İlk denemede her tık bir sayfa
ilerletmiyor göründü. Sebep sitede değil, test tarayıcısında: başsız Chromium'da
`requestAnimationFrame` saniyede ~2 kare çalışıyor, bu yüzden okun kullandığı
`scrollBy({ behavior: "smooth" })` animasyonu 3 saniyeye yayılıyor. Aynı kapta
ölçüldü — anlık kaydırma 31 ms, yumuşak kaydırma 3004 ms, rAF 2 kare/sn.
Bekleme ölçütü "kaydırma durdu" yerine "hedef sayfa hizalandı" olarak
düzeltilince dört dilde de 18/18 çıktı. Gerçek cihazda rAF 60 kare/sn
çalıştığı için bu gecikme oluşmuyor.

**5 — Kaydırma çubuğu**

| Ölçüm | Sonuç |
|---|---|
| Kabın yatay çubuğa ayırdığı yer (`offsetHeight − clientHeight`) | **0 px** |
| Hesaplanan `scrollbar-width` | `none` |
| Yayına giden CSS'te kural | `.kitap::-webkit-scrollbar{display:none}` + `.kitap-icerik::-webkit-scrollbar{display:none}` |
| Belgede yatay taşma | 0 px (390 px ve 1280 px'te) |
| Kaydırma işlevi duruyor mu | evet (`scrollWidth` 3904 > `clientWidth` 390) |

Ekran görüntüsüyle de bakıldı: çubuk çizilmiyor, sayfa tek ekrana oturuyor.

**6 — Kapalı Pide ve sayaç**

Kapalı Pide **2 sayfa**: 1. sayfa Kıymalı · Kaşarlı · Sucuklu, 2. sayfa
Kıyma & Kaşar · Karışık · Lahmacun. Kitap toplam **10 sayfa** — sayaç dört
dilde son sayfada 10/10 gösteriyor (`Sayfa 10 / 10` · `Page 10 / 10` ·
`صفحة 10 / 10` · `Страница 10 / 10`). `kapali-pide-3` artık bir sayfa değil.

**7 — Konsol ve ağ**

Oturum boyunca dört dilde liste sayfaları, kitap sayfaları, 72 ok tıklaması,
20 kategori tıklaması ve yönlendirme testleri yapıldı; sonunda konsol
sayacı: **0 hata, 0 uyarı**. Ağ isteklerinin tamamı 200 — başarısız istek
yok. Görsellerde bozuk yükleme yok (12 görsel, `naturalWidth = 0` olan yok;
2 görsel henüz yüklenmemişti, bunlar görüş alanı dışında ve tembel yükleniyor).

---

**Küçük gözlem (düzeltilmedi):** Kitapta parmakla veya okla sayfa çevrilince
adres güncelleniyor ama sekme başlığı (`document.title`) açılış sayfasının
başlığında kalıyor — örneğin `/tr/menu/icecekler-2`'de başlık hâlâ "Kapalı Pide
Çeşitleri". Yalnızca tarayıcı sekmesini etkiliyor, ekrandaki içeriği değil;
QR ile açılan tam ekran görünümde görünmüyor. Bu aşamanın kapsamı dışında
olduğu için dokunulmadı.

**Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `ILERLEME.md` | Özet, durum tablosu, bu rapor |

Kod değişmedi — bu aşama birleştirme, dağıtım ve doğrulamadan ibaret.

**Sıradaki adım:** Bekleyen içerik kararları: QR adresi, organizasyon içeriği,
font kararı, eksik fotoğraflar, 4 teyit edilmemiş fiyat, Arapça çevirilerin
ana dili konuşan biri tarafından gözden geçirilmesi.

=== RAPOR SONU ===

---

## Aşama 13 — "Düble" → "Duble" Yazım Düzeltmesi · 2026-08-28

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 13 — Kapalı Pide tablosundaki üçüncü fiyat sütununun Türkçe
başlığının düzeltilmesi (tamamı)

---

**1 — Kelimenin geçtiği yerler**

Metin tek yerde tanımlı: `data/menu.ts`, `PIDE_SUTUNLARI` içindeki üçüncü
sütunun `baslik.tr` alanı. Oradan iki tüketiciye gidiyor — görünen sütun
başlığı (`app/[dil]/menu/[sayfa]/page.tsx:118`) ve fiyatı teyit edilmemiş
kalemleri listeleyen `dogrulanmamisFiyatlar()` (`menu.ts:923`).

Ayrı bir ekran okuyucu etiketi **yok**: sütun başlığı `<th scope="col">` ve
`aria-label` taşımıyor, yani görünen metin aynı zamanda erişilebilir ad. Tek
düzeltme ikisini de kapsıyor.

| Satır | Değişiklik |
|---|---|
| 203 | `tr: "Düble"` → `tr: "Duble"` — tek gerçek metin değişikliği |
| 86 · 287 · 384 | Kod yorumlarındaki yazım, dosya kendi içinde tutarlı kalsın diye |

**Dokunulmayanlar:** `en: "Double"`, `ar: "دوبل"`, `ru: "Двойная"`. `kod: "duble"`
da aynı bırakıldı — zaten ASCII'ydi ve ürünlerdeki yedi `sutun: "duble"`
referansı buna bağlı; değiştirilseydi fiyatlar sütunlarını kaybederdi.
Ürün, fiyat ve bölme yapısına dokunulmadı.

**2 — Doğrulama**

Üretim derlemesi yerelde çalıştırılıp 390 px telefon genişliğinde bakıldı.

| Ölçüm | Sonuç |
|---|---|
| TR sütun başlıkları (ekran) | 1 HAMUR · 1,5 HAMUR · **DUBLE** |
| Erişilebilirlik ağacında sütun adı | `columnheader "Duble"` |
| Kitabın tüm metninde `düble` (harf duyarsız) | **0** |
| EN / AR / RU başlıkları | `Double` · `دوبل` · `Двойная` — değişmedi |
| Sayfa 2 ürün ve fiyatları | Kıyma & Kaşar 220/330/440 · Karışık 240/350/480 · Lahmacun 100/—/— |
| Konsol | 0 hata, 0 uyarı |
| `tsc` · `lint` · `build` | temiz, 58 statik sayfa |

Başlık ekranda büyük harfle görünüyor; bu bütün sütun başlıklarına uygulanan
mevcut `text-transform: uppercase`'ten geliyor (1 HAMUR da öyle). Metnin
kendisi ve ekran okuyucunun okuduğu ad "Duble".

**Karakter denetimi.** Yazılan metin bayt bayt kontrol edildi: D U+0044,
u U+0075, b U+0062, l U+006C, e U+0065 — saf ASCII. İstekte geçen bir
tırnakta Latin `e` yerine Kiril `е` görünümlü bir karakter vardı; alınsaydı
arama ve ekran okuyucu bozulurdu.

**Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `data/menu.ts` | Sütun başlığının Türkçe karşılığı + üç kod yorumu |
| `ILERLEME.md` | Özet, durum tablosu, bu rapor |

**Sıradaki adım:** Bekleyen içerik kararları değişmedi: QR adresi, organizasyon
içeriği, font kararı, eksik fotoğraflar, 4 teyit edilmemiş fiyat, Arapça
çevirilerin gözden geçirilmesi.

=== RAPOR SONU ===

---

## Aşama 14 — Her Kategori Tek Sayfa ve Aşağı Ok İpucu · 2026-08-28

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 14 — Kategori içi bölmenin kaldırılması, aşağı ok ipucu ve
sığdırma uğruna verilmiş iki tavizin geri alınması (tamamı)

---

**1 — Bölme kavramı modelden kaldırıldı**

Kitap 10 sayfadan **5 sayfaya** indi; her kategori kendi sayfasında:

| Sayfa | Kategori | Ürün | Eskiden |
|---|---|---|---|
| 1 | Kapalı Pide Çeşitleri | 6 | 2 sayfa (3+3) |
| 2 | Izgara Çeşitleri | 14 | 4 sayfa (4+3+4+3) |
| 3 | Salatalar | 1 | 1 sayfa |
| 4 | Tatlı Çeşitleri | 3 | 1 sayfa |
| 5 | İçecekler | 7 | 2 sayfa (4+3) |

Toplam 31 ürün — eskisiyle aynı.

`sayfaBolumleri` alanı boş bırakılmadı, `Kategori` tipinden **silindi**;
`MenuSayfasi`'ndan da `kategoriIcindeNo` ve `kategoriToplamSayfa` kalktı.
Bölme verisi olmayınca "bölüm toplamı ürün sayısını tutmuyor" hatası da
imkânsız hale geldi, `sayfalariUret()` içindeki doğrulama gereksizleşti.
`kategorininIlkSayfasi` → `kategorininSayfasi`, `sayfaAraligi` →
`sayfaNumarasi` (artık aralık değil tek numara). `data/menu.ts` 78 satır
kısaldı.

**Ürün, fiyat ve çeviri satırlarında sıfır değişiklik** — diff üzerinde
`tutar:`, `ad:`, `icerik:`, `gorsel:` ve dil alanları arayarak doğrulandı,
hiçbiri eşleşmedi.

**2 — Sığdırma uğruna verilen tavizler geri alındı**

| Taviz | Yeni durum |
|---|---|
| Kapalı Pide tablosunda fotoğraf sütunu telefonda gizliydi | Her ekranda görünür. Ölçü bildirimi (`w-14 md:w-52`) değişmedi; yalnızca gizlilik kalktı |
| Açıklamalar telefonda tek satıra kırpılıyordu | Tam metin |

**3 — Aşağı ok**

Alt şeritte, "Menüye dön" ile sayacın **tam ortasında**. İçeriğin dışında
durduğu için hiçbir ürünü ya da fiyatı örtmüyor. Görünen daire için mevcut
`.kitap-ok-govde` sınıfı kullanıldı — yan oklarla aynı zemin, halka, gölge
ve hover/active davranışı; ikisinin gövdesi de 20×20 px, dokunma hedefi
44×44 px.

**Kararlar:**

- **Uçta gizleniyor.** Okun tek işi "aşağıda devamı var" demek; sonda devamı
  yok, duran ok yanlış bilgi verirdi. Yan oklarda da aynı karar verilmişti.
  Yukarı kaydırınca geri geliyor.
- **Tıklanabilir düğme.** Yan oklarla aynı görünen bir şeye müşteri basar;
  basınca hiçbir şey olmaması bozukluk hissi verirdi. Ayrıca klavye ve
  anahtar kullanıcısına kaydırmanın tek yolunu veriyor. Bir tıkta görünür
  yüksekliğin %85'i kadar kayıyor (bir miktar örtüşme kalsın diye tam ekran
  boyu değil); `azHareket()` açıksa yumuşak animasyon yerine anlık.
- **JavaScript kapalıyken hiç render edilmiyor** — taşma ölçülemeyeceği için
  doğru bir ipucu üretilemez, yan oklardaki davranışın aynısı. Sunucudan
  gelen ham HTML'de ok yok (üç dilde arayarak doğrulandı) ama dikey kaydırma
  kutusu var: kaydırma saf CSS olduğu için JavaScript'siz de çalışıyor.
  İpucu kaybolur, işlev kaybolmaz.

**Yön.** Chevron'un kendi sınıfı var (`.kitap-ok-simge-asagi`), yan okların
`--ok-flip` aynalama zincirine bilerek girmiyor: aşağı her iki yazma
yönünde de aşağıdır. Arapça'da ölçüldü — `transform: none`, ok ekranın tam
ortasında (x=195, ekran genişliği 390).

**Ortak mantık.** "Hangi sayfa aktif" bilgisi artık `components/aktifSayfa.ts`
içinde tek yerde; `SayfaOklari` ve `AsagiOk` aynı hook'u kullanıyor —
üçüncü bir IntersectionObserver kopyası yazılmadı. `SayfaSayaci`'nin
gözlemcisi adres yazma sorumluluğuyla iç içe olduğu için ona dokunulmadı.

**4 — Eski adresler**

Yön tersine döndü: eskiden `kapali-pide` → `kapali-pide-1` idi, şimdi tam
tersi. Eski kurallar **silindi**; bırakılsalardı yenileriyle sonsuz döngü
oluştururlardı.

| Ölçüm | Sonuç |
|---|---|
| `kapali-pide-1/2/3`, `izgara-1/2/3/4`, `icecekler-1/2` × 4 dil | **36/36** → 307, kendi kategorisine |
| 4 dil × 5 sayfa | 20/20 → 200 |
| `kapali-pide-4/0`, `izgara-5/9`, `icecekler-3`, `salatalar-1/2`, `tatlilar-1`, geçersiz slug, `/de/...` | 10/10 → 404 |
| `/` | 307 → `/tr` |

Numaralar tek tek yazıldı (regex'li parametre eşleşmesi), böylece hiç var
olmamış adresler 404 kalmaya devam ediyor.

**5 — Doğrulama (390×844, üretim derlemesi)**

| Test | Sonuç |
|---|---|
| Kategori listesinden gerçek tıklama (4 dil × 5 kategori) — görünen bölüm, başlık, ürünler, sayaç | **20/20** |
| Her ölçümde görüş alanında tek sayfa, tam 390 px | 20/20 |
| Yan oklar: 1→5 ileri, 5→1 geri, her adımda içerik + sayaç (4 dil) | **32/32** |
| Uçlarda ok gizlenmesi (s.1'de yalnız "sonraki", s.5'te yalnız "önceki") | 8/8 |
| Arapça yön: ileri = sola, geri = sağa | 8/8 |
| Aşağı ok, ölçülen taşmayla karşılaştırmalı (4 dil × 5 sayfa) | **20/20** |
| Aşağı okun şeritteki çakışması ("Menüye dön" ve sayaçla), 4 dil | **0 px²** |
| Şerit yüksekliği (ok eklendikten sonra) | 44 px — değişmedi |
| Konsol | 0 hata, 0 uyarı |
| `tsc` · `lint` · `build` | temiz, **38 statik sayfa** (40 kitap rotası 20'ye indi) |

**Aşağı ok davranışı** (TR/Izgara, taşma 744 px): ok görünür → 1. tık
0→603 → 2. tık 603→744 (son) → **ok kayboldu**; yukarı dönünce geri geldi.
Arapça'da aynı: 0→603→758, sonra kayboldu.

**Dikey kaydırma yatay konumu bozmuyor** — taşan sayfada `kitap.scrollLeft`
kaydedildi, sayfa içi dikey kaydırma yapıldı, tekrar ölçüldü:

| Dil | Önce | Dikey kaydırma sırasında | Sonra |
|---|---|---|---|
| TR | 390 | 390 | 390 |
| EN | 390 | 390 | 390 |
| AR (RTL) | −390 | −390 | −390 |
| RU | 390 | 390 | 390 |

**Kaydırma çubukları gizli kalmaya devam ediyor:** yatay çubuk 0 px, dikey
çubuk 0 px, `scrollbar-width: none` her ikisinde; kaydırma işlevi duruyor
(`scrollWidth > clientWidth` ve `scrollHeight > clientHeight`). Belgede
yatay/dikey taşma 0.

**6 — Ölçü karşılaştırması (yazı ve görsel boyutları değişmedi)**

Değişiklikten önce canlı adresten alınan temel ölçümle karşılaştırma, dil=en:

| Öğe | 390px önce → sonra | 1280px önce → sonra |
|---|---|---|
| `.kitap-baslik` | 24px → **24px** | 30px → **30px** |
| `.pide-sutun-basligi` | 12px → **12px** | 14px → **14px** |
| `.urun-ad` (pide) | 18px → **18px** | 20px → **20px** |
| `.urun-ad` (liste) | 18px → **18px** | 20px → **20px** |
| `.urun-fiyat` | 16px → **16px** | 18px → **18px** |
| `.urun-icerik` | 14px → **14px** | 15px → **15px** |
| `.alt-serit-baglanti` | 14px, 111×44 → **aynı** | — |
| Liste görseli / yer tutucu | 80×80 → **80×80** | 208×117 → **208×117** |
| Pide görseli | *gizli* → **56×56** | 208×117 → **208×117** |
| Alt şerit yüksekliği | 44 → **44** | — |
| Kitap içerik kutusu | 390×710 → **390×710** | — |

Punto, satır yüksekliği ve yazı kalınlığı **hiçbir öğede değişmedi**.
Görsellerin bildirilmiş ölçüleri de aynı. Telefonda pide görselinin
*gizli* → *56×56* olması senin kararın; 56 px zaten kodda bildirilen
telefon genişliğiydi, gizlilik kalkınca ortaya çıktı.

Tablo hücrelerinin genişlikleri birkaç piksel kaydı (örn. sütun başlığı
57→53 px). Sebep boyut değişikliği değil: fotoğraf sütunu geri gelince
tablo yerini yeniden paylaştırıyor, ayrıca sayfalar birleşince en uzun
ürün adı değişti. Punto sabit.

**Ölçüm sırasında karşılaşılan yanılsama.** Yatay geçişten hemen sonra
(700 ms) sığan bir sayfada aşağı ok hâlâ görünüyordu. Sebep sitede değil:
başsız Chromium'da `requestAnimationFrame` saniyede ~2 kare çalıştığı için
IntersectionObserver geri çağrısı geç geliyor. Bekleme 1,8 saniyeye
çıkarılınca dört dilde de 20/20 doğru çıktı. Gerçek cihazda gözlemci bir
kare sonra (~16 ms) haber veriyor.

**Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `data/menu.ts` | `sayfaBolumleri` kaldırıldı; `sayfalariUret()` sadeleşti; `kategorininSayfasi` / `sayfaNumarasi` |
| `app/[dil]/menu/[sayfa]/page.tsx` | Fotoğraf sütunu geri açıldı, kırpma kalktı, `(1/2)` işareti kalktı, `AsagiOk` bağlandı |
| `app/[dil]/menu/page.tsx` | Yeni yardımcı adları |
| `next.config.ts` | Eski adres yönlendirmeleri ters çevrildi |
| `components/AsagiOk.tsx` | **Yeni** — aşağı ok |
| `components/aktifSayfa.ts` | **Yeni** — paylaşılan aktif sayfa mantığı |
| `components/SayfaOklari.tsx` | Ortak hook'a geçti, 47 satır kısaldı |
| `data/arayuz.ts` | `asagiKaydir` etiketi (4 dil) |
| `app/globals.css` | `.kitap-ok-asagi`, `.kitap-ok-simge-asagi`, `.alt-serit`'e `relative`, `.pide-gorsel-hucre` her ekranda |
| `ILERLEME.md` | Özet, durum tablosu, bu rapor |

Palet, tipografi ve boşluklar değişmedi.

**Canlı doğrulama (2026-08-30, `9e4abc5`).** Push sonrası Vercel dağıtımı
otomatik tetiklendi, yeni sürüm ~45 saniyede canlıya indi. Ölçümler canlı
adres üzerinde tekrarlandı:

| Test | Sonuç |
|---|---|
| 4 dil × 5 sayfa | 20/20 → 200 |
| Eski numaralı adresler (9 slug × 4 dil) | **36/36** → kendi kategorisine 307 |
| Hiç olmamış adresler + `/de/...` | 9/9 → 404 |
| `/` | 307 → `/tr` |
| Kategori listesinden gerçek tıklama (4 dil × 5 kategori), görünen içerik | **20/20** |
| Aşağı ok, ölçülen taşmayla karşılaştırmalı (4 dil × 5 sayfa) | **20/20** |
| Yan oklar 1→5 ve 5→1 (4 dil) | **32/32** |
| Arapça yön: ileri = sola, geri = sağa, chevron aynalanmamış | doğru |
| Dikey kaydırma yatay konumu bozuyor mu (TR/AR/RU) | hayır — 390 sabit, AR −390 sabit |
| Aşağı ok dipte gizleniyor, yukarı dönünce geliyor | doğru |
| Kaydırma çubukları | yatay 0 px, dikey 0 px; kaydırma işlevi duruyor |
| Punto ve görsel ölçüleri | 24/12/18/14/16 px ve 80×80, 56×56 — temel ölçümle aynı |
| Konsol | 0 hata, 0 uyarı |

**Sıradaki adım:** Bekleyen içerik kararları: QR adresi, organizasyon içeriği,
font kararı, eksik fotoğraflar, 4 teyit edilmemiş fiyat, Arapça çevirilerin
gözden geçirilmesi.

=== RAPOR SONU ===

---

## Aşama 15 — Çini Levha Teması ve Dört Temalı Yapı · 2026-08-30

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 15 — Seçilen Çini Levha yönünün projenin tamamına uygulanması,
tema altyapısının kurulması, iki yeni temanın eklenmesi (tamamı)

---

**1 — Tema altyapısı**

Bir tema artık üç parçadan oluşuyor: `app/temalar/temalar.css` içinde bir
değişken bloğu, kendi yazı tipi modülü (`fontlar-*.ts`) ve kendi motifi
(`components/TemaMotifi.tsx`).

Ekranlar temayı **bilmiyor** — yalnızca `--t-*` değişkenlerini kullanıyorlar.
Hangi temanın geçerli olduğunu `<html>` üzerindeki `tema-*` sınıfı belirliyor;
kök layout onu `data/tema.ts` içindeki `AKTIF_TEMA` sabitinden okuyor. Tema
değiştirmek iki satır: `data/tema.ts` ve `app/temalar/aktif.ts`.

**Yazı tipleri bilinçli olarak ayrı tutuldu.** `aktif.ts` tek bir tema modülü
import ediyor; dördü birden import edilseydi dört takım yazı tipi yayına
girerdi. Üretimde yalnızca Çini'nin dört ailesi iniyor. Önizleme rotası
`tum-fontlar.ts` üzerinden hepsini yüklüyor, o dosya üretim ekranlarına hiç
girmiyor.

**Yakalanan mimari hata.** Tema farkları önce `.tema-cini .levha` gibi torun
seçicilerle yazılmıştı. `<html>` aktif temayı taşıdığı için bu kurallar
önizleme sarmalayıcısının **içinde de** eşleşiyordu — Mürekkep, Çini'nin levha
çerçevesini çiziyordu. Yapısal farkların tamamı değişkene taşındı
(`--t-levha-cizgi`, `--t-baslik-hiza`, `--t-kart-cizgi`, `--t-gorsel-golge`
vb.); `globals.css` içinde kalan tema torun seçicisi sayısı **0**.

**2 — Dört tema**

| Tema | Karakter | Yazı tipleri (Latin+Kiril / Arapça) |
|---|---|---|
| **Çini Levha** (aktif) | İznik levhası: porselen, kobalt, mercan | Cormorant + IBM Plex Sans / Reem Kufi + IBM Plex Sans Arabic |
| **Gece Ocağı** | Akşam, ateşin karşısı; koyu ve sıcak | Playfair Display + Inter / Amiri + Noto Sans Arabic |
| **Mürekkep** | Matbaa afişi; kalın kurallar, süsleme yok | Oswald + Source Sans 3 / Cairo + Noto Kufi Arabic |
| **Zeytin** | Bahçe ve sofra; yumuşak, sakin, organik | Lora + Nunito Sans / Noto Naskh Arabic + Noto Sans Arabic |

**Gece Ocağı silinmedi, dalda da bırakılmadı:** ana kodda `.tema-gece` bloğu ve
`fontlar-gece.ts` olarak yaşıyor, her derlemede derleniyor. Aktif etmek için
tek satır yeterli.

Not: eski başlık fontu Marcellus'ta Kiril ve Arapça yoktu; Rusça ve Arapça
başlıklar sistem serifine düşüyordu. Dört temanın dördü de bu boşluğu kapatıyor
— kapsamlar Google Fonts CSS API'sinden tek tek doğrulandı.

**3 — Ana seçim ekranı bağımsızlaştı**

Kitabın dilinden tamamen ayrıldı: sıkışık şerit yok, sayaç yok, ok yok, levha
çerçevesi yok, **dil kontrolü de yok** (senin kararın). Ortalanmış motif,
"Huzur Pide", ince ayraç ve iki iri buton. Sunucudan gelen HTML üzerinde dört
dilde doğrulandı — `dil-secenek`, `sayfa-numarasi`, `kitap-ok` ve `class="kitap"`
sayıları **0**, `secim-karti` var. Akış aynı: dil seçimi → ana seçim → menü.

Bu kural dört temanın hepsinde geçerli.

**4 — Rusça ad sütunu sıkışması (boyut küçültmeden)**

Çok fiyatlı tabloda ürün adı, gövde fontu yerine temanın **başlık fontunu**
kullanıyor (Çini'de Cormorant). Aynı tarayıcıda A/B ölçüldü — punto,
satır yüksekliği ve görsel ölçüsü sabit tutularak yalnızca font ailesi
değiştirildi:

| Ürün | Gövde fontuyla | Başlık fontuyla | Kazanç |
|---|---|---|---|
| Кыймалы (с фаршем) | 2 | 2 | — |
| Кашарлы (с сыром) | 2 | 2 | — |
| Суджуклу (с суджуком) | 3 | **2** | 1 satır |
| Кыйма и кашар (фарш и сыр) | 4 | **3** | 1 satır |
| Карышык (ассорти) | 2 | 2 | — |
| Лахмаджун (тонкая лепёшка…) | 4 | 4 | — |
| **Toplam** | **17 satır** | **15 satır** | **2 satır** |

Ölçüler değişmedi: ad 17px, açıklama 13px, fiyat 13px, başlık 28px, görsel
56×56. En uzun ad (Лахмаджун, 34 karakter) hâlâ 4 satır — sayfa artık dikey
kaydığı için bu bir bozulma değil.

**5 — Karo deseni yumuşatıldı**

Karo ölçüsü 1,4rem → **0,75rem**, opaklık %5,5 → **%3**. Yakından doku
hissediliyor, uzaktan düz zemin okunuyor.

**6 — Doğrulama (390×844, üretim derlemesi)**

| Test | Sonuç |
|---|---|
| Kategori listesinden gerçek tıklama (4 dil × 5 kategori) — adres, görünen bölüm, başlık, ürünler, sayaç, aşağı ok | **20/20** |
| Her ölçümde görüş alanında tek sayfa, tam 390 px | 20/20 |
| Yan oklar 1→5 ve 5→1 (4 dil) | **32/32** |
| Uçlarda ok gizlenmesi | 8/8 |
| Arapça yön: ileri = sola, geri = sağa, aşağı ok ortada (x=195) ve aynalanmamış | doğru |
| Dikey kaydırma yatay konumu bozuyor mu | hayır — 390 sabit |
| Aşağı ok dipte gizleniyor, yukarı dönünce geliyor | doğru |
| Yatay taşma (belge ve gövde) | 0 |
| Kaydırma çubuğu | görünmüyor; kurallar yayına giden CSS'te |
| Konsol | **0 hata** (yalnızca 404 testinin kendi 404'ü) |
| `tsc` · `lint` · `build` | temiz, **150 statik sayfa** |

**JavaScript kapalıyken** (sunucudan gelen ham HTML, üç dilde): 31 ürün adı ve
5 dikey kaydırma kutusu var, yan ok ve aşağı ok **yok**. Menü görünüyor ve
kaydırılıyor; yalnızca ipucu kontrolleri kayboluyor — bugünkü davranışın
aynısı.

**7 — Kontrast (WCAG AA), dört tema**

Gerçek render edilmiş renkler üzerinden, saydamlıklar zemine düzleştirilerek,
Rusça sayfada ölçüldü. Her temada 11 öğe: başlık, ürün adı, açıklama, fiyat,
sütun başlığı, marka, pasif/aktif dil düğmesi, "menüye dön", sayaç ve yer
tutucu ikonu (metin dışı, eşik 3:1).

| Tema | Geçen | En düşük ölçüm |
|---|---|---|
| Çini Levha | **11/11** | Fiyat 5,30 (eşik 4,5) |
| Gece Ocağı | **11/11** | Yer tutucu ikonu 5,77 (eşik 3,0) |
| Mürekkep | **11/11** | Yer tutucu ikonu 4,49 (eşik 3,0) |
| Zeytin | **11/11** | Yer tutucu ikonu 3,99 (eşik 3,0) |

Gece'de önceki önizlemede 2,84:1 kalan yer tutucu ikonu düz renge çekilip
açıldı: **5,77:1**.

**Değiştirilen dosyalar:**

| Dosya | Durum |
|---|---|
| `app/temalar/` | **Yeni** — `temalar.css` (dört tema), dört font modülü, `aktif.ts`, `tum-fontlar.ts` |
| `data/tema.ts` | **Yeni** — tema kodları, adlar, `AKTIF_TEMA` |
| `components/TemaMotifi.tsx` | **Yeni** — dört motif, logo yerine |
| `components/ekranlar.tsx` | **Yeni** — altı ekranın tamamı tek yerde |
| `app/[dil]/not-found.tsx` | **Yeni** — 404 |
| `app/[dil]/onizleme/[tema]/` | **Yeni** — dört tema × altı ekran önizlemesi |
| `app/globals.css` | Bileşen katmanı tema değişkenlerine taşındı |
| `app/[dil]/layout.tsx` | Tema sınıfı ve aktif tema fontları |
| Sayfa dosyaları (5) | İnce sarmalayıcıya indi |
| `components/UstBaslik.tsx` · `DilKontrolu.tsx` · `UrunGorseli.tsx` · `SayfaSayaci.tsx` | Tema değişkenleri, `tema` ve `yolOneki` aktarımı |
| `onizleme-gorselleri/` | Mürekkep, Zeytin ve uygulanmış Çini görüntüleri |

`data/menu.ts` ve `data/arayuz.ts` içeriğine dokunulmadı: ürün, fiyat, çeviri
ve açıklamalar aynı. Rotalar, yatay akış, sayfa yapısı, oklar ve RTL davranışı
değişmedi.

**Bilinen not:** önizleme rotası dört temanın yazı tiplerini de çektiği için
derleme sırasında 16 Google Fonts ailesi indiriliyor; bir kez geçici ağ
hatasıyla derleme başarısız oldu, tekrarında geçti. Üretim ekranları bundan
etkilenmiyor (yalnızca aktif temanın aileleri).

**Sıradaki adım:** Push onayı bekleniyor.

=== RAPOR SONU ===

---

## Aşama 16 — Admin Paneli: Firebase (Firestore + Authentication) · 2026-09-01

=== RAPOR BAŞLANGICI ===

**Adım:** Aşama 16 — Menü verisinin Firestore'a taşınması ve mekân sahibinin
tema, fiyat ve ürün yönetebildiği panelin kurulması (tamamı)

**Durum:** Dalda (`panel/firebase`), push onayı bekleniyor. Üretim (`main`)
değişmedi. Firebase Storage kurulmadı — fotoğraf yükleme sonraki aşamaya
bırakıldı.

---

**1 — Alınan kararlar**

| Karar | Sonuç |
|---|---|
| Yeni ürünün çevirileri | Dört dil alanı; yalnızca Türkçe zorunlu, boşlar menüde Türkçe'ye düşüyor |
| Giriş | E-posta + şifre, panelde kayıt ekranı yok; hesaplar yalnızca konsoldan |
| Hata koruması | Kaydetmeden önce özet + üç kattan fazla fark veya sıfırda kırmızı uyarı |
| Fotoğraf | Storage yok; ürün fotoğrafsız ekleniyor, çalışmayan alan gösterilmiyor |
| Panel arayüzü | Menü temasından ayrı, sade yönetim arayüzü |

**2 — Ücretsiz sınırlar (firebase.google.com/pricing)**

| Servis | Sınır | Kullanımımız | Doluluk |
|---|---|---|---|
| Firestore depolama | 1 GiB | 37 belge ≈ 45 KB | %0,004 |
| Firestore okuma | 50.000/gün | Tam yeniden üretim ~740; günde 20 düzenleme ≈ 15.000 | %30'un altı |
| Firestore yazma | 20.000/gün | Fiyat değişikliği = 1 yazma | %0,25 |
| Authentication | 50.000 aylık kullanıcı | 1 hesap | %0,002 |

Müşteri menüyü açtığında Firestore'a **gidilmiyor** — sayfalar statik. Okuma
yalnızca derlemede ve panelden bir şey değişince yeniden üretimde oluyor.

**3 — Taşıma**

Taşımadan önce `data/menu.ts` iki biçimde yedeklendi (`.ts` kopyası +
makine okunur `.json`). Taşıma idempotent: belge kimlikleri mevcut `slug` ve
`id` değerleri.

Doğrulama betiği Firestore'u `data/menu.ts` ile **alan alan** karşılaştırıyor
— sayı tutması yetmiyor, her alanın değeri kıyaslanıyor:

| Ölçüm | Sonuç |
|---|---|
| Kategori | 5 / 5 |
| Ürün | **31 / 31** |
| Fiyat hücresi | 43 |
| Teyit edilmemiş fiyat | **4 / 4** |
| Alan farkı | **0** |

Dört dildeki adlar, açıklamalar, görsel bilgileri ve `dogrulandi` işaretleri
aynen taşındı.

**4 — Güvenlik**

Kurallar Firebase Rules API'siyle yayına alındı ve yayındaki kümenin az önce
yüklenen küme olduğu geri okunarak doğrulandı.

Mimarinin özü: **tarayıcıdan Firestore'a hiç yazılmıyor.** Bütün yazmalar
Server Action'lardan Admin SDK ile geçiyor, bu yüzden istemciye sıfır yazma
izni verilebiliyor.

İstemci SDK'sıyla — yani mekân sahibinin tarayıcısındaki koşullarda —
yapılan testler:

| Deneme | Beklenen | Sonuç |
|---|---|---|
| Ürün okuma | izin verilir | 31 belge okundu |
| `urunler` yazma | reddedilir | permission-denied |
| `ayarlar` yazma | reddedilir | permission-denied |
| `kategoriler` yazma | reddedilir | permission-denied |
| `yoneticiler` yazma | reddedilir | permission-denied |
| `yoneticiler` okuma | reddedilir | permission-denied |

**6/6 geçti.**

Panel erişimi ayrıca sınandı:

| Deneme | Sonuç |
|---|---|
| Girişsiz `/panel` | Giriş formu; panel içeriği HTML'de **yok** |
| Girişsiz `/panel/fiyatlar`, `/tema`, `/urun-ekle` | 307 yönlendirme, içerik sızmıyor |
| Yetkisiz hesapla **doğru şifreyle** giriş | Reddedildi: "Bu hesabın panele erişim yetkisi yok." |
| Yönetici hesabıyla giriş | Panel açıldı |

İki kademeli yetki: giriş yapmak yetmiyor, `yoneticiler/{uid}` belgesi de
gerekiyor. Ayrıca her Server Action kendi içinde yetkiyi yeniden doğruluyor —
sayfa korumasına tek başına güvenilmiyor, çünkü bir Server Action doğrudan da
çağrılabilir.

Test için geçici iki hesap açıldı (biri yönetici, biri değil), testler
bitince ikisi de silindi. Mekân sahibinin hesabının şifresine dokunulmadı.

**5 — Gizli bilgiler**

| Değer | Yer | Gizli mi |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | `.env.local` | Hayır — tarayıcıya zaten gidiyor |
| `FIREBASE_SERVICE_ACCOUNT` | `.env.local` (sunucu) | **Evet** |

`.env.local` yoksayılıyor (`.gitignore:19`), ek olarak `*serviceAccount*.json`
ve `*firebase-adminsdk*.json` kalıpları eklendi; dördü de tek tek sınandı.
Commit geçmişi `private_key` ve `BEGIN PRIVATE KEY` için tarandı: **temiz**.
Servis hesabı dosyası proje klasörüne hiç kopyalanmadı.

**6 — Panel**

Menü temasından **ayrı** bir yönetim arayüzü (`--p-*` değişkenleri).
Gerekçeler `panel.css` başında: tema panelden değiştiği için panel de onu
giyseydi şekil değiştirirdi; menü tipografisi vitrin tipografisi, form için
yanlış; ve panel `--t-*`'ye bağlanırsa tema değişiklikleri paneli kırar.

Dört ekran, hepsi Türkçe, iri dokunma hedefli:
**Giriş** (yalnızca e-posta ve şifre) · **Ana ekran** (üç büyük düğme) ·
**Fiyatlar** · **Yeni ürün** · **Menü görünümü**.

**7 — Doğrulama (390×844, üretim derlemesi)**

| Test | Sonuç |
|---|---|
| Fiyat değişikliği menüye yansıyor mu | Kıymalı 1 Hamur 200 → **265 ₺**, ekranda doğrulandı; diğer fiyatlar değişmedi |
| Kaydetme özeti | "Kıymalı · 1 Hamur 200 ₺ → 265 ₺" |
| Büyük değişim uyarısı | 200 → 2.000 girildi, satır kırmızı ve uyarı çıktı; geri alındı |
| Yeni ürün menüde görünüyor mu | Salatalar'a eklendi, menüde **123 ₺** ve yer tutucusuyla göründü |
| Tema değişikliği | Gece Ocağı seçildi → `tema-gece`, zemin `rgb(20,16,13)`, başlık Playfair Display; sonra Çini'ye geri alındı |
| Kategori tıklama, ekranda görünen içerik (AR + RU) | 10/10 |
| 4 dil × 6 ekran | 24/24 |
| JS kapalıyken menü | Ham HTML'de 31 ürün adı ve 5 dikey kaydırma kutusu var, ok yok |
| Konsol | **0 hata** |
| `tsc` · `lint` · `build` | temiz, **150 statik sayfa** |

**Yakalanan ve düzeltilen sorun.** Tema panelden seçilebilir olunca dört
temanın font modülü de derlemeye giriyor ve Next hepsini `<link rel=preload>`
ile çağırıyordu — ölçüldü: **46 font ön yüklemesi**. Bir QR menüde bu
gereksiz yük. Tema fontlarında `preload: false` yapıldı; sonuç **0 ön
yükleme**, ve tarayıcı yalnızca aktif temanın ailelerini indiriyor (Gece'de
ölçüldü: Playfair Display + Inter, başka aile inmedi).

**Testlerin izi silindi:** test ürünü silindi, değiştirilen fiyat yedekteki
değerine döndürüldü, tema Çini'ye alındı, test hesapları kaldırıldı. Taşıma
doğrulaması tekrar çalıştırıldı: **fark 0**, tek yönetici kaldı.

**Eklenen / değiştirilen başlıca dosyalar:**

| Dosya | İş |
|---|---|
| `data/menuKaynak.ts` | **Yeni** — menü ve tema Firestore'dan; `cache()` ile aynı render'da tek okuma |
| `lib/firebase-sunucu.ts` · `firebase-istemci.ts` | Admin SDK (server-only) ve yalnızca Auth için istemci |
| `lib/oturum.ts` | httpOnly oturum çerezi, iki kademeli yetki |
| `app/panel/**` | Panelin dört ekranı, Server Action'lar, kendi CSS'i |
| `firestore.rules` · `storage.rules` | İstemciye sıfır yazma izni |
| `betikler/**` | Yedek, taşıma, taşıma doğrulama, kural testi, yönetici ekleme, test hesapları, temizlik |
| `data/tema.ts` | Aktif tema sabiti kaldırıldı; seçilebilir temalar (Zeytin hariç) |
| `app/[dil]/layout.tsx` ve sayfalar | Tema ve içerik Firestore'dan; sayfalar statik kaldı |

`data/menu.ts` içeriğine dokunulmadı; tipler ve saf yardımcılar oradan
kullanılmaya devam ediyor, yedeği de repoda.

**Sıradaki adım:** Push onayı bekleniyor. Sonrasında Firebase Storage (Blaze)
kurulursa fotoğraf yükleme eklenecek — veri yapısındaki `gorsel` alanı ve
panel akışı bunun için hazır bırakıldı.

=== RAPOR SONU ===
