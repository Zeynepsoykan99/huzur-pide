"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cikisYap } from "./eylemler";

/** Oturumu kapatir; cerez sunucuda siliniyor. */
export function CikisDugmesi() {
  const router = useRouter();
  const [bekliyor, basla] = useTransition();

  return (
    <button
      type="button"
      className="panel-dugme panel-dugme-ikincil"
      style={{ minHeight: "2.5rem", padding: "0.4rem 0.9rem", fontSize: "0.9rem" }}
      disabled={bekliyor}
      onClick={() =>
        basla(async () => {
          await cikisYap();
          router.refresh();
        })
      }
    >
      Çıkış
    </button>
  );
}
