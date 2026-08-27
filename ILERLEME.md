# Huzur Pide — İlerleme Kaydı

## Proje Özeti

**Proje:** Huzur Pide dijital menü uygulaması
**Güncel aşama:** Aşama 1 tamamlandı — sıradaki: Aşama 2 (menü sayfaları tasarımı)
**Son güncelleme:** 2026-08-27 10:31

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

### Teknoloji ve Kararlar

- HTML + Tailwind CSS v3 (Play CDN), framework yok
- Bayraklar yerel SVG (`assets/flags/`), dış servise bağımlılık yok
- Arapça için Birleşik Arap Emirlikleri bayrağı
- Başlık fontu Google Fonts üzerinden
- Mobile-first; RTL'e hazır yapı (logical property'ler)

### Aşama 1 Çıktısı

`index.html` — tek sayfalık dil seçim ekranı. Dört dil butonu (Türkçe, English,
العربية, Русский), yerel bayrak SVG'leri, bej/sütlü kahve palet, mobile-first
düzen, RTL'e hazır yapı. Henüz işlevsellik yok; butonlar tıklanabilir ama bir
şey yapmıyor — bu bilinçli, Aşama 3'te bağlanacak.

Açmak için: proje klasöründe `python -m http.server 8765` çalıştırıp
tarayıcıda `http://127.0.0.1:8765` adresine gidin. (Dosyayı doğrudan çift
tıklayarak da açabilirsiniz; Tailwind CDN için internet bağlantısı gerekir.)

### Renk Paleti

| İsim | Hex | Kullanım |
|---|---|---|
| cream-50 | #F5EFE6 | Sayfa arka planı (üst) |
| cream-100 | #EDE0D4 | Sayfa arka planı (alt) |
| latte-400 | #C8A27A | Buton normal |
| latte-500 | #B08968 | Buton hover |
| latte-600 | #96745A | Buton active / kenarlık |
| cocoa-900 | #4A3728 | Yazı rengi |

---

# Adım Raporları

## 2026-08-27 10:15

=== RAPOR BAŞLANGICI ===
Adım: 1 — Proje iskeleti
Yapılanlar:
- Proje kök dizininde `assets/flags/` ve `assets/css/` klasörleri oluşturuldu
- Git deposu başlatıldı (`git init -b main`), varsayılan dal adı `main`
- `.gitignore` oluşturuldu (OS dosyaları, editör klasörleri, node_modules/dist gibi ileride oluşabilecek build çıktıları)
- `ILERLEME.md` oluşturuldu; en üstte proje özeti, aşama tablosu, adım kontrol listesi, teknoloji kararları ve renk paleti bölümleri yer alıyor
- Boş klasörlerin git tarafından takip edilebilmesi için `.gitkeep` dosyaları eklendi
- İlk commit atıldı
Oluşturulan/Değiştirilen dosyalar:
- `.gitignore` (yeni)
- `ILERLEME.md` (yeni)
- `assets/flags/.gitkeep` (yeni)
- `assets/css/.gitkeep` (yeni)
Alınan kararlar:
- Dal adı `main` seçildi (modern varsayılan, `master` yerine)
- `ILERLEME.md` UTF-8 olarak yazıldı; Türkçe karakterlerin doğru göründüğü terminalde doğrulandı
- `node_modules/` ve `dist/` şimdilik kullanılmasa da `.gitignore`'a eklendi; ileride Tailwind CDN'den build sistemine geçilirse dosyayı tekrar düzenlemek gerekmeyecek
- Kök dizindeki mevcut boş `huzur pide` dosyasına dokunulmadı; git takibine de alınmadı
Sıradaki adım: Adım 2 — 4 adet bayrak SVG dosyasının (`tr.svg`, `en.svg`, `ae.svg`, `ru.svg`) `assets/flags/` altında oluşturulması. Hepsi 3:2 oranında, viewBox ile ölçeklenebilir, dış bağımlılıksız.
=== RAPOR SONU ===

