import Link from "next/link";
import { TemaMotifi } from "@/components/TemaMotifi";
import type { TemaKodu } from "@/data/tema";
import { CikisDugmesi } from "./CikisDugmesi";

/** Panelin ust seridi. Marka geri donus yolu; sagda cikis. */
export function PanelUst({ tema }: { tema: TemaKodu }) {
  return (
    <header className="panel-ust">
      <Link href="/panel" className="panel-marka">
        <TemaMotifi className="panel-marka-motif" tema={tema} />
        Huzur Pide
      </Link>
      <CikisDugmesi />
    </header>
  );
}
