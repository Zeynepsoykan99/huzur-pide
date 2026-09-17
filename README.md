# Huzur Pide — Dijital QR Menü ve Yönetim Paneli

## English summary

**What it is.** A four-language (Turkish, English, Arabic, Russian) QR menu
for Huzur Pide, a pide restaurant in Çarşamba/Samsun, plus a small admin
panel the owner uses to change prices, add products and pick the menu's
look. Live at **https://www.huzurpidedikbiyik.com**.

**How it works.** Guests scan a QR code, land on a welcome page, tap
*Menu* and browse a horizontally swiped "menu book" (8 categories,
56 products, all with photos). Arabic pages render right-to-left. Menu
content lives in Firestore; pages are statically generated and
revalidated whenever the panel saves a change. All writes go through
server actions using the Firebase Admin SDK — the browser never writes to
the database.

**Stack.** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4,
Firebase (Firestore + Authentication), hosted on Vercel.

**Run it locally.**

```bash
npm install
# create .env.local with the variables listed under "Ortam değişkenleri"
npm run dev        # http://localhost:3000
```

Note: the local app talks to the **live** Firestore database.

**Layout.** `app/[dil]/` customer pages · `app/panel/` admin panel ·
`components/` screens · `data/` menu types, texts, themes · `lib/` Firebase
clients · `betikler/` maintenance scripts · `public/urunler/` product
photos.

**Deploy.** Every push to `main` deploys to production on Vercel.

The detailed sections below are in Turkish. The owner's guide is
[`KULLANIM.md`](KULLANIM.md); the full project history is
[`ILERLEME.md`](ILERLEME.md).

---

## İçindekiler

