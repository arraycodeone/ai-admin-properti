"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Brand } from "./brand";
import { usePathname } from "next/navigation";

export function Header({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  return (
    <>
      <div className="demo-strip"><span>Website demo</span> Listing, foto, dan profil agen merupakan ilustrasi.</div>
      <header className="site-header" onKeyDown={event => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}>
        <div className="container header-inner">
          <Link href="/" className="wordmark" aria-label={`${name}, beranda`} onClick={() => setOpen(false)}>
            <Brand name={name} />
          </Link>
          <button
            ref={menuButton}
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? "Tutup" : "Menu"}
            <span aria-hidden="true">{open ? "×" : "☰"}</span>
          </button>
          <nav id="main-navigation" aria-label="Navigasi utama" data-open={open}>
            <Link href="/properti" aria-current={pathname.startsWith("/properti") ? "page" : undefined} onClick={() => setOpen(false)}>Properti</Link>
            <Link href="/#kawasan" onClick={() => setOpen(false)}>Kawasan</Link>
            <Link href="/tentang" aria-current={pathname === "/tentang" ? "page" : undefined} onClick={() => setOpen(false)}>Tentang Nusa</Link>
            <Link href="/#konsultasi" onClick={() => setOpen(false)}>Konsultasi</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
