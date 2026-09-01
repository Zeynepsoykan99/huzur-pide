import { BulunamadiEkrani } from "@/components/ekranlar";
import { aktifTema } from "@/data/menuKaynak";

/**
 * 404 — bulunamayan adres.
 *
 * `notFound()` bir layout'un ALTINDA calisiyor ama rota parametresini
 * okuyamiyor; bu yuzden dil burada Turkce'ye sabit. Ekranda dile bagli metin
 * yok — buyuk "404", temanin motifi ve "ana ekrana don" baglantisi.
 */
export default async function Bulunamadi() {
  const tema = await aktifTema();
  return <BulunamadiEkrani dil="tr" tema={tema} />;
}