---

## 2026-08-27 10:20

=== RAPOR BAŞLANGICI ===
Adım: 2 — Bayrak SVG'leri
Yapılanlar:
- `assets/flags/` altında 4 adet bayrak SVG'si oluşturuldu: `tr.svg`, `gb.svg`, `ae.svg`, `ru.svg`
- Her bayrak kendi resmi en-boy oranında ve resmi renk kodlarıyla çizildi
- Tümü `viewBox` tabanlı, sabit `width`/`height` niteliği yok; CSS ile serbestçe ölçeklenebiliyor
- Her dosyaya `role="img"`, Türkçe `aria-label` ve `<title>` eklendi (ekran okuyucu desteği)
- Yerel bir HTTP sunucusu (`python -m http.server 8765`) ayağa kaldırılıp bayraklar Playwright ile tarayıcıda hem 80px hem 24px yükseklikte render edilerek görsel olarak doğrulandı
- Doğrulama sonrası geçici önizleme dosyaları silindi; `.gitignore`'a geçici test çıktıları eklendi
Oluşturulan/Değiştirilen dosyalar:
- `assets/flags/tr.svg` (yeni)
- `assets/flags/gb.svg` (yeni)
- `assets/flags/ae.svg` (yeni)
- `assets/flags/ru.svg` (yeni)
- `.gitignore` (güncellendi)
- `ILERLEME.md` (güncellendi)
Alınan kararlar:
- **Dosya adları ISO 3166 ülke kodu ile:** `tr`, `gb`, `ae`, `ru`. Plandaki `en.svg` yerine `gb.svg` kullanıldı; dosya bir *ülkeyi* temsil ediyor, dili değil. Dil kodu (`en`) ile ülke kodu (`gb`) ayrımı ileride dil mantığı yazılırken karışıklığı önleyecek.
- **Her bayrak resmi oranında bırakıldı**, ortak bir orana zorlanmadı: `tr` 3:2, `gb` 1:2, `ae` 2:1, `ru` 3:2. Bayrağı esnetmek hem yanlış hem de saygısız olurdu.
- Farklı oranlar buton içinde metin hizasını bozmasın diye Adım 4'te **sabit genişlikte (48px) bir "slot"** kullanılacak; bayrak bu slotun içinde ortalanacak, yüksekliği sabitlenecek. Böylece en geniş bayrak (Union Jack) slotu doldururken diğerleri ortalanmış duracak, metinler aynı hizada kalacak.
- **Türk bayrağı resmi ölçülere göre çizildi:** dış daire r=200 @ (425,400), iç daire r=160 @ (535,400), yıldız çevrel yarıçapı 100 @ (683,400), bir ucu hilale (sola) bakacak şekilde döndürülmüş.
- **Union Jack'in çapraz kolları** `clipPath` ile doğru şekilde "counterchanged" (aynalı kaydırmalı) çizildi; basitleştirilmiş simetrik versiyon kullanılmadı.
- Toplam boyut 4 dosya için ~1.6 KB. Dış servise (flagcdn, emoji vb.) hiçbir bağımlılık yok; uygulama tamamen çevrimdışı da çalışır.
- Bayraklarda beyaz alanlar var (RU, GB, AE); sütlü kahve buton zemini üzerinde kenarları kaybolmasın diye Adım 4'te bayraklara ince bir kenarlık (ring) eklenecek.
Sıradaki adım: Adım 3 — `index.html` iskeleti: Tailwind Play CDN kurulumu, inline `tailwind.config` ile renk paleti tanımı, Google Fonts başlık fontu, mobile-first sayfa düzeni ve "Huzur Pide" logo/başlık alanı.
=== RAPOR SONU ===

---

## 2026-08-27 10:23

