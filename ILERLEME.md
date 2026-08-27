# Huzur Pide — İlerleme Kaydı

## Proje Özeti

**Proje:** Huzur Pide dijital menü uygulaması
**Güncel aşama:** Aşama 2 tamamlandı — sıradaki: Aşama 3 (dil mantığı + çeviriler)
**Son güncelleme:** 2026-08-27 12:15

### Genel Durum

| Aşama | Konu | Durum |
|---|---|---|
| 1 | Dil seçim ekranı tasarımı | **Tamamlandı** (5/5 adım) |
| 2 | Menü sayfaları tasarımı | **Tamamlandı** (7/7 adım) |
| 3 | Dil değiştirme mantığı + menü verisi | Başlanmadı |
| 4 | RTL (Arapça) desteğinin devreye alınması | Başlanmadı |

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

### Depo

https://github.com/Zeynepsoykan99/huzur-pide (private, dal: `main`)

### Ekranlar

| Yol | Ekran |
|---|---|
| `/` | Dil seçimi (Aşama 1) |
| `/menu` | Ekran A — kategori listesi |
| `/menu/kapali-pide` | Ekran B — Kapalı Pide Çeşitleri |
| `/menu/izgara` | Ekran B — Izgara Çeşitleri |
| `/menu/salatalar` | Ekran B — Salatalar |
| `/menu/tatlilar` | Ekran B — Tatlı Çeşitleri |
| `/menu/icecekler` | Ekran B — İçecekler |

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
| cream-200 | #E0CDB8 | Yedek ara ton |
| latte-400 | #C8A27A | Buton normal |
| latte-500 | #B08968 | Buton hover / active |
| latte-600 | #96745A | Kenarlık (ring) |
| cocoa-700 | #6B5342 | İkincil metin |
| cocoa-900 | #4A3728 | Ana yazı rengi |
| paprika-400 | #C2622A | Açık turuncu (yedek) |
| paprika-500 | #B0561F | Kategori başlıkları (büyük metin) |
| paprika-600 | #9A4A1A | Turuncu, küçük metin gerekirse |

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
