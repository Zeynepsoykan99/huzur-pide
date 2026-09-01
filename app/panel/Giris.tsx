"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
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
 */
export function Giris() {
  const router = useRouter();
  const [eposta, setEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [calisiyor, setCalisiyor] = useState(false);

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    setHata(null);
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
        setHata(cevap.hata);
        return;
      }
      router.refresh();
    } catch {
      // Firebase hata kodlarini kullaniciya gostermiyoruz: "auth/
      // invalid-credential" mekan sahibine bir sey ifade etmez.
      setHata("E-posta veya şifre hatalı.");
    } finally {
      setCalisiyor(false);
    }
  }

  return (
    <form className="panel-giris-kutu" onSubmit={gonder}>
      {hata ? <p className="panel-bildirim panel-bildirim-hata">{hata}</p> : null}

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
    </form>
  );
}
