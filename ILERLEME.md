# Huzur Pide — İlerleme Kaydı

## Proje Özeti

**Proje:** Huzur Pide dijital menü uygulaması
**Güncel aşama:** Aşama 2 — Menü sayfaları (3/7 adım)
**Son güncelleme:** 2026-08-27 11:50

### Genel Durum

| Aşama | Konu | Durum |
|---|---|---|
| 1 | Dil seçim ekranı tasarımı | **Tamamlandı** (5/5 adım) |
| 2 | Menü sayfaları tasarımı | Devam ediyor (3/7 adım) |
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
- [ ] Adım 3 — Ekran A: Kategori listesi
- [ ] Adım 4 — Ekran B: Kategori sayfaları
- [ ] Adım 5 — Görseller
- [ ] Adım 6 — Doğrulama

### Depo

https://github.com/Zeynepsoykan99/huzur-pide (private, dal: `main`)

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

Aşama 1 raporları sonradan **tek birleşik rapor** hâlinde toplandı. Aşama 2 için
Zeynep tekrar **adım adım rapor** istedi; bu aşamanın raporları her adım sonunda
ayrı blok olarak ekleniyor. Aşama sonunda istenirse yine tek rapora toplanabilir.
Her durumda özet bölümü güncellenir, önceki raporların üzerine yazılmaz.

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

## Aşama 2 — Menü Sayfaları

### Adım 0 · 2026-08-27 11:36