=== RAPOR BAŞLANGICI ===
Adım: 3 — index.html iskeleti ve genel layout
Yapılanlar:
- `index.html` oluşturuldu: `<!DOCTYPE html>`, `<html lang="tr" dir="ltr">`, UTF-8, `viewport-fit=cover`'lı viewport meta'sı, `theme-color`, açıklama meta'sı
- Tailwind Play CDN eklendi ve inline `tailwind.config` ile projenin renk paleti (`cream`, `latte`, `cocoa`) ve font aileleri (`display`, `body`) tanımlandı
- Google Fonts'tan **Marcellus** başlık fontu `preconnect` + `display=swap` ile bağlandı
- Sayfa iskeleti kuruldu: `header` (logo + başlık + ayraç + slogan), `main` (dil seçimi başlığı + boş `#language-list` konteyneri), `footer`
- "Dil Seçiniz" başlığının altına dört dildeki karşılıkları eklendi; her biri kendi `lang` niteliğiyle, Arapça olan ayrıca `dir="rtl"` ile işaretlendi
- `assets/logo.svg` çizildi: sütlü kahve halka içinde, kertikli hamur kenarı, malzemesi ve buharı olan pide silüeti
- `assets/favicon.svg` çizildi: koyu kahve yuvarlak köşeli kare üzerinde sadeleştirilmiş pide, sekme ikonu için
- `assets/css/custom.css` oluşturuldu: dokunma parlaması kapatma, yatay taşma engeli, `dvh` yedeği ve `prefers-reduced-motion` desteği
- Sayfa 390x844 (iPhone) çözünürlüğünde tarayıcıda açılıp doğrulandı; konsolda hata yok
Oluşturulan/Değiştirilen dosyalar:
- `index.html` (yeni)
- `assets/logo.svg` (yeni)
- `assets/favicon.svg` (yeni)
- `assets/css/custom.css` (yeni)
- `ILERLEME.md` (güncellendi)
Alınan kararlar:
- **Palet Tailwind config'e isimlendirilmiş renk olarak taşındı** (`bg-cream-50`, `bg-latte-400`, `text-cocoa-900`). Sınıf isimleri hex kodlarıyla dolmuyor, ileride bir tonu değiştirmek tek satırlık iş oluyor. Paletin ara tonları da (`cream-200`, `latte-600`, `cocoa-700`) şimdiden tanımlandı.
- **Arka plan düz renk değil, `cream-50` → `cream-100` dikey gradyan.** Tek bir bej düz ve cansız duruyordu; çok hafif bir geçiş sayfaya derinlik veriyor ama hâlâ istenen bej aralığının içinde.
- **Başlık fontu Marcellus:** sıcak, klasik bir serif. Gövde metni bilinçli olarak sistem fontlarında bırakıldı — mobilde anında render olur, ikinci bir font indirmeyi beklemez. Menü uygulamasında okunabilirlik ve hız gövde için karakterden önemli.
- **`min-h-dvh` kullanıldı** (`min-h-screen` değil). Mobil tarayıcılarda adres çubuğu görünüp kaybolurken `100vh` sayfayı kaydırıyor; `dvh` bunu çözüyor. Eski tarayıcılar için `custom.css` içinde `@supports` ile `vh` yedeği bırakıldı.
- **Genişlik kademeli sınırlandı:** mobilde `max-w-md`, `sm:max-w-lg`, `lg:max-w-xl`. Menü tabletlerde ve masaüstünde ekranın tamamına yayılıp seyrelmiyor, ortada okunaklı bir sütun olarak kalıyor.
- **`#language-list` boş bir konteyner olarak şimdiden konuldu**, `flex flex-col gap-3` ile. Adım 4'te butonlar buraya girecek; ileride JS ile dinamik üretilecekse de bağlanacağı kanca hazır.
- **Logo başta "göz" gibi okunuyordu**; hamur kenarı inceltilip üzerine kertikler, dolgunun üzerine malzeme noktaları ve üste buhar eklenerek net bir pide silüetine dönüştürüldü ve tarayıcıda tekrar doğrulandı.
- `<img>` etiketlerine `width`/`height` verildi — sayfa yüklenirken layout kayması (CLS) olmuyor.
- Logo dekoratif olduğu için `alt=""` + `aria-hidden="true"`; hemen altındaki `<h1>` zaten aynı bilgiyi veriyor, ekran okuyucu iki kez okumasın diye.
- Konsoldaki tek uyarı Tailwind CDN'in "üretimde kullanma" uyarısı; bu aşama için beklenen ve kabul edilmiş bir durum, canlıya çıkmadan önce Tailwind CLI build'ine geçilecek.
Sıradaki adım: Adım 4 — Dört dil butonunun tasarımı: sabit genişlikli bayrak slotu, dil adının kendi dilinde yazımı, hover/active/focus durumları, mobilde dikey liste ve masaüstünde 2x2 grid düzeni.
=== RAPOR SONU ===