1. [Proje](#1-proje)
2. [Teknoloji yığını](#2-teknoloji-yığını)
3. [Mimari notlar](#3-mimari-notlar)
4. [Proje yapısı](#4-proje-yapısı)
5. [Yerel geliştirme](#5-yerel-geliştirme)
6. [Firebase](#6-firebase)
7. [Betikler](#7-betikler)
8. [Dağıtım](#8-dağıtım)
9. [Belgeler](#9-belgeler)
10. [Bilinen sınırlar ve geçici çözümler](#10-bilinen-sınırlar-ve-geçici-çözümler)

---

## 1. Proje

Çarşamba/Samsun'daki **Huzur Pide** için dört dilli (tr, en, ar, ru) QR
menü ve mekân sahibinin kullandığı yönetim paneli.

- **Canlı adres:** https://www.huzurpidedikbiyik.com
- **Müşteri akışı:** QR → karşılama sayfası → *Menü* butonu → içindekiler →
  yana kaydırılan menü kitabı (8 kategori, 56 ürün, hepsi fotoğraflı).
- **Diller:** sayfanın üstündeki bayraklarla değiştiriliyor. Menü
  kitabında dil değişince müşteri baktığı sayfada kalıyor. Arapça sayfalar
  sağdan sola çiziliyor.
- **Görünüm:** üç tema (Çini Levha, Gece Ocağı, Mürekkep) ve her temanın
  içinde seçilebilen vurgu ve fiyat renkleri.
- **Panel (`/panel`):** fiyat değiştirme ve arama, ürün ekleme ve silme,
  tema ve renk seçimi. Mekân sahibinin kullanım rehberi:
  [`KULLANIM.md`](KULLANIM.md).

## 2. Teknoloji yığını

| Katman | Kullanılan |
|---|---|
| Çatı | **Next.js 16.3** (App Router, Turbopack), **React 19.2** |
| Dil | **TypeScript 5** |
| Stil | **Tailwind CSS 4** + tema değişkenleri (`app/temalar/temalar.css`) |
| Yazı tipleri | `next/font` (Google Fonts), her tema kendi ailelerini yüklüyor |
| Veri | **Firebase Firestore** |
| Giriş | **Firebase Authentication** (e-posta/şifre) |
| Sunucu tarafı veri erişimi | **Firebase Admin SDK** |
| Barındırma | **Vercel** (üretim dalı `main`) |
| Görsel işleme | `next/image` (sunumda), `sharp` (betiklerde) |
| Betik çalıştırıcı | `tsx` |

## 3. Mimari notlar

- **İçerik Firestore'da, sayfalar statik.** Müşteri sayfaları derleme
  anında Firestore'dan okunup statik üretiliyor; müşteri isteğinde
  veritabanına gidilmiyor. Panel bir değişiklik kaydettiğinde ilgili
  sayfalar `revalidatePath` ile yeniden üretiliyor ve birkaç saniyede
  menüye yansıyor. Yeni bir **kategori** ise ancak bir sonraki derlemede
  rotaya dönüşüyor.
- **Tarayıcıdan veritabanına yazma yok.** Panelin bütün yazma işlemleri
  Server Action'lardan (`app/panel/eylemler.ts`) Admin SDK ile yapılıyor.
  `firestore.rules` istemciye hiçbir yazma izni vermiyor; tarayıcıdaki
  Firebase SDK'sı yalnızca giriş için kullanılıyor.
- **Oturum.** Girişten sonra sunucu, `httpOnly` bir oturum çerezi
  oluşturuyor (`lib/oturum.ts`). Her panel sayfası ve her eylem, hesabın
  `yoneticiler` koleksiyonunda kayıtlı olup olmadığını ayrıca kontrol
  ediyor.
- **Dil adreste.** Bütün müşteri sayfaları `app/[dil]/` altında. `<html
  lang>` ve `<html dir>` bu parçadan geliyor; Arapça sayfa sunucudan zaten
  `rtl` olarak çıkıyor. Kök adres `/` → `/tr`.
- **Menü kitabı.** Sekiz sayfanın tamamı her kategori rotasında basılıyor;
  hangi sayfada açılacağını rota belirliyor. Yatay kaydırma saf CSS
  (`scroll-snap`). JavaScript yalnızca sayacı, adres çubuğunu, okları ve
  dil bağlantılarını güncelliyor. JavaScript kapalıyken de menü okunabiliyor.
- **Temalar.** `<html>` üzerindeki `tema-*` sınıfı ve `--t-*` değişkenleri.
  Ekran bileşenleri temayı bilmiyor. Panelde seçilebilen renkler
  kontrastı önceden ölçülmüş hazır paletlerden geliyor (`data/renkler.ts`).
- **Adres ve SEO.** Site adresi kodda tek yerde: `data/adres.ts`. canonical,
  hreflang, Open Graph, `robots.txt` ve `sitemap.xml` oradan besleniyor.
  `proxy.ts` büyük harfli adresleri ve eski Vercel adresini 308 ile doğru
  adrese yönlendiriyor.

## 4. Proje yapısı

| Yol | İçerik |
|---|---|
| `app/[dil]/` | Müşteri sayfaları: karşılama (`page.tsx`), içindekiler (`menu/`), menü kitabı (`menu/[sayfa]/`), 404 |
| `app/panel/` | Yönetim paneli: giriş, fiyatlar, ürün ekleme, tema/renk; `eylemler.ts` sunucu eylemleri |
| `app/temalar/` | Tema değişkenleri (`temalar.css`) ve temaların yazı tipleri |
| `app/robots.ts`, `app/sitemap.ts` | `robots.txt` ve `sitemap.xml` |
| `app/globals.css` | Ortak stiller |
| `components/` | Ekranlar (`ekranlar.tsx`), menü kitabının istemci parçaları (sayaç, oklar, aşağı ok, dil bağlantısı), ikonlar, tema motifi |
| `data/menu.ts` | Menü tipleri, dil yardımcıları ve menünün **kaynak kopyası** (betikler bunu Firestore ile karşılaştırıyor) |
| `data/menuKaynak.ts` | Firestore'dan menüyü, temayı ve renkleri okuyan sunucu katmanı |
| `data/arayuz.ts`, `data/karsilama.ts` | Arayüz metinleri, karşılama sayfası içeriği ve iletişim bilgileri |
| `data/tema.ts`, `data/renkler.ts` | Temalar ve renk paletleri |
| `data/site.ts`, `data/adres.ts` | SEO etiketleri ve site adresi |
| `lib/` | Firebase istemci ve sunucu bağlantıları, oturum |
| `proxy.ts` | Adres yönlendirmeleri (büyük harf, eski alan adı) |
| `public/urunler/` | Ürün fotoğrafları (384×384 webp) |
| `public/mekan/`, `public/og/`, `public/flags/` | Karşılama görselleri, paylaşım önizlemesi, bayraklar |
| `betikler/` | Bakım betikleri (bkz. [Betikler](#7-betikler)) |
| `yedek/` | Firestore ve menü yedekleri (JSON) |
| `panel-gorselleri/` | Panel ekran görüntüleri |
| `firestore.rules`, `storage.rules` | Güvenlik kuralları |
| `yeni-gorseller/` | Ham fotoğraflar. **Git dışında**, yalnızca yerelde |

## 5. Yerel geliştirme

**Gereksinimler:** Node.js 24 (Vercel'in varsayılan sürümü) ve npm.

```bash
npm install
```

### Ortam değişkenleri

Kök dizinde `.env.local` dosyası oluşturun. Bu dosya `.gitignore`
kapsamında; **asla commit edilmez**. Değerler Firebase konsolundan (ya da
`vercel env pull` ile Vercel'den) alınır.

| Değişken | Kullanıldığı yer | Not |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | tarayıcı (giriş) | Firebase web yapılandırması |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | tarayıcı (giriş) | 〃 |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | tarayıcı, betikler | 〃 |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | tarayıcı | 〃 |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | tarayıcı | 〃 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | tarayıcı | 〃 |
| `FIREBASE_SERVICE_ACCOUNT` | sunucu, betikler | Servis hesabı JSON'u, **tek satır** olarak. Gizli. |

`NEXT_PUBLIC_*` değerleri tanım gereği tarayıcıya gider; korumayı
güvenlik kuralları sağlıyor. `FIREBASE_SERVICE_ACCOUNT` ise tam yetkili
anahtardır: yalnızca `.env.local` ve Vercel ortam değişkenlerinde durur,
repoya, sohbete ya da e-postaya kopyalanmaz. `vercel env pull` ayrıca
`VERCEL_OIDC_TOKEN` ekler; yerel çalışma için gerekmez.

### Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu (http://localhost:3000) |
| `npm run build` | Üretim derlemesi (Firestore'a erişim gerekir) |
| `npm start` | Derlenmiş sürümü çalıştırır |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Tip denetimi |

> ⚠️ **Yerel sunucu da canlı Firestore'a bağlanır.** Yerelde panelden
> yapılan her kayıt gerçek menü verisini değiştirir. Test için
> `test-hesaplari.ts` ile geçici hesap açın, değişikliği geri alın,
> hesabı silin.

## 6. Firebase

Tek bir Firebase projesi kullanılıyor.

**Firestore koleksiyonları**

| Koleksiyon | İçerik | İstemci erişimi |
|---|---|---|
| `kategoriler` | 8 kategori: ad, sıra, fiyat sütunları | yalnızca okuma |
| `urunler` | 56 ürün: ad, içerik, fiyatlar, görsel | yalnızca okuma |
| `ayarlar/genel` | aktif tema ve temaya göre renk seçimi | yalnızca okuma |
| `yoneticiler/{uid}` | panele girebilen hesaplar | kapalı |

**Panel hesabı.** Kayıt ekranı yok. Hesap Firebase konsolunda
(Authentication → e-posta/şifre) açılır, sonra yönetici yapılır:

```bash
npx tsx betikler/yonetici-ekle.ts <eposta>
```

Girişin yeterli olması için ikisi birden gerekir: Authentication'da hesap
**ve** `yoneticiler` koleksiyonunda o hesabın belgesi.

**Güvenlik kuralları.** `firestore.rules` depodaki asıl kaynak.
Yayına almak ve sınamak için:

```bash
node betikler/kurallari-yukle.mjs   # kuralları yayına alır
node betikler/kural-testi.mjs       # istemciden yazmanın reddedildiğini sınar
```

**Storage.** Henüz kurulmadı; Firebase projesinin Blaze planına geçmesi
gerekiyor. `storage.rules` hazır bekliyor. O zamana kadar ürün fotoğrafları
proje dosyası olarak (`public/urunler/`) ekleniyor.

## 7. Betikler

`.ts` betikleri `npx tsx betikler/<ad>.ts`, `.mjs` olanlar
`node betikler/<ad>.mjs` ile çalışır. Hepsi `.env.local`'ı okur. Her
betiğin başında ayrıntılı açıklaması var.

### Yedek

| Betik | Ne yapar |
|---|---|
| `yedek-firestore.ts` | Firestore'un tarih damgalı tam yedeğini `yedek/firestore-YYYY-AA-GG.json` olarak alır. **Yalnızca okur.** Büyük bir değişiklikten önce çalıştırın. |
| `yedek-al.ts` | `data/menu.ts`'in yedeği. Firestore'a geçiş öncesinden kalma. |

### Doğrulama

| Betik | Ne yapar |
|---|---|
| `tohum-dogrula.ts` | Firestore'u `data/menu.ts` ile **alan alan** karşılaştırır (kategoriler, ürünler, dört dil, fiyatlar, görseller). Tek fark varsa hata verir. |
| `renk-kontrast.ts` | Renk paletlerindeki her rengin WCAG AA eşiğini geçtiğini ölçer. Palete renk ekleyen herkes çalıştırmalı. |
| `kural-testi.mjs` | Güvenlik kurallarının tarayıcıdan yazmayı gerçekten reddettiğini sınar. |

### Görsel

| Betik | Ne yapar |
|---|---|
| `gorsel-ekle-4.ts` | **Güncel örnek.** Ham fotoğrafı 384×384 webp (kalite 82) olarak `public/urunler/`'e işler. İşlemeden önce bozuk dosya ve bilinen kopya denetimi yapar, büyütme yapmaz. Yeni fotoğraf için bu dosya kopyalanıp uyarlanabilir. |
| `gorsel-guncelle.ts` | Firestore'da **yalnızca `gorsel` alanını** `data/menu.ts` ile eşitler. Önce ne yazacağını gösterir. |
| `gorsel-kare.ts` | Bütün ürün fotoğraflarını kare (384×384) olarak yeniden üretir. |
| `gorsel-isle.ts`, `gorsel-ekle.ts`, `gorsel-ekle-2.ts`, `gorsel-ekle-3.ts`, `gorsel-veri-2.ts` | Önceki fotoğraf partilerinin kaydı. |

**Yeni ürün fotoğrafı ekleme sırası:**

1. Ham dosyayı `yeni-gorseller/`'e koyun; filigran, logo ve kopya
   kontrolü yapın.
2. İşleme betiğini çalıştırın → `public/urunler/<ürün-id>.webp`.
3. `data/menu.ts` içinde ürünün `gorsel` alanını doldurun (dört dilde alt
   metinle).
4. `npx tsx betikler/gorsel-guncelle.ts` — **derlemeden önce**.
5. `npx tsx betikler/tohum-dogrula.ts`
6. `npx tsc --noEmit && npm run lint && npm run build`
7. Push.

### Veri yazma

| Betik | Ne yapar |
|---|---|
| `menu-yaz.ts` | `data/menu.ts`'teki menüyü Firestore'a yazar ve menüde artık olmayan ürünleri siler. `ayarlar`'a dokunmaz. `--yaz` verilmezse yalnızca ne yapacağını gösterir. |
| `menu-uret.ts` | `data/menu.ts`'i fiziksel menüden üretmişti. Tarihî kayıt. |

### Yönetim ve test

| Betik | Ne yapar |
|---|---|
| `yonetici-ekle.ts <eposta>` | Authentication'daki hesabı panel yöneticisi yapar. |
| `test-hesaplari.ts ac` / `sil` | Doğrulama için iki geçici hesap (biri yönetici, biri değil) açar ya da siler. Sahibin hesabına dokunmaz. |
| `kurallari-yukle.mjs` | Güvenlik kurallarını yayına alır. |

### ⚠️ Dikkatli kullanılacaklar

| Betik | Neden |
|---|---|
| `tohum.ts` | İlk kurulum içindi. `ayarlar/genel`'i varsayılan temayla **ezer** (panelden seçilen tema ve renkler gider) ve menüden çıkan ürünleri silmez. Günlük işler için `menu-yaz.ts` ya da `gorsel-guncelle.ts` kullanın. |
| `test-temizle.ts` | Fiyatları `data/menu.ts`'e döndürür, fazladan ürünleri siler ve **temayı zorla Çini Levha'ya çevirir**. Canlı temayı değiştirir. |

## 8. Dağıtım

- **Barındırma:** Vercel. GitHub deposu bağlı; **`main` dalına her push
  otomatik üretim dağıtımı başlatır** (yaklaşık bir dakika).
- **Ortam değişkenleri:** Vercel proje ayarlarında tanımlı
  ([Ortam değişkenleri](#ortam-değişkenleri) ile aynı adlar).
- **Push öncesi:**

  ```bash
  npx tsc --noEmit
  npm run lint
  npm run build
  ```

- **Alan adı:** `www.huzurpidedikbiyik.com`. `huzurpidedikbiyik.com` ve
  eski `huzur-pide.vercel.app` adresleri `www`'ye yönleniyor. Alan adı
  değişirse `data/adres.ts` güncellenir.
- **Geri alma:** Yayında sorun çıkarsa Vercel panelinden önceki dağıtım
  yeniden üretime alınabilir.
- **İçerik değişikliği için dağıtım gerekmez.** Panelden yapılan fiyat,
  ürün, tema ve renk değişiklikleri birkaç saniyede menüye yansır. Kod,
  fotoğraf dosyası ve yeni kategori için push gerekir.

## 9. Belgeler

| Dosya | İçerik |
|---|---|
| [`KULLANIM.md`](KULLANIM.md) | Mekân sahibi için panel kullanım rehberi: giriş, şifre sıfırlama, fiyat değiştirme, ürün ekleme ve silme, tema ve renk |
| [`ILERLEME.md`](ILERLEME.md) | Proje geçmişi: aşama aşama raporlar, ölçümler, kararlar ve **Bekleyenler** tablosu |
| [`AGENTS.md`](AGENTS.md) | Bu Next.js sürümünün belgelerinin nerede olduğu (`node_modules/next/dist/docs/`) |

## 10. Bilinen sınırlar ve geçici çözümler

- **`jose` sabitlemesi (`package.json` → `overrides`).** `firebase-admin`
  → `jwks-rsa` → `jose@6` zinciri Vercel'de `ERR_REQUIRE_ESM` hatası
  veriyordu; `jose` 5'e sabitlendi. Geçici. Neden ve ne zaman
  kaldırılacağı: `ILERLEME.md` → *İleride Kaldırılacak*.
- **`uuid` sabitlemesi (`package.json` → `overrides` → `gaxios@^6`).**
  `firebase-admin` → `@google-cloud/storage` → `gaxios` 6 → `uuid` 9
  zinciri orta düzey bir güvenlik uyarısı veriyordu; o daldaki `uuid` 11'e
  sabitlendi. Geçici; ayrıntı aynı yerde.
- **Panelden fotoğraf yükleme yok.** Firebase Storage kurulumunu bekliyor.
  Yeni ürün, fotoğrafı eklenene kadar bölümünün simgesiyle görünür.
- **Kategoriler ve mevcut ürünlerin ad ve çevirileri panelden
  değişmiyor.** Panelde yalnızca fiyat değiştirilebiliyor, ürün eklenip
  silinebiliyor (yeni ürüne eklerken çeviri girilebiliyor). Diğer içerik
  değişiklikleri kodda (`data/menu.ts`) yapılıp `menu-yaz.ts` ile
  Firestore'a yazılıyor.
- **JavaScript kapalıyken** menü kitabı her zaman ilk sayfada açılıyor;
  yana kaydırarak gezinilebiliyor, oklar ve sayaç gizli.
- **Açık kararlar** (QR kodunun bakacağı adres, Vercel planı, Arapça
  çevirilerin kontrolü vb.) `ILERLEME.md` → *Bekleyenler* tablosunda.
