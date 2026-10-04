"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function PublicExperience({ children, className }: { children: ReactNode; className: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pointer = () => { root.dataset.inputModality = "pointer"; };
    const keyboard = (event: KeyboardEvent) => {
      if (["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
        root.dataset.inputModality = "keyboard";
      }
    };
    document.addEventListener("pointerdown", pointer, true);
    document.addEventListener("keydown", keyboard, true);
    return () => {
      document.removeEventListener("pointerdown", pointer, true);
      document.removeEventListener("keydown", keyboard, true);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined" || !Element.prototype.animate) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = matchMedia("(min-width: 1024px) and (pointer: fine) and (hover: hover)");
    const registered = new Set<HTMLElement>();
    const revealed = new WeakSet<HTMLElement>();
    const visiblePhotos = new Set<HTMLElement>();
    const animations = new Map<HTMLElement, Animation>();
    let frame = 0;

    function finishAnimations() {
      animations.forEach((animation, element) => {
        animation.cancel();
        element.dataset.motionState = "done";
      });
      animations.clear();
    }

    function updateParallax() {
      frame = 0;
      if (reduced.matches || !desktop.matches) return;
      const positions = [...visiblePhotos].map(element => {
        const bounds = element.parentElement!.getBoundingClientRect();
        const progress = (innerHeight / 2 - bounds.top - bounds.height / 2) / (innerHeight / 2 + bounds.height / 2);
        return { element, offset: Math.max(-12, Math.min(12, progress * 12)) };
      });
      positions.forEach(({ element, offset }) => element.style.setProperty("--parallax-offset", `${offset.toFixed(2)}px`));
    }

    function scheduleParallax() {
      if (!frame && visiblePhotos.size && desktop.matches && !reduced.matches) frame = requestAnimationFrame(updateParallax);
    }

    function reveal(element: HTMLElement) {
      if (revealed.has(element)) return;
      revealed.add(element);
      if (reduced.matches || element.matches(":focus-within")) {
        element.dataset.motionState = "done";
        return;
      }
      const kind = element.dataset.motion;
      const from = kind === "line" ? { opacity: 1, transform: "scaleX(0)" }
        : kind === "hero-text" ? { opacity: 0.35, transform: "translateY(24px)" }
        : kind === "hero-link" ? { opacity: 0.35, transform: "none" }
        : kind === "hero-photo" ? { opacity: 0.65, transform: "scale(1.08)" }
        : kind === "photo" ? { opacity: 1, transform: "translateY(18px) scale(1.02)" }
        : kind === "hero" ? { opacity: 1, transform: "translateY(14px)" }
        : kind === "side" ? { opacity: 0, transform: "translateX(-18px)" }
        : { opacity: 0, transform: "translateY(16px)" };
      const animation = element.animate([from, { opacity: 1, transform: "none" }], {
        duration: kind === "photo" || kind?.startsWith("hero-") ? 900 : kind === "line" ? 500 : 700,
        delay: Math.min(210, Math.max(0, Number(element.dataset.motionDelay ?? 0))),
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      });
      element.dataset.motionState = "running";
      animations.set(element, animation);
      animation.onfinish = () => {
        element.dataset.motionState = "done";
        animations.delete(element);
      };
    }

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        if (element.hasAttribute("data-parallax")) {
          if (entry.isIntersecting) visiblePhotos.add(element);
          else visiblePhotos.delete(element);
        } else if (entry.isIntersecting) {
          reveal(element);
          observer.unobserve(element);
        }
      }
      if (!visiblePhotos.size && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      scheduleParallax();
    }, { threshold: 0.08 });

    function register() {
      root!.querySelectorAll<HTMLElement>("[data-motion], [data-parallax]").forEach(element => {
        if (registered.has(element)) return;
        registered.add(element);
        if (reduced.matches && element.hasAttribute("data-motion")) reveal(element);
        else observer.observe(element);
      });
    }

    function preferencesChanged() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      registered.forEach(element => element.style.removeProperty("--parallax-offset"));
      if (reduced.matches) {
        finishAnimations();
        registered.forEach(element => {
          if (element.hasAttribute("data-motion")) reveal(element);
        });
      }
      scheduleParallax();
    }

    function focusContent(event: FocusEvent) {
      if (!(event.target instanceof Element)) return;
      for (const [element, animation] of animations) {
        if (element.contains(event.target)) animation.finish();
      }
    }

    // Streaming and client-side navigation can insert sections after the layout mounts.
    const mutations = new MutationObserver(register);
    mutations.observe(root, { childList: true, subtree: true });
    register();
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window.addEventListener("resize", scheduleParallax);
    root.addEventListener("focusin", focusContent);
    reduced.addEventListener("change", preferencesChanged);
    desktop.addEventListener("change", preferencesChanged);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      finishAnimations();
      cancelAnimationFrame(frame);
      registered.forEach(element => element.style.removeProperty("--parallax-offset"));
      window.removeEventListener("scroll", scheduleParallax);
      window.removeEventListener("resize", scheduleParallax);
      root.removeEventListener("focusin", focusContent);
      reduced.removeEventListener("change", preferencesChanged);
      desktop.removeEventListener("change", preferencesChanged);
    };
  }, [pathname]);

  return <div ref={rootRef} className={`public-site ${className}`}>{children}</div>;
}