---

## 2026-08-27 10:26

=== RAPOR BAŞLANGICI ===
Adım: 4 — Dil butonları ve etkileşim durumları
Yapılanlar:
- Dört dil butonu `#language-list` içine eklendi: Türkçe, English, العربية, Русский
- Her buton üç parçadan oluşuyor: sabit genişlikli bayrak slotu, dil adının kendi dilindeki yazımı, sağda ince bir ok
- `index.html` içine `<style type="text/tailwindcss">` bloğu eklendi; `@layer components` altında `.lang-btn`, `.flag-slot`, `.flag`, `.lang-name`, `.lang-arrow` sınıfları `@apply` ile tanımlandı
- Etkileşim durumları kuruldu: hover'da bir ton koyulaşma + hafif yukarı kalkma + gölge büyümesi + okun ileri kayması; active'de geri basılma; focus-visible'da koyu kahve odak halkası
- Tailwind config'e `future: { hoverOnlyWhenSupported: true }` eklendi
- Düzen: mobilde tek sütun dikey liste, `md` ve üstünde 2x2 grid
- `header` + `main` dikeyde ortalanan bir gruba alındı, `footer` sayfanın altında bırakıldı
- 390x844 (telefon), 834x900 (tablet) ve 1280x800 (masaüstü) çözünürlüklerinde tarayıcıda doğrulandı; hover ve klavye odağı ayrıca test edildi
Oluşturulan/Değiştirilen dosyalar:
- `index.html` (güncellendi)
- `ILERLEME.md` (güncellendi)
Alınan kararlar:
- **`<a>` değil `<button type="button">` kullanıldı.** Dil seçimi bir sayfa navigasyonu değil, uygulama içi bir durum değişikliği olacak. Butonlar klavye ve ekran okuyucu tarafından zaten doğru şekilde ele alınıyor.
- **`data-lang` ve `data-dir` nitelikleri şimdiden eklendi.** Sonraki aşamada JS bu iki niteliği okuyup `<html lang>` ve `<html dir>` değerlerini ayarlayacak; HTML'e tekrar dokunmak gerekmeyecek.
- **Dil adları kendi dilinde yazıldı** ("English", "العربية", "Русский" — "İngilizce, Arapça, Rusça" değil). Rusça bilen bir müşteri "Rusça" kelimesini okuyamaz ama "Русский"i tanır. Dil seçim ekranlarında standart yaklaşım budur.
- **Sabit 48px bayrak slotu:** bayrakların oranları farklı olduğu için (Union Jack 1:2, BAE 2:1) doğrudan yan yana konsalardı metinler kaydırılırdı. Slot sayesinde en geniş bayrak slotu doldururken diğerleri ortalanıyor, dört metin de aynı hizada başlıyor.
- **Bayraklara ince kenarlık (`ring-1 ring-cocoa-900/25`) eklendi.** Rusya, BK ve BAE bayraklarındaki beyaz alanlar sütlü kahve zeminde sınırsız kalıyordu.
- **Arapça etiket bir punto büyük gösteriliyor.** Arap alfabesi aynı punto değerinde latin harflerden gözle görülür şekilde küçük görünür; `text-xl` ile dengelendi.
- **Arapça etiketten `dir="rtl"` kaldırıldı.** Etiket tek yönlü bir metin, yön işareti olmadan da doğru render oluyor; `dir="rtl"` verildiğinde ise metin buton içinde sağa yaslanıp diğer üç butonla hizasını bozuyordu. Sayfa RTL'e geçtiğinde dördü birden aynalanacağı için doğru davranış bu. `lang="ar"` korundu (font seçimi ve ekran okuyucu telaffuzu için gerekli).
- **`hoverOnlyWhenSupported` açıldı.** Bu ayar olmadan dokunmatik ekranda bir butona dokunduktan sonra hover durumu ekranda "yapışıp" kalıyor. Menü ağırlıklı olarak telefondan açılacağı için önemli.
- **Odak göstergesi `ring` değil `outline` ile yapıldı.** Butonun normal halinde zaten bir `ring-1` kenarlığı var; ikisi de `box-shadow` kullandığı için çakışıyorlardı. `outline` ayrı bir katman olduğundan çakışma olmuyor.
- **Minimum dokunma hedefi 56px** (`min-h-[3.5rem]`). WCAG 2.5.5'in önerdiği 44px'in üzerinde; telefondan tek elle rahat basılıyor.
- **Ok işareti `<img>` değil inline `<svg>`.** 4 buton için 4 ayrı ağ isteği yerine tek satır işaretleme; ayrıca `currentColor` kullandığı için hover'da metinle birlikte renk değiştirebiliyor.
- **Yön bağımlı hiçbir utility kullanılmadı.** `px`, `gap`, `text-start` gibi yönden bağımsız sınıflar tercih edildi; `ml`/`mr`/`left`/`right` hiç geçmiyor. Adım 5'te `dir="rtl"` denendiğinde satırın kendiliğinden aynalanmasının nedeni bu.
Sıradaki adım: Adım 5 — RTL doğrulaması (`dir="rtl"` ile düzenin aynalanmasının test edilmesi ve okun yön değiştirmesi), erişilebilirlik kontrolü (`aria` nitelikleri, kontrast, klavye sırası) ve üç çözünürlükte son doğrulama.
=== RAPOR SONU ===

