"use client";

import { createElement, useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type TextTag = "h1" | "h2";

export function PartnerTextReveal({
  as = "h2", children, className = "", id, delay = 0,
}: { as?: TextTag; children: ReactNode; className?: string; id?: string; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.18 });
  const reduceMotion = useReducedMotion();

  // The server-rendered text stays readable even when JavaScript is unavailable.
  useEffect(() => {
    const element = ref.current;
    if (reduceMotion) element?.removeAttribute("data-reveal-ready");
    else element?.setAttribute("data-reveal-ready", "true");
  }, [reduceMotion]);

  return createElement(as, {
    ref, id, className: `partner-text-reveal ${className}`.trim(),
    style: { "--title-reveal-delay": `${delay}s` } as CSSProperties,
    "data-reveal-visible": visible ? "true" : undefined,
  }, children);
}
