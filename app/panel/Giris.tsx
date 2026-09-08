"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { istemciKimligi } from "@/lib/firebase-istemci";
import { girisYap } from "./eylemler";

/**
 * Panel girisi.
 *
 * Iki adim: (1) tarayici Firebase Auth ile e-posta/sifre dogrulamasi yapip
 * bir kimlik belirteci aliyor, (2) belirtec sunucuya gonderiliyor, sunucu onu
 * Admin SDK ile yeniden dogrulayip httpOnly oturum cerezine ceviriyor.
 *
 * KAYIT EKRANI YOK: hesaplar yalnizca Firebase konsolundan aciliyor.
 *
 * Kutu TEK, kip iki: ya giris ya sifre sifirlama. Ikisini ayni anda
 * gostermek ic ice <form> demek olurdu (gecersiz HTML) ve ekranda iki ayri
 * e-posta alani birden dururdu. Yazilan e-posta kipler arasinda tasiniyor.
 */

/** Kullaniciya gosterilecek mesaj; rengini turu belirliyor. */
type Bildirim = { tur: "hata" | "basari"; metin: string };

/**
 * Gonderim sonrasi dugmenin pasif kalacagi sure.
 *
 * BU BIR GUVENLIK ONLEMI DEGIL — tarayici konsolundan SDK dogrudan
 * cagrilarak atlatilabilir. Amaci yalnizca kazara ust uste tiklamayi
 * onlemek. Gercek hiz siniri Firebase'in kendi `sendOobCode` kotasi:
 * sunucu tarafinda, atlatilamiyor ve asilinca `auth/too-many-requests`
 * donuyor (asagida karsiligi yaziliyor).
 */
const BEKLEME_SANIYE = 60;

/** Firebase hatalarindan kod cikariyor; kod yoksa bos donuyor. */
function hataKodu(e: unknown): string {
  return typeof e === "object" && e !== null && "code" in e
    ? String((e as { code: unknown }).code)
    : "";
}

