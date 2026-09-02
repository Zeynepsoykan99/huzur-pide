"use client";

import { useState, useTransition } from "react";
import { TemaMotifi } from "@/components/TemaMotifi";
import {
  SECILEBILIR_TEMALAR,
  TEMA_ADI,
  TEMA_TARIFI,
  type SecilebilirTema,
  type TemaKodu,
} from "@/data/tema";
import { temayiDegistir } from "../eylemler";

/**
 * Tema secimi.
 *
 * Uc secenek: Cini Levha, Gece Ocagi, Murekkep. Zeytin kodda duruyor ama
 * secenek degil (bkz. data/tema.ts, SECILEBILIR_TEMALAR).
 *
 * Her kartta o temanin gercek zemin rengi ve motifi var — mekan sahibi
 * ismine degil, gorunusune bakarak secebilsin.
 */
const ORNEK_RENK: Record<SecilebilirTema, { zemin: string; renk: string }> = {
  cini: { zemin: "#f6f2e9", renk: "#12356b" },
  gece: { zemin: "#14100d", renk: "#e59a4a" },
  murekkep: { zemin: "#f2ede3", renk: "#bf3721" },
};

export function TemaSecici({ baslangic }: { baslangic: TemaKodu }) {
  const [secili, setSecili] = useState<TemaKodu>(baslangic);
  const [bildirim, setBildirim] = useState<
    { tur: "basari" | "hata"; metin: string } | null
  >(null);
  const [bekliyor, basla] = useTransition();

  function sec(tema: SecilebilirTema) {
    if (tema === secili || bekliyor) return;
    const oncekiTema = secili;
    setSecili(tema);
    setBildirim(null);
    basla(async () => {
      const sonuc = await temayiDegistir(tema);
      if (sonuc.ok) {
        setBildirim({
          tur: "basari",
          metin: `Menü görünümü "${TEMA_ADI[tema]}" olarak değiştirildi.`,
        });
      } else {
        setSecili(oncekiTema);
        setBildirim({ tur: "hata", metin: sonuc.hata });
      }
    });
  }

  return (
    <>
      {bildirim ? (
        <p
          className={`panel-bildirim panel-bildirim-${
            bildirim.tur === "basari" ? "basari" : "hata"
          }`}
        >
          {bildirim.metin}
        </p>
      ) : null}

      <ul className="panel-tema-listesi">
        {SECILEBILIR_TEMALAR.map((tema) => (
          <li key={tema}>
            <button
              type="button"
              className="panel-tema-karti"
              aria-pressed={secili === tema}
              disabled={bekliyor}
              onClick={() => sec(tema)}
            >
              <span
                className="panel-tema-ornek"
                style={{
                  background: ORNEK_RENK[tema].zemin,
                  color: ORNEK_RENK[tema].renk,
                }}
                aria-hidden="true"
              >
                <TemaMotifi tema={tema} />
              </span>
              <span>
                <span className="panel-tema-ad">{TEMA_ADI[tema]}</span>
                <span className="panel-tema-tarif">{TEMA_TARIFI[tema]}</span>
              </span>
              {secili === tema ? (
                <span className="panel-tema-secili">
                  {bekliyor ? "Kaydediliyor…" : "Seçili"}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      <p className="panel-not">
        Menüyü kontrol etmek için{" "}
        <a href="/tr/menu" target="_blank" rel="noreferrer">
          müşteri menüsünü yeni sekmede açın
        </a>
        .
      </p>
    </>
  );
}
