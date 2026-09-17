"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const tigerMask = "url('/jeve-tiger-mask.png')";

export function ContactRevealSection() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const reduceMotion = useReducedMotion();
  const staticSection = isMobile || reduceMotion;

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const updateMobile = () => setIsMobile(mobileQuery.matches);

    updateMobile();
    mobileQuery.addEventListener("change", updateMobile);
    return () => mobileQuery.removeEventListener("change", updateMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const tigerGrowth = useTransform(
    scrollYProgress,
    [0, 0.22, 0.46, 0.68, 0.86, 1],
    [0, 14, 56, 120, 190, 220],
  );
  const maskPositionX = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    [50, 50, 54.6],
  );
  const maskPositionY = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    [50, 50, 46.5],
  );
  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.16, 0.38, 0.62, 1],
    [0, 0, 0.78, 1, 1],
  );
  const copyBlur = useTransform(
    scrollYProgress,
    [0, 0.16, 0.4, 0.62, 1],
    [20, 20, 4, 0, 0],
  );
  const copyY = useTransform(scrollYProgress, [0, 0.62, 1], [34, 0, 0]);
  const copyScale = useTransform(
    scrollYProgress,
    [0, 0.62, 1],
    [0.96, 1, 1],
  );
  const copyFilter = useMotionTemplate`blur(${copyBlur}px)`;
  const copyPointerEvents = useTransform(scrollYProgress, (progress) =>
    progress > 0.58 ? "auto" : "none",
  );
  const detailsOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.62, 0.82],
    [0, 0, 0.62, 1],
  );
  const gridOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.62, 0.82],
    [0, 0, 0.075, 0.12],
  );
  const completionOpacity = useTransform(
    scrollYProgress,
    [0, 0.62, 0.82, 1],
    [0, 0, 1, 1],
  );
  const maskSize = useMotionTemplate`calc(clamp(390px, 48vw, 650px) + ${tigerGrowth}vmax)`;
  const maskPosition = useMotionTemplate`${maskPositionX}% ${maskPositionY}%`;

  useEffect(() => {
    headerRef.current = document.querySelector<HTMLElement>(".site-header");

    if (isMobile) {
      let frame: number | null = null;
      const updateHeader = () => {
        frame = null;
        const scene = sceneRef.current?.getBoundingClientRect();
        const header = headerRef.current?.getBoundingClientRect();
        if (!scene || !header) return;

        const headerCenter = header.top + header.height / 2;
        headerRef.current?.classList.toggle(
          "is-on-contact",
          scene.top <= headerCenter && scene.bottom > headerCenter,
        );
      };
      const scheduleUpdate = () => {
        if (frame === null) frame = requestAnimationFrame(updateHeader);
      };

      updateHeader();
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate);
      return () => {
        window.removeEventListener("scroll", scheduleUpdate);
        window.removeEventListener("resize", scheduleUpdate);
        if (frame !== null) cancelAnimationFrame(frame);
        headerRef.current?.classList.remove("is-on-contact");
      };
    }

    headerRef.current?.classList.toggle(
      "is-on-contact",
      scrollYProgress.get() >= 0.58,
    );

    return () => {
      headerRef.current?.classList.remove("is-on-contact");
    };
  }, [isMobile, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!isMobile) {
      headerRef.current?.classList.toggle("is-on-contact", progress >= 0.58);
    }
  });

  return (
    <section className="contact-reveal-scene" ref={sceneRef}>
      <div className="contact-reveal-sticky">
        <motion.div
          className="contact-completion-surface"
          style={{ opacity: staticSection ? 1 : completionOpacity }}
          aria-hidden="true"
        />
        <motion.div
          className="contact-section contact-reveal-mask"
          style={
            staticSection
              ? undefined
              : {
                  WebkitMaskImage: tigerMask,
                  maskImage: tigerMask,
                  WebkitMaskSize: maskSize,
                  maskSize,
                  WebkitMaskPosition: maskPosition,
                  maskPosition,
                }
          }
        >
          <motion.div
            className="contact-orbit"
            style={{ opacity: staticSection ? 1 : detailsOpacity }}
            aria-hidden="true"
          />
          <motion.div
            className="contact-grid"
            style={{ opacity: staticSection ? 0.12 : gridOpacity }}
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </motion.div>
        </motion.div>
        <motion.div
          className="contact-copy contact-copy-overlay"
          style={{
            opacity: staticSection ? 1 : copyOpacity,
            filter: staticSection ? "none" : copyFilter,
            y: staticSection ? 0 : copyY,
            scale: staticSection ? 1 : copyScale,
            pointerEvents: staticSection ? "auto" : copyPointerEvents,
          }}
        >
          <p className="section-label section-label-light">
            Il prossimo progetto
          </p>
          <h2>
            Dai valore
            <br />
            alle tue <em>idee.</em>
          </h2>
          <p>
            Raccontaci dove vuoi arrivare. Costruiamo insieme il percorso più
            efficace per il tuo business.
          </p>
          <a className="button button-light" href="mailto:info@jeve.it">
            Scrivici a info@jeve.it
          </a>
        </motion.div>
      </div>
    </section>
  );
}