export function Giris() {
  const router = useRouter();
  const [kip, setKip] = useState<"giris" | "sifirlama">("giris");
  const [eposta, setEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [bildirim, setBildirim] = useState<Bildirim | null>(null);
  const [calisiyor, setCalisiyor] = useState(false);
  const [bekleme, setBekleme] = useState(0);

  useEffect(() => {
    if (bekleme <= 0) return;
    const sayac = setInterval(() => setBekleme((s) => s - 1), 1000);
    return () => clearInterval(sayac);
  }, [bekleme]);

  /** Kip degisiminde eski mesaj kalmasin: baska bir ekrana ait olur. */
  function kipDegistir(yeni: "giris" | "sifirlama") {
    setBildirim(null);
    setKip(yeni);
  }

  async function girisGonder(e: React.FormEvent) {
    e.preventDefault();
    setBildirim(null);
    setCalisiyor(true);
    try {
      const sonuc = await signInWithEmailAndPassword(
        istemciKimligi(),
        eposta.trim(),
        sifre,
      );
      const belirtec = await sonuc.user.getIdToken();
      const cevap = await girisYap(belirtec);
      if (!cevap.ok) {
        setBildirim({ tur: "hata", metin: cevap.hata });
        return;
      }
      router.refresh();
    } catch {
      // Firebase hata kodlarini kullaniciya gostermiyoruz: "auth/
      // invalid-credential" mekan sahibine bir sey ifade etmez.
      setBildirim({ tur: "hata", metin: "E-posta veya şifre hatalı." });
    } finally {
      setCalisiyor(false);
    }
  }

  async function sifirlamaGonder(e: React.FormEvent) {
    e.preventDefault();
    setBildirim(null);
    setCalisiyor(true);
    try {
      await sendPasswordResetEmail(istemciKimligi(), eposta.trim());
      /**
       * Mesaj bilerek "gonderildi" DEMIYOR, "kayitliysa gonderildi" diyor:
       * boylece hangi adreslerin hesabi oldugu ekrandan okunamiyor.
       *
       * Bu, projenin Firebase ayariyla da tutarli: `emailPrivacyConfig.
       * enableImprovedEmailPrivacy` ACIK, yani Firebase var olmayan bir
       * adres icin de hatasiz donuyor ve `auth/user-not-found` hic
       * gelmiyor. Yani iki durumu burada zaten AYIRT EDEMIYORUZ; mesajin
       * tek bir metin olmasi bunun dogal sonucu.
       */
      setBildirim({
        tur: "basari",
        metin:
          "Bu adres kayıtlıysa, şifre sıfırlama bağlantısı e-postanıza gönderildi. " +
          "Gelen kutunuzu ve gereksiz (spam) klasörünü kontrol edin.",
      });
      setBekleme(BEKLEME_SANIYE);
    } catch (e) {
      // Buradaki kodlarin hicbiri hesabin var olup olmadigini ele vermiyor:
      // adres bicimi, hiz siniri ve ag hatasi. Hesap varligiyla ilgili tek
      // kod (`auth/user-not-found`) zaten gelmiyor (yukaridaki nota bakin).
      const kod = hataKodu(e);
      const metin =
        kod === "auth/invalid-email" || kod === "auth/missing-email"
          ? "E-posta adresi geçerli görünmüyor. Adresi kontrol edin."
          : kod === "auth/too-many-requests"
            ? "Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar deneyin."
            : kod === "auth/network-request-failed"
              ? "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin."
              : "Şu an gönderilemedi. Birazdan tekrar deneyin.";
      setBildirim({ tur: "hata", metin });
    } finally {
      setCalisiyor(false);
    }
  }

  const mesaj = bildirim ? (
    <p
      className={`panel-bildirim panel-bildirim-${bildirim.tur}`}
      role={bildirim.tur === "hata" ? "alert" : "status"}
    >
      {bildirim.metin}
    </p>
  ) : null;

  if (kip === "sifirlama") {
    return (
      <form className="panel-giris-kutu" onSubmit={sifirlamaGonder}>
        {mesaj}

        <p className="panel-giris-aciklama">
          E-posta adresinizi yazın; şifrenizi yenilemeniz için bir bağlantı
          gönderelim.
        </p>

        <label className="panel-alan">
          <span className="panel-etiket">E-posta</span>
          <input
            className="panel-girdi"
            type="email"
            inputMode="email"
            autoComplete="username"
            required
            value={eposta}
            onChange={(e) => setEposta(e.target.value)}
          />
        </label>

        <button
          className="panel-dugme"
          type="submit"
          disabled={calisiyor || bekleme > 0}
          style={{ width: "100%" }}
        >
          {calisiyor
            ? "Gönderiliyor…"
            : bekleme > 0
              ? `Gönderildi · ${bekleme} sn`
              : "Sıfırlama bağlantısı gönder"}
        </button>

        <button
          className="panel-metin-dugme"
          type="button"
          onClick={() => kipDegistir("giris")}
        >
          Girişe dön
        </button>
      </form>
    );
  }

  return (
    <form className="panel-giris-kutu" onSubmit={girisGonder}>
      {mesaj}

      <label className="panel-alan">
        <span className="panel-etiket">E-posta</span>
        <input
          className="panel-girdi"
          type="email"
          inputMode="email"
          autoComplete="username"
          required
          value={eposta}
          onChange={(e) => setEposta(e.target.value)}
        />
      </label>

      <label className="panel-alan">
        <span className="panel-etiket">Şifre</span>
        <input
          className="panel-girdi"
          type="password"
          autoComplete="current-password"
          required
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
        />
      </label>

      <button className="panel-dugme" type="submit" disabled={calisiyor} style={{ width: "100%" }}>
        {calisiyor ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>

      <button
        className="panel-metin-dugme"
        type="button"
        onClick={() => kipDegistir("sifirlama")}
      >
        Şifremi unuttum
      </button>
    </form>
  );
}
