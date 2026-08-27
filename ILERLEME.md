# Huzur Pide — İlerleme Kaydı

## Proje Özeti

**Proje:** Huzur Pide dijital menü uygulaması
**Güncel aşama:** Aşama 1 — Frontend / Tasarım (dil seçim ekranı)
**Son güncelleme:** 2026-08-27 10:23

### Genel Durum

| Aşama | Konu | Durum |
|---|---|---|
| 1 | Dil seçim ekranı tasarımı | Devam ediyor (3/5 adım) |
| 2 | Menü sayfaları tasarımı | Başlanmadı |
| 3 | Dil değiştirme mantığı + menü verisi | Başlanmadı |
| 4 | RTL (Arapça) desteğinin devreye alınması | Başlanmadı |

### Aşama 1 Adımları

- [x] Adım 1 — Proje iskeleti
- [x] Adım 2 — Bayrak SVG'leri
- [x] Adım 3 — index.html iskeleti ve genel layout
- [ ] Adım 4 — Dil butonları ve etkileşim durumları
- [ ] Adım 5 — RTL hazırlığı, erişilebilirlik ve doğrulama

### Teknoloji ve Kararlar

- HTML + Tailwind CSS v3 (Play CDN), framework yok
- Bayraklar yerel SVG (`assets/flags/`), dış servise bağımlılık yok
- Arapça için Birleşik Arap Emirlikleri bayrağı
- Başlık fontu Google Fonts üzerinden
- Mobile-first; RTL'e hazır yapı (logical property'ler)

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
