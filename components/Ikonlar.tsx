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

/**
 * Organizasyon kartı — üstten görünüm yuvarlak sofra: ortada servis tabağı,
 * çevresinde beş sandalye.
 *
 * İlk sürümde sandalyeler de daire çizilmişti ve bütün film makarası gibi
 * okunuyordu. Sandalyeler yuvarlak köşeli dikdörtgene çevrilip masaya doğru
 * döndürülünce sofra olduğu anlaşılır oldu.
 */
export function SofraIkonu({ className }: { className?: string }) {
  const sandalyeler = [
    { x: 24, y: 4.5, d: 0 },
    { x: 42.55, y: 17.97, d: 72 },
    { x: 35.46, y: 39.78, d: 144 },
    { x: 12.54, y: 39.78, d: 216 },
    { x: 5.45, y: 17.97, d: 288 },
  ];
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      {/* Masa */}
      <circle cx="24" cy="24" r="13" stroke="currentColor" strokeWidth="2.2" />
      {/* Ortadaki servis tabagi */}
      <circle cx="24" cy="24" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      {/* Sandalyeler — her biri masaya bakacak sekilde donduruldu */}
      <g stroke="currentColor" strokeWidth="1.8">
        {sandalyeler.map((s, i) => (
          <rect
            key={i}
            x="-3.5"
            y="-2.5"
            width="7"
            height="5"
            rx="1.6"
            transform={`translate(${s.x} ${s.y}) rotate(${s.d})`}
          />
        ))}
      </g>
    </svg>
  );
}
