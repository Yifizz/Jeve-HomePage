"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, Heart, MessageCircle, ThumbsUp } from "lucide-react";
import { principalPartners } from "../lib/partners";
import { PartnerLogo } from "./PartnerLogo";
import { PartnerTextReveal } from "./PartnerTextReveal";

type OrbitRing = "outer" | "inner";
const STAGE_W = 1200;
const STAGE_H = 440;
const CENTER = { x: 600, y: 620 };
const RADIUS: Record<OrbitRing, number> = { outer: 492, inner: 404 };

// The supplied orbit layout, using JEVE's real partner marks instead of avatars.
const orbitItems: { main: number; angle: number }[] = [
  { main: 3, angle: 146 },
  { main: 0, angle: 112 },
  { main: 1, angle: 68 },
  { main: 2, angle: 34 },
];

const engagementItems = [
  { icon: ThumbsUp, label: "Like", ring: "inner" as const, angle: 132 },
  { icon: Eye, label: "Visibilità", ring: "inner" as const, angle: 90 },
  { icon: MessageCircle, label: "Interazioni", ring: "inner" as const, angle: 48 },
  { icon: Heart, label: undefined, ring: "outer" as const, angle: 90 },
];

const popTransition = { type: "spring" as const, stiffness: 260, damping: 16, mass: 0.8 };

// Orbit-only sources: preserve the homepage and card sizing/marks.
const orbitPartners = principalPartners.map((partner) =>
  partner.name === "5JES" ? { ...partner, src: "/partners/principal-5jes-square.png" } : partner,
);

function positionOnRing(ring: OrbitRing, angle: number, scale?: number): CSSProperties {
  const rad = angle * Math.PI / 180;
  const factor = scale ?? 1;
  const precision = scale === undefined ? 3 : 0;
  return {
    // Stable CSS values avoid browser float rounding during hydration.
    left: `${((CENTER.x + RADIUS[ring] * Math.cos(rad)) * factor).toFixed(precision)}px`,
    top: `${((CENTER.y - RADIUS[ring] * Math.sin(rad)) * factor).toFixed(precision)}px`,
  };
}

function arcPath(radius: number) {
  const dy = CENTER.y - STAGE_H;
  const dx = Math.sqrt(radius * radius - dy * dy);
  return `M ${CENTER.x - dx} ${STAGE_H} A ${radius} ${radius} 0 0 1 ${CENTER.x + dx} ${STAGE_H}`;
}

export function PartnersOrbitHero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => setScale(Math.min(1, Math.max(0.1, frame.clientWidth / STAGE_W)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="partner-hero" aria-labelledby="partner-page-title">
      <p className="section-label">Partner · JEVE</p>
      <div className="partner-orbit-frame" ref={frameRef} style={{ height: STAGE_H * scale }}>
        <div
          className="partner-orbit-stage"
          style={{ width: STAGE_W, height: STAGE_H, transform: `translateX(-50%) scale(${scale})` }}
        >
          <svg className="partner-orbit-lines" width={STAGE_W} height={STAGE_H} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} fill="none" aria-hidden="true">
            {(["outer", "inner"] as const).map((ring, i) => (
              <motion.path
                key={ring}
                d={arcPath(RADIUS[ring])}
                className={`partner-orbit-line partner-orbit-line-${ring}`}
                strokeWidth={ring === "outer" ? 1.5 : 2}
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduceMotion ? 0 : 1.4, delay: i * 0.1, ease: "easeOut" }}
              />
            ))}
          </svg>
        </div>
        {/* Render logos at their actual size instead of scaling an already-painted stage. */}
        <div className="partner-orbit-logos" style={{ "--orbit-logo-size": `${(140 * scale).toFixed(3)}px`, "--orbit-logo-padding": `${(22 * scale).toFixed(3)}px` } as CSSProperties}>
          {orbitItems.map((item, i) => {
            const partner = orbitPartners[item.main];
            return (
              <div className="partner-orbit-node" key={partner.name} style={positionOnRing("outer", item.angle, scale)}>
                <motion.div
                  className="partner-orbit-pop"
                  initial={{ opacity: 0, scale: 0.2, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={reduceMotion ? { duration: 0 } : { ...popTransition, delay: 0.3 + i * 0.2 }}
                >
                <a
                  className="partner-orbit-logo partner-orbit-logo-main"
                  href={`#partner-principale-${item.main}`}
                  aria-label={`Scopri ${partner.label}`}
                  style={{ "--orbit-drift-duration": `${8 + i * 0.8}s`, "--orbit-drift-delay": `${1.3 + i * 0.3}s` } as CSSProperties}
                >
                  <PartnerLogo partner={partner} />
                </a>
                </motion.div>
              </div>
            );
          })}
        </div>
        {/* Keep labels outside the scaled stage so text and icons render at native resolution. */}
        <div className="partner-engagement-layer">
          {engagementItems.map(({ icon: Icon, label, ring, angle }, i) => (
            <div className="partner-engagement-node" key={i} style={positionOnRing(ring, angle, scale)} aria-hidden="true">
              <motion.div
                className={`partner-engagement-icon partner-engagement-appear${label ? " partner-engagement-chip" : ""}`}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.7 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                style={{ "--engagement-duration": `${5.8 + i * 0.6}s`, "--engagement-delay": `${-i * 1.2}s` } as CSSProperties}
              >
                <Icon size={22} strokeWidth={1.7} />
                {label && <span>{label}</span>}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      <div className="partner-orbit-mobile" aria-label="I nostri partner">
        {orbitItems.map(({ main }, i) => (
          <motion.div key={main} initial={{ opacity: 0, scale: 0.2, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { ...popTransition, delay: 0.3 + i * 0.2 }}>
          <a href={`#partner-principale-${main}`} className="partner-orbit-logo partner-orbit-logo-main" aria-label={`Scopri ${principalPartners[main].label}`} style={{ "--orbit-drift-duration": `${8 + i * 0.8}s`, "--orbit-drift-delay": `${1.3 + i * 0.3}s` } as CSSProperties}>
            <PartnerLogo partner={orbitPartners[main]} />
          </a>
          </motion.div>
        ))}
      </div>
      <div className="partner-engagement-mobile" aria-hidden="true">
        {engagementItems.filter((item) => item.label).map(({ icon: Icon, label }, i) => (
          <motion.span
            className="partner-engagement-icon partner-engagement-appear partner-engagement-chip"
            key={label}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.7 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
            style={{ "--engagement-duration": `${5.8 + i * 0.6}s`, "--engagement-delay": `${-i * 1.2}s` } as CSSProperties}
          >
            <Icon size={18} strokeWidth={1.7} /><span>{label}</span>
          </motion.span>
        ))}
      </div>
      <div className="partner-hero-copy">
        <PartnerTextReveal as="h1" id="partner-page-title" delay={0.35}>Il mezzo per la<br /><em>crescita condivisa.</em></PartnerTextReveal>
        <p>Collaborazioni che avvicinano studenti, professionisti e imprese, creando opportunità concrete per crescere insieme.</p>
        <div className="partner-hero-actions">
          <a className="button button-red" href="#partner-principali">Scopri i nostri partner</a>
        </div>
      </div>
      <nav className="partner-hero-tags" aria-label="Opportunità di partnership">
        <a href="#recruiting">Recruiting</a>
        <a href="#eventi">Eventi</a>
        <a href="#social-media">Social &amp; Media</a>
      </nav>
    </section>
  );
}
