import type { Metadata } from "next";
import "../globals.css";
import "./panel.css";

/**
 * Panelin kok layout'u.
 *
 * Musteri tarafi `app/[dil]/layout.tsx` altinda yasiyor ve <html lang/dir>
 * degerlerini URL'den aliyor. Panel dil onekli degil — her zaman Turkce ve
 * her zaman soldan saga — bu yuzden kendi koku var.
 *
 * Menu temasi burada UYGULANMIYOR: panel `tema-*` sinifini almiyor, kendi
 * --p-* degiskenleriyle boyaniyor. Gerekcesi panel.css'in basinda.
 */
export const metadata: Metadata = {
  title: "Yönetim · Huzur Pide",
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return (
    <html lang="tr" dir="ltr">
      <body className="panel">{children}</body>
    </html>
  );
}
