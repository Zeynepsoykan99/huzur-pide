# Huzur Pide — İlerleme Kaydı

## Proje Özeti

**Proje:** Huzur Pide dijital menü uygulaması
**Güncel aşama:** Aşama 1 tamamlandı — sıradaki: Aşama 2 (menü sayfaları tasarımı)
**Son güncelleme:** 2026-08-27 10:40

### Genel Durum

| Aşama | Konu | Durum |
|---|---|---|
| 1 | Dil seçim ekranı tasarımı | **Tamamlandı** (5/5 adım) |
| 2 | Menü sayfaları tasarımı | Başlanmadı |
| 3 | Dil değiştirme mantığı + menü verisi | Başlanmadı |
| 4 | RTL (Arapça) desteğinin devreye alınması | Başlanmadı |

### Aşama 1 Adımları

- [x] Adım 1 — Proje iskeleti
- [x] Adım 2 — Bayrak SVG'leri
- [x] Adım 3 — index.html iskeleti ve genel layout
- [x] Adım 4 — Dil butonları ve etkileşim durumları
- [x] Adım 5 — RTL hazırlığı, erişilebilirlik ve doğrulama

### Aşama 1 Çıktısı

`index.html` — tek sayfalık dil seçim ekranı. Dört dil butonu (Türkçe, English,
العربية, Русский), yerel bayrak SVG'leri, bej/sütlü kahve palet, mobile-first
düzen, RTL'e hazır yapı. Henüz işlevsellik yok; butonlar tıklanabilir ama bir şey
yapmıyor — bu bilinçli, Aşama 3'te bağlanacak.

Açmak için: proje klasöründe `python -m http.server 8765` çalıştırıp tarayıcıda
`http://127.0.0.1:8765` adresine gidin. (`index.html`'i doğrudan çift tıklayarak
da açabilirsiniz; Tailwind CDN için internet bağlantısı gerekir.)

### Teknoloji ve Kararlar

- HTML + Tailwind CSS v3 (Play CDN), framework yok
- Bayraklar yerel SVG (`assets/flags/`), dış servise bağımlılık yok
- Arapça için Birleşik Arap Emirlikleri bayrağı
- Başlık fontu Marcellus (Google Fonts), gövde metni sistem fontları
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

### Rapor Biçimi

Raporlar adım adım ayrı ayrı değil, **aşama başına tek birleşik rapor** olarak
tutulur. Bir aşama bitince yukarıdaki özet güncellenir ve dosyanın sonuna o
aşamanın tek raporu eklenir; önceki raporların üzerine yazılmaz.

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