=== RAPOR BAŞLANGICI ===
Adım: Aşama 2 / Adım 0 — Next.js'e geçiş
Yapılanlar:
- Ortam doğrulandı: Node v24.19.0, npm 11.17, `gh` 2.97 yetkili (`Zeynepsoykan99`, scope `repo`)
- Next.js 16.2 hattının son kararlı sürümü tespit edildi (**16.2.12**) ve buna sabitlendi
- `create-next-app@16.2.12` ile iskelet kuruldu (App Router + TypeScript + Tailwind v4 + ESLint), geçici bir dizinde üretilip mevcut projeye birleştirildi
- Tailwind CDN kaldırıldı; palet `app/globals.css` içindeki `@theme` bloğuna taşındı
- Palete `paprika-400/500/600` turuncu tonları eklendi (kategori başlıkları için, Adım 4'te kullanılacak)
- Marcellus fontu Google Fonts CDN'inden çıkarıldı; tam karakter kümesi TTF olarak indirilip woff2'ye çevrildi ve `app/fonts/Marcellus-Regular.woff2` olarak repoya kondu, `next/font/local` ile servis ediliyor
- Aşama 1 ekranı `app/page.tsx` + `app/layout.tsx` olarak taşındı; palet, tipografi, düzen, etkileşim durumları ve RTL kurgusu birebir korundu
- Aşama 1 varlıkları `assets/` altından `public/` altına taşındı (`public/flags/`, `public/logo.svg`, `public/favicon.svg`)
- `index.html`, `assets/` klasörü, Next'in örnek SVG'leri ve kök dizindeki boş `huzur pide` dosyası silindi
- `.gitignore` Next.js projesine göre yeniden yazıldı (`.next/`, `node_modules/`, `.env*`, `.vercel` vb.)
- `sharp` ve `unrs-resolver` kurulum betikleri onaylandı (npm 11'in yeni `allow-scripts` kapısı); `sharp` Adım 5'te `next/image` optimizasyonu için gerekli
- `npm run lint` ve `npm run build` hatasız geçti
- Taşıma 390x844, 768x1024 ve 1280x800 çözünürlüklerinde ve `dir="rtl"` ile yeniden doğrulandı
Oluşturulan/Değiştirilen dosyalar:
- `app/layout.tsx` (yeni) — kök layout, `next/font/local`, metadata, viewport
- `app/page.tsx` (yeni) — dil seçim ekranı
- `app/globals.css` (yeni) — `@theme` paleti, taban katmanı, bileşen sınıfları
- `app/fonts/Marcellus-Regular.woff2` (yeni, 17,9 KB)
- `public/flags/{tr,gb,ae,ru}.svg`, `public/logo.svg`, `public/favicon.svg` (taşındı)
- `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `next-env.d.ts` (yeni)
- `AGENTS.md`, `CLAUDE.md`, `README.md` (create-next-app şablonundan)
- `.gitignore` (yeniden yazıldı)
- `index.html`, `assets/**`, `huzur pide` (silindi)
- `ILERLEME.md` (güncellendi)
Alınan kararlar:
- **Sürüm 16.2.12'ye sabitlendi.** "Next.js 16.2" dedin; 16.2 hattında 16.2.0–16.2.12 mevcut, en son yaması alındı. `^` ile değil tam sürümle yazıldı — bir QR menüde beklenmedik bir minor güncellemenin tasarımı bozma riski, otomatik yama almanın faydasından büyük.
- **Tailwind v4 kullanıldı** (Next 16'nın `create-next-app` varsayılanı). v4'te `tailwind.config.js` yok; palet `globals.css` içindeki `@theme` bloğunda tanımlanıyor. İsimlendirilmiş renk isteğin karşılanıyor — `bg-latte-400`, `text-paprika-500` gibi sınıflar aynen çalışıyor, sadece tanım yeri değişti.
- **`hoverOnlyWhenSupported` ayarı kaldırıldı** çünkü Tailwind v4'te bu davranış artık varsayılan. Dokunmatik ekranda hover'ın yapışması sorunu ek yapılandırma olmadan çözülü geliyor.
- **Marcellus tek dosyada, tam karakter kümesiyle.** Google'ın CSS API'si fontu `latin` ve `latin-ext` diye iki woff2'ye bölüyor; Türkçe'deki `ş` ve `ğ` latin-ext'te, `ç` ve `ı` latin'de. `next/font/local` alt küme başına `unicode-range` desteklemediği için iki dosya doğru çalışmazdı. Bunun yerine tam TTF (42 KB) indirilip woff2'ye sıkıştırıldı: **17,9 KB tek dosya**, iki alt kümenin toplamından (23,4 KB) küçük ve tek istek.
- **`next/font/google` yerine `next/font/local` seçildi.** `next/font/google` da fontu kendi alan adımızdan servis eder, ama derleme anında Google'a bağlanır. Dosya repoda olduğunda derleme de tamamen çevrimdışı çalışıyor — bayrakları yerel tutma gerekçesinin aynısı.
- **Marcellus'ta kiril ve arap alfabesi yok.** Bu font sadece başlıklarda kullanılıyor; Rusça/Arapça başlıklarda tarayıcı `Georgia → serif` yedeğine düşecek. Gövde metni zaten sistem fontlarında olduğu için dil ekranındaki "Русский" ve "العربية" etiketleri etkilenmiyor.
- **Bayraklar ve logo için `next/image` değil düz `<img>` kullanıldı.** Dört bayrağın en-boy oranı farklı ve `w-auto` ile ölçekleniyorlar; `next/image` sabit `width`/`height` istiyor. Ayrıca 300 byte'lık bir SVG'de optimizasyonun kazancı yok. Adım 5'teki ürün fotoğraflarında `next/image` düzgün şekilde kullanılacak.
- **`outline-none` yerine `outline-hidden`.** Taşıma sırasında odak halkasının kaybolduğu fark edildi: Tailwind v4'te `outline-none` artık `--tw-outline-style` değişkenini de `none` yapıyor ve `focus-visible:outline-2` bunu miras aldığı için halka çizilmiyordu. `outline-hidden` + `focus-visible:outline-solid` ile düzeltildi ve tarayıcıda tekrar doğrulandı.
- **`AGENTS.md` / `CLAUDE.md` şablon dosyaları silinmedi**; create-next-app'in ürettiği Next.js kılavuz notları, ileride işe yarayabilir.
Ölçüm sonuçları (Aşama 1 ile karşılaştırmalı):

| Ölçüm | Aşama 1 | Adım 0 sonrası |
|---|---|---|
| Metin / buton (normal) | 4.77:1 | 4.77:1 |
| Metin / buton (hover+active) | 3.55:1 | 3.55:1 |
| Metin / sayfa arka planı | 9.83:1 | 9.83:1 |
| Alt metin / sayfa | 5.51:1 | 5.51:1 |
| Buton yüksekliği | 56px | 56px |
| Etiket puntosu | 20px / 600 | 20px / 600 |
| Odaklanabilir öğe | 4 | 4 |
| Yatay taşma (390/768/1280) | yok | yok |
| RTL: bayrak sağa geçiyor | evet | evet |
| RTL: ok yönü `scaleX(-1)` | evet | evet |
| Konsol | Tailwind CDN uyarısı | **temiz** |

Yeni turuncu tonun ölçümleri: `paprika-500 #B0561F` cream-50 üzerinde 4.38:1 (büyük metin AA ✓), `paprika-600 #9A4A1A` cream-100 üzerinde 4.81:1 (normal metin AA ✓).

`npm run build`: hatasız, 3 statik sayfa üretildi. `npm run lint`: temiz.
Sıradaki adım: Adım 1 — GitHub. `huzur-pide` adında private repo oluşturulacak, remote bağlanacak ve mevcut geçmiş push edilecek. Push öncesi onayın alınacak.
=== RAPOR SONU ===

---

### Adım 1 · 2026-08-27 11:42

=== RAPOR BAŞLANGICI ===
Adım: Aşama 2 / Adım 1 — GitHub
Yapılanlar:
- `gh auth status` kontrol edildi: `Zeynepsoykan99` hesabıyla yetkili, token scope'ları `gist, read:org, repo` — private repo oluşturmaya yetiyor, ek yetkilendirme gerekmedi
- Aynı adda bir repo olup olmadığı önceden kontrol edildi (yoktu)
- `gh repo create huzur-pide --private --source . --remote origin` ile **private** repo oluşturuldu ve `origin` remote'u bağlandı
- Push öncesi durum raporlanıp onay alındı
- `git push -u origin main` ile 7 commit gönderildi, `main` upstream olarak ayarlandı
Oluşturulan/Değiştirilen dosyalar:
- Dosya değişikliği yok; sadece git remote yapılandırması ve uzak depo
- `ILERLEME.md` (güncellendi)
Alınan kararlar:
- **Repo private açıldı** (istendiği gibi). Menü içeriği ve fiyatlar herkese açık bir depoda durmasın.
- **`gh repo create --source .` kullanıldı**, `--push` bayrağı bilinçli olarak eklenmedi. Bu sayede repo ve remote hazırlandı ama gönderim, onayın alınana kadar bekledi.
- **Push öncesi ne gideceği tek tek raporlandı** (7 commit, 21 dosya, ~301 KB) ve `node_modules/`, `.next/`, `.env*` dosyalarının takip edilmediği doğrulandı. Bundan sonraki her push'ta aynı yol izlenecek.
- Uzak depo adresi: https://github.com/Zeynepsoykan99/huzur-pide
Sıradaki adım: Adım 2 — Veri modeli. `data/menu.ts` dosyası kurulacak: dört dili (tr/en/ar/ru) taşıyan yapı, sadece Türkçe alanlar dolu, çok sütunlu fiyat desteği (pide için 1 Hamur / 1,5 Hamur / Düble), fiyatı teyit edilmemiş kalemler için işaret, ve ileride admin panelinden yönetilmeye uygun kurgu.
=== RAPOR SONU ===

---

### Adım 2 · 2026-08-27 11:50

=== RAPOR BAŞLANGICI ===
Adım: Aşama 2 / Adım 2 — Veri modeli
Yapılanlar:
- `data/menu.ts` oluşturuldu: menünün tek kaynağı, hiçbir içerik bileşenlere gömülmüyor
- Dört dili taşıyan `Cevrilebilir` tipi tanımlandı; `tr` zorunlu, `en`/`ar`/`ru` opsiyonel
- 5 kategori ve 31 ürünün tamamı Türkçe olarak girildi; diğer dillerin alanları hiç yazılmadı (uydurulmadı)
- Çok sütunlu fiyat desteği kuruldu: kapalı pidelerde 3 sütun (1 Hamur / 1,5 Hamur / Düble), diğer kategorilerde tek sütun
- Lahmacun'un olmayan iki fiyatı `null` olarak işaretlendi
- Fiyatı teyit edilmemiş 4 hücre `dogrulandi: false` ile işaretlendi
- İçecekler `huzurpide.com.tr/menu` adresinden alındı, teyidin sonrası doğrulanmış olarak girildi
- Yardımcı fonksiyonlar yazıldı: `metin()`, `fiyatYaz()`, `kategoriBul()`, `dogrulanmamisFiyatlar()`, `eksikCeviriler()`
- Veri, verdiğin listeye karşı **programatik olarak** doğrulandı: geçici bir betik ürün sırasını, adlarını ve her fiyat hücresini tek tek karşılaştırdı — 31 üründe sıfır uyuşmazlık. Betik doğrulama sonrası silindi.
- `npx tsc --noEmit` ve `npm run lint` temiz
Oluşturulan/Değiştirilen dosyalar:
- `data/menu.ts` (yeni)
- `ILERLEME.md` (güncellendi)
Alınan kararlar:
- **Eksik çeviri için boş string değil, alanın hiç yazılmaması.** `en: ""` ile alanın olmaması arasında fark var: birincisi "çevrildi ama boş", ikincisi "henüz çevrilmedi". `eksikCeviriler()` bu ayrım sayesinde çalışıyor ve şu an her dil için 50 eksik alan raporluyor.
- **`Cevrilebilir` tipinde `tr` zorunlu, diğerleri opsiyonel.** Eksik çeviri derleme hatası vermiyor — verseydi Aşama 3'e kadar proje derlenmezdi. Ama `metin()` fonksiyonu çeviri yoksa Türkçe'ye düşüyor, yani ekranda hiçbir zaman boşluk kalmıyor.
- **Fiyat "sayı" değil, `{ sutun, tutar, dogrulandi }` nesnesi.** Doğrulama bayrağını ürün seviyesinde değil hücre seviyesinde tutmak gerekiyordu: Kaşarlı'nın 1,5 Hamur fiyatı teyitli ama 1 Hamur ve Düble fiyatları değil. Ürün seviyesinde bir bayrak bu ayrımı taşıyamazdı.
- **`tutar: null` = "bu ürün bu sütunda satılmıyor".** Lahmacun'un 1,5 Hamur ve Düble karşılığı yok; `0` yazmak "bedava" anlamına gelirdi. Ekranda tire (—) gösterilecek.
- **Görsel alanı yalnızca gerçekten o ürüne ait fotoğraf varsa dolduruldu.** Kaşarlı için sitedeki "Peynirli Pide" görseli kullanılmadı, Komposto için "Komposto (Çilek)" kullanılmadı — ikisi de farklı ürün. Kod içine bunu açıklayan yorum bırakıldı ki ileride yanlışlıkla doldurulmasın.
- **Görsel `alt` metni de çevrilebilir.** Ekran okuyucu kullanan Arapça bir müşteri fotoğrafın açıklamasını da kendi dilinde duymalı.
- **Fiyat biçimlendirmesi `toLocaleString("tr-TR")` ile** — 1500 değil "1.500 ₺". Para birimi `PARA_BIRIMI` sabitinde, tek yerde.
- **`sayfaNo` veriye kondu**, ekran A'da hesaplanmadı. Basılı menüdeki sayfa numarası bir içerik kararı; ileride admin panelinden düzenlenecek alanlardan biri olacak.
- **Kategori `slug`'ları Türkçe karaktersiz** (`kapali-pide`, `tatlilar`) — URL'de sorun çıkarmasın diye.
Veri özeti:

| Sayfa | Kategori | Ürün | Görsel | Fiyat sütunu |
|---|---|---|---|---|
| 1-2 | Kapalı Pide Çeşitleri | 6 | 2 | 3 |
| 3-4 | Izgara Çeşitleri | 14 | 3 | 1 |
| 5 | Salatalar | 1 | 0 | 1 |
| 6 | Tatlı Çeşitleri | 3 | 2 | 1 |
| 7 | İçecekler | 7 | 0 | 1 |
| | **Toplam** | **31** | **7** | |

Doğrulanmamış fiyat hücreleri (4): Kıymalı/1 Hamur · Kaşarlı/1 Hamur · Kaşarlı/Düble · Kabak Tatlısı
Eksik çeviri: `en`, `ar`, `ru` için 50'şer alan
Sıradaki adım: Adım 3 — Ekran A. Kategori listesi sayfası: her satırda kategori adı, noktalı ayraç ve sağda sayfa numarası. Üstte "Huzur Pide" başlığı. Mobil öncelikli, yön bağımsız.
=== RAPOR SONU ===
