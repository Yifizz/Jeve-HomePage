"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { type ReactNode, useEffect, useRef, useState } from "react";

export type TimelineEntry = {
  title: string;
  content: ReactNode;
};

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const element = measureRef.current;
    if (!element) return;

    const measure = () => setHeight(element.getBoundingClientRect().height);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const container = measureRef.current;
    if (!container) return;

    const desktopPointer = window.matchMedia(
      "(min-width: 761px) and (hover: hover)",
    );
    let observer: IntersectionObserver | null = null;

    const updateObserver = () => {
      observer?.disconnect();
      observer = null;
      setActiveIndex(null);

      if (!desktopPointer.matches) return;

      const entries = Array.from(
        container.querySelectorAll<HTMLElement>(".timeline-entry"),
      );
      observer = new IntersectionObserver(
        (observedEntries) => {
          const visibleEntry = observedEntries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
            )
            .at(-1);

          if (!visibleEntry) return;
          const index = Number(
            (visibleEntry.target as HTMLElement).dataset.index,
          );
          if (Number.isFinite(index)) setActiveIndex(index);
        },
        {
          rootMargin: "-16% 0px -68% 0px",
          threshold: 0,
        },
      );

      entries.forEach((entry) => observer?.observe(entry));
    };

    updateObserver();
    desktopPointer.addEventListener("change", updateObserver);

    return () => {
      observer?.disconnect();
      desktopPointer.removeEventListener("change", updateObserver);
    };
  }, [data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 12%", "end 55%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

  return (
    <div className="timeline-root" ref={containerRef}>
      <div className="timeline-measure" ref={measureRef}>
        {data.map((item, index) => (
          <div
            className={`timeline-entry${activeIndex === index ? " is-active" : ""}`}
            data-index={index}
            key={`${item.title}-${index}`}
          >
            <div
              className="timeline-marker"
              aria-current={activeIndex === index ? "step" : undefined}
            >
              <span className="timeline-dot-shell" aria-hidden="true">
                <span className="timeline-dot" />
              </span>
              <h3>{item.title}</h3>
            </div>
            <div className="timeline-entry-content">{item.content}</div>
          </div>
        ))}

        <div
          className="timeline-line"
          style={{ height: `${height}px` }}
          aria-hidden="true"
        >
          <motion.div
            className="timeline-line-progress"
            style={{ height: heightTransform, opacity: opacityTransform }}
          />
        </div>
      </div>
    </div>
  );
}
