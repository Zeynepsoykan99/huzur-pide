/**
 * Ana seçim ekranındaki kart ikonları.
 *
 * Logonun çizgi diliyle aynı: ince kontur, yumuşak uçlar. `currentColor`
 * kullanıyorlar, böylece kartın metin rengini alıyor ve hover'da metinle
 * birlikte koyulaşıyorlar.
 *
 * İkisi de dekoratif: yanlarındaki başlık zaten ne olduğunu söylüyor.
 */

/**
 * Menü kartı — fırından yeni çıkmış pide.
 *
 * İlk sürümde mercek şeklinin içinde ikinci bir mercek vardı ve 40px'te
 * göz gibi okunuyordu. İç mercek kaldırılıp yerine malzeme noktaları ve
 * üste buhar konduğunda şekil netleşti — logoda da aynı düzeltme yapılmıştı.
 */
export function PideIkonu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      {/* Kabaran hamur kenari */}
      <path
        d="M4 28c9.5-10 30.5-10 40 0-9.5 10-30.5 10-40 0Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Uzerindeki malzeme */}
      <g fill="currentColor">
        <circle cx="16.5" cy="27" r="1.9" />
        <circle cx="24" cy="29.5" r="2.2" />
        <circle cx="31.5" cy="26.5" r="1.8" />
      </g>
      {/* Sicak firindan cikan buhar */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeOpacity=".75">
        <path d="M16 15c-2-2.4 2-4 0-6.4M24 12.5c-2-2.4 2-4.4 0-6.8M32 15c-2-2.4 2-4 0-6.4" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Karsilama sayfasinin iletisim ikonlari.

   PideIkonu ile ayni dil: ince kontur, yumusak uclar, `currentColor`. Ama
   viewBox 24x24 — bunlar 48px'lik kart ikonu degil, satir basinda duran
   ~20px'lik isaretler; 48'lik gridde cizilse cizgiler o olcude kalinlasirdi.

   Hepsi dekoratif: yanlarindaki metin (telefon numarasi, adres, kullanici
   adi) bilginin kendisi. Bu yuzden aria-hidden.
   --------------------------------------------------------------------------- */

export function TelefonIkonu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InstagramIkonu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </svg>
  );
}

/** Konum — damla ve icindeki delik. */
export function KonumIkonu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 21s6.5-6.1 6.5-11a6.5 6.5 0 1 0-13 0c0 4.9 6.5 11 6.5 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

/**
 * Saat — kadran ve akrep/yelkovan.
 *
 * Ibreler 07:00'i gosteriyor: acilis saati. Rastgele bir aci yerine bilginin
 * kendisini cizmek ikonu sayfanin geri kalanina bagliyor.
 */
export function SaatIkonu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 7v5l-3 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Yer tutucu ikonlari — fotografi olmayan urunlerde gorsel yuvasinda duruyor.

   Hepsi DOLGU, kontur degil: yuva mobilde 56-80px ve ince bir konturun cizgisi
   1px'in altina dusup kayboluyor. Iki opaklik (0.4 zemin sekli, 0.6 detay)
   sekli duz kraft zeminde okunur tutuyor.

   Kategoriye gore ayri ikon var. Iki sebep: icecege pide silueti gostermek
   anlamca yanlisti, ve ayni yassi sekil bir sayfada yedi kez alt alta gelince
   desen gibi okunuyordu — mercek sekli tek basina goze de benziyordu.

   Hepsi 48x48 kare viewBox: yuva mobilde kare, md ustunde 16:9. Ikon
   yukseklige gore olceklendiginden ikisinde de tasmadan oturuyor.
   --------------------------------------------------------------------------- */

/** Kapali pide — ustten gorunum, uzerinde malzeme, ustunde buhar. */
export function YerTutucuPide({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <ellipse cx="24" cy="31" rx="20" ry="8" fill="currentColor" fillOpacity=".4" />
      <g fill="currentColor" fillOpacity=".6">
        <circle cx="16" cy="30" r="2" />
        <circle cx="24" cy="32.5" r="2.3" />
        <circle cx="32" cy="29.5" r="2" />
      </g>
      {/* Firindan yeni cikmis: buhar. Mercek sekli tek basina goz gibi
          okunuyordu, buhar ve malzeme onu kiriyor. */}
      <g fill="currentColor" fillOpacity=".45">
        <rect x="15.8" y="9" width="2.6" height="11" rx="1.3" />
        <rect x="22.7" y="6" width="2.6" height="14" rx="1.3" />
        <rect x="29.6" y="9" width="2.6" height="11" rx="1.3" />
      </g>
    </svg>
  );
}

/** Izgara — uc parca etin dizildigi sis. */
export function YerTutucuIzgara({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <g transform="rotate(-20 24 24)" fill="currentColor">
        {/* Sis cubugu */}
        <rect x="4" y="22.6" width="40" height="2.8" rx="1.4" fillOpacity=".4" />
        {/* Uzerindeki et parcalari */}
        <g fillOpacity=".6">
          <rect x="9" y="18" width="10" height="12" rx="3" />
          <rect x="20.5" y="18" width="10" height="12" rx="3" />
          <rect x="32" y="18" width="10" height="12" rx="3" />
        </g>
      </g>
    </svg>
  );
}

/** Salata — kase ve uzerinde yapraklar. */
export function YerTutucuSalata({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      {/* Yapraklar once ciziliyor ki kase onlerinde dursun */}
      <g fill="currentColor" fillOpacity=".6">
        <ellipse cx="16" cy="22" rx="7" ry="4.6" transform="rotate(-28 16 22)" />
        <ellipse cx="32" cy="22" rx="7" ry="4.6" transform="rotate(28 32 22)" />
        <ellipse cx="24" cy="18.5" rx="6.4" ry="4.2" />
      </g>
      {/* Kase */}
      <path
        d="M7 26h34c0 9.4-7.6 15-17 15S7 35.4 7 26Z"
        fill="currentColor"
        fillOpacity=".4"
      />
    </svg>
  );
}

/** Tatli — ayakli kase, icinde kubbe. Salatadan ayaguyla ayriliyor. */
export function YerTutucuTatli({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <g fill="currentColor">
        {/* Kasenin icindeki tatli */}
        <path d="M15 19c0-4.6 4-8 9-8s9 3.4 9 8Z" fillOpacity=".6" />
        {/* Kase */}
        <path d="M10 19h28c0 7.8-6.3 13.5-14 13.5S10 26.8 10 19Z" fillOpacity=".4" />
        {/* Ayak ve taban */}
        <rect x="22.4" y="31" width="3.2" height="7" fillOpacity=".4" />
        <rect x="17" y="37" width="14" height="3.2" rx="1.6" fillOpacity=".4" />
      </g>
    </svg>
  );
}

/** Icecek — bardak ve pipet. */
export function YerTutucuIcecek({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <g fill="currentColor">
        {/* Pipet — bardagin arkasindan cikiyor */}
        <rect
          x="28"
          y="6"
          width="3"
          height="18"
          rx="1.5"
          transform="rotate(16 29.5 15)"
          fillOpacity=".6"
        />
        {/* Bardak: agzi genis, tabani dar */}
        <path
          d="M14 13h20l-2.2 26.4A3 3 0 0 1 28.8 42h-9.6a3 3 0 0 1-3-2.6Z"
          fillOpacity=".4"
        />
        {/* Icindeki sivinin ust cizgisi */}
        <path d="M14.9 21.5h18.2l-.4 5H15.3Z" fillOpacity=".55" />
      </g>
    </svg>
  );
}
