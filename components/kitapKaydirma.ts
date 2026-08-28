/**
 * Menü kitabının yatay konumlandırması — yazma yönünden bağımsız.
 *
 * `scrollLeft`'in işareti yazma yönüne göre değişiyor: RTL'de sağ uç sıfır,
 * sola gittikçe negatif. Mutlak bir değer hesaplamak yerine burada **fark**
 * kullanılıyor — hedef sayfanın kutusu ile kabın kutusu arasındaki mesafe
 * doğru işareti her iki yönde de kendiliğinden taşıyor.
 *
 * Hem açılış konumlandırması hem ok düğmeleri bu tek yardımcıyı kullanıyor.
 */

/** İşletim sisteminin hareket azaltma tercihi açık mı? */
export function azHareket(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Kabı, verilen numaralı sayfa ekrana tam oturacak şekilde kaydırır.
 *
 * `yumusak` yalnızca ok düğmelerinde kullanılıyor; açılışta anlık olmalı,
 * yoksa müşteri sayfanın kaydığını görür.
 */
export function sayfayaKaydir(kap: HTMLElement, no: number, yumusak = false): void {
  const hedef = document.getElementById(`s${no}`);
  if (!hedef) return;

  const fark = hedef.getBoundingClientRect().left - kap.getBoundingClientRect().left;
  if (Math.abs(fark) < 1) return;

  if (yumusak && !azHareket()) {
    kap.scrollBy({ left: fark, behavior: "smooth" });
    return;
  }

  // Anlık konumlandırmada scrollBy DEĞİL, doğrudan atama.
  //
  // Sayfalarda `scroll-snap-stop: always` var (hızlı bir parmak hareketinde
  // sayfa atlanmasın diye). Bu, programatik `scrollBy` çağrısını da bir snap
  // noktasında durduruyor: 1. sayfadan 9. sayfaya kaydırmak istediğimizde
  // tarayıcı yalnızca 2. sayfaya gidiyordu. Doğrudan atama snap-stop'a
  // takılmıyor. Ok düğmeleri zaten hep tek sayfa ilerlediği için orada
  // yumuşak scrollBy sorun çıkarmıyor.
  kap.scrollLeft += fark;
}
