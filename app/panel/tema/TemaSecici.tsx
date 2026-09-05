"use client";

import { TemaMotifi } from "@/components/TemaMotifi";
import {
  SECILEBILIR_TEMALAR,
  TEMA_ADI,
  TEMA_TARIFI,
  type SecilebilirTema,
} from "@/data/tema";

/**
 * Tema secimi — SUNUM bileseni.
 *
 * Durum ve kaydetme burada DEGIL, `GorunumSecici`da: onizleme temayla
 * rengin birlesimini gosteriyor, ikisinin durumu ayri tutulsaydi tema
 * tiklamasi onizlemeye bir gidis donus gecikmesiyle yansirdi.
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

export function TemaSecici({
  secili,
  bekliyor,
  onSec,
}: {
  secili: SecilebilirTema;
  bekliyor: boolean;
  onSec: (tema: SecilebilirTema) => void;
}) {
  return (
    <ul className="panel-tema-listesi">
      {SECILEBILIR_TEMALAR.map((tema) => (
        <li key={tema}>
          <button
            type="button"
            className="panel-tema-karti"
            aria-pressed={secili === tema}
            disabled={bekliyor}
            onClick={() => onSec(tema)}
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
  );
}
