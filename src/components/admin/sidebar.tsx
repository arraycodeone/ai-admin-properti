"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav() {
  const pathname = usePathname();
  return <nav aria-label="Navigasi dashboard">{[["/app", "Ringkasan"], ["/app/properti", "Properti"]].map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav>;
}
