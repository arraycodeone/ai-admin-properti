import type { SVGProps } from "react";

const paths = {
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  home: <><path d="m3 10 9-7 9 7v11H3Z"/><path d="M9 21v-8h6v8"/></>,
  apartment: <><path d="M5 21V3h14v18M9 7h1m4 0h1M9 11h1m4 0h1M9 15h1m4 0h1M10 21v-3h4v3"/></>,
  land: <><path d="m2 15 10-6 10 6-10 6ZM12 9V3m-3 0h6"/></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>,
  bed: <><path d="M3 18V6m18 12V9M3 14h18M6 10h5v4H6ZM11 10h10M3 18v3m18-3v3"/></>,
  area: <><path d="M4 9V4h5m6 0h5v5m0 6v5h-5M9 20H4v-5M4 4l5 5m11-5-5 5M4 20l5-5m11 5-5-5"/></>,
  arrow: <><path d="M4 12h16m-6-6 6 6-6 6"/></>,
  chat: <><path d="M21 11a9 9 0 0 1-9 9 10 10 0 0 1-4-.8L3 21l1.8-5A9 9 0 1 1 21 11Z"/><path d="M8 11h8m-8 4h5"/></>,
  photo: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1"/><path d="m3 17 5-5 4 4 4-6 5 7"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/></>,
} as const;

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
