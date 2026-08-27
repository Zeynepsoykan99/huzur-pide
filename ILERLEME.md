# Huzur Pide — İlerleme Kaydı

## Proje Özeti

**Proje:** Huzur Pide dijital menü uygulaması
**Güncel aşama:** Aşama 1 — Frontend / Tasarım (dil seçim ekranı)
**Son güncelleme:** 2026-08-27 10:15

### Genel Durum

| Aşama | Konu | Durum |
|---|---|---|
| 1 | Dil seçim ekranı tasarımı | Devam ediyor (1/5 adım) |
| 2 | Menü sayfaları tasarımı | Başlanmadı |
| 3 | Dil değiştirme mantığı + menü verisi | Başlanmadı |
| 4 | RTL (Arapça) desteğinin devreye alınması | Başlanmadı |

### Aşama 1 Adımları

- [x] Adım 1 — Proje iskeleti
- [ ] Adım 2 — Bayrak SVG'leri
- [ ] Adım 3 — index.html iskeleti ve genel layout
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