---

## 2026-08-27 10:31

=== RAPOR BAŞLANGICI ===
Adım: 5 — RTL hazırlığı, erişilebilirlik ve doğrulama
Yapılanlar:
- **RTL testi:** Tarayıcıda `<html dir="rtl">` verilerek düzenin aynalanması test edildi. Bayraklar sağa, oklar sola geçti, metinler sağa yaslandı — hiçbir CSS düzeltmesi gerekmedi. Tek eksik okun yönüydü, o da düzeltildi.
- Ok yönü CSS değişkeni üzerinden kurgulandı: `.lang-arrow` üzerinde `transform: scaleX(var(--arrow-flip)) translateX(var(--arrow-shift))`, `[dir="rtl"]` altında `--arrow-flip: -1`. Kural şu an LTR olduğu için etkisiz bekliyor, `dir` değiştiği anda devreye girecek.
- `#language-list`'e `role="group"` ve `aria-labelledby="lang-heading"` eklendi; buton grubu ekran okuyucuda "Dil Seçiniz" başlığıyla ilişkilendirildi
- **Kontrast ölçümü** tarayıcıda WCAG formülüyle hesaplandı:
  - metin / buton (normal): **4.77:1** — AA geçer
  - metin / buton (hover): **3.55:1** — 20px/600 "büyük metin" sınıfında, AA geçer
  - metin / buton (active): 2.65:1 — **başarısızdı, düzeltildi** (aşağıya bakınız)
  - metin / sayfa arka planı: **9.83:1** — AAA geçer
  - alt metin / sayfa: **5.51:1** — AA geçer
- Etiket puntosu her ekran boyutunda 20px/600'e sabitlendi
- Doğrulanan diğer noktalar: buton yüksekliği tam 56px, yatay taşma yok, sekme sırası dört butonu doğru sırayla geziyor, erişilebilir isimler doğru ("Türkçe", "English", "العربية", "Русский"), konsolda hata yok
- Son görsel doğrulama 390x844 (telefon), 768x1024 (tablet) ve 1280x800 (masaüstü) çözünürlüklerinde yapıldı
Oluşturulan/Değiştirilen dosyalar:
- `index.html` (güncellendi)
- `ILERLEME.md` (güncellendi)
Alınan kararlar:
- **Active durumunda renk yerine hareket kullanıldı.** Basılma efekti `latte-600` (#96745A) ile veriliyordu; ölçüm bu kombinasyonun 2.65:1 kontrast verdiğini, yani basılı tutulduğu sürece metnin okunaksız hale geldiğini gösterdi. Active artık `latte-500`'de kalıp `scale-[0.985]` ile hafifçe küçülüyor ve gölgesi azalıyor. Dokunsal geri bildirim korundu, kontrast 3.55:1'e çıktı. Renk paletinde bir tonu kaybetmedik — `latte-600` kenarlıkta kullanılmaya devam ediyor.
- **Etiket puntosu 20px'e sabitlendi** (önce mobilde 18px, `sm`'den sonra 20px idi). İki nedeni var: WCAG'ın "büyük metin" eşiği 14pt/18.66px kalın; 18px bu eşiğin hemen altında kaldığı için hover durumu dar bir masaüstü penceresinde teknik olarak başarısız oluyordu. İkincisi, restoran menüsü çoğunlukla loş ışıkta ve her yaştan müşteri tarafından okunuyor — 20px zaten daha iyi bir tercih.
- **RTL için ayrı bir stil dosyası veya `rtl:` varyantı gerekmedi.** Adım 3 ve 4'te yön bağımlı utility kullanmama kararı burada karşılığını verdi: `dir` niteliğini değiştirmek düzeni tek başına aynalıyor. Aşama 3'te yazılacak JS'in tek yapması gereken `<html>` üzerindeki `lang` ve `dir` niteliklerini butonun `data-lang` / `data-dir` değerlerinden okuyup ayarlamak.
- **Ok yönü Tailwind'in `rtl:` varyantı yerine CSS değişkeniyle çözüldü.** `rtl:` varyantı işe yarardı ama hover kaymasıyla birlikte dört ayrı sınıf kombinasyonu gerekiyordu (`rtl:-translate-x-1` vb.). Değişken yaklaşımı tek transform ifadesiyle hem yönü hem kaymayı yönetiyor; `scaleX` önce yazıldığı için koordinat sistemi terslendiğinde kayma da kendiliğinden doğru yöne gidiyor.
- **Otomatik bir erişilebilirlik denetim aracı (axe vb.) kurulmadı.** Sayfada dört buton ve bir başlık var; kontrast, odak görünürlüğü, dokunma hedefi, erişilebilir isim ve sekme sırası tek tek elle ölçüldü. Bu ölçekte bir araç kurmak fayda getirmezdi. Menü sayfaları eklendiğinde tekrar değerlendirilmeli.
Bu aşamada bilinçli olarak YAPILMAYANLAR:
- Butonlara tıklama davranışı bağlanmadı — istendiği gibi yalnızca tasarım yapıldı
- `dir="rtl"` uygulanmadı, sadece altyapısı kuruldu
- Tailwind CDN'den gerçek build'e geçilmedi; canlıya çıkmadan önce yapılmalı
Sıradaki adım: Aşama 2 — menü sayfalarının tasarımı (kategori listesi, ürün kartları, fiyat gösterimi, geri dönüş ve dil değiştirme kontrolü). Bu aşamanın planı yeni bir onayla başlayacak.
=== RAPOR SONU ===
