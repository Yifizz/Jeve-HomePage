"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { Partner } from "../lib/partners";
import { PartnerLogo } from "./PartnerLogo";

const durations = [26000, 32000, 29000];
const wrapTime = (time: number, duration: number) => ((time % duration) + duration) % duration;

export function PartnersNetworkWall({ partners }: { partners: Partner[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.1 });
  const reduceMotion = useReducedMotion();
  const [columnCount, setColumnCount] = useState(3);
  const [dragging, setDragging] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const animations = useRef<Animation[]>([]);
  const heights = useRef<number[]>([]);
  const drag = useRef<{ id: number; y: number; times: number[]; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const running = useRef(false);
  running.current = inView && !reduceMotion && !keyboardNavigation;

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 760px)");
    const update = () => setColumnCount(mobile.matches ? 2 : 3);
    update();
    mobile.addEventListener("change", update);
    return () => mobile.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const index = tracks.current.findIndex((track) => track?.firstElementChild === entry.target);
        const track = tracks.current[index];
        const height = entry.target.getBoundingClientRect().height;
        if (!track || height <= 0 || height === heights.current[index]) continue;
        const duration = durations[index];
        const oldTime = Number(animations.current[index]?.currentTime ?? 0);
        animations.current[index]?.cancel();
        heights.current[index] = height;
        const animation = track.animate(
          [{ transform: "translate3d(0, 0, 0)" }, { transform: `translate3d(0, -${height}px, 0)` }],
          { duration, iterations: Infinity, easing: "linear" },
        );
        animation.currentTime = wrapTime(oldTime, duration);
        animations.current[index] = animation;
        if (!running.current || drag.current) animation.pause();
      }
    });
    tracks.current.slice(0, columnCount).forEach((track) => {
      if (track?.firstElementChild) observer.observe(track.firstElementChild);
    });
    return () => {
      observer.disconnect();
      animations.current.forEach((animation) => animation.cancel());
      animations.current = [];
      heights.current = [];
      drag.current = null;
    };
  }, [columnCount, reduceMotion]);

  useEffect(() => {
    animations.current.forEach((animation) => {
      if (inView && !reduceMotion && !keyboardNavigation && !drag.current) animation.play();
      else animation.pause();
    });
  }, [inView, reduceMotion, keyboardNavigation]);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || keyboardNavigation || !event.isPrimary || event.button !== 0 || drag.current) return;
    suppressClick.current = false;
    animations.current.forEach((animation) => animation.pause());
    drag.current = {
      id: event.pointerId,
      y: event.clientY,
      times: animations.current.map((animation) => Number(animation.currentTime ?? 0)),
      moved: false,
    };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    const distance = event.clientY - gesture.y;
    if (!gesture.moved && Math.abs(distance) < 6) return;
    if (!gesture.moved) {
      gesture.moved = true;
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    event.preventDefault();
    animations.current.forEach((animation, index) => {
      const height = heights.current[index];
      if (height) animation.currentTime = wrapTime(gesture.times[index] - distance / height * durations[index], durations[index]);
    });
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (running.current) animations.current.forEach((animation) => animation.play());
  }

  const columns = Array.from({ length: columnCount }, (_, column) =>
    partners.filter((_, index) => index % columnCount === column),
  );

  return (
    <div className="partner-network-animation" ref={ref}>
      {!reduceMotion && <p className="partner-network-hint" id="partner-network-instructions">Trascina verso l’alto o il basso per esplorare la rete.</p>}
      <div
        className="partner-network-wall"
        data-running={inView && !reduceMotion && !keyboardNavigation && !dragging ? "true" : "false"}
        data-reduced-motion={reduceMotion ? "true" : undefined}
        data-dragging={dragging ? "true" : undefined}
        data-keyboard-navigation={keyboardNavigation ? "true" : undefined}
        style={{ "--network-columns": columnCount } as CSSProperties}
        role="region"
        aria-label="I partner della nostra rete"
        aria-describedby={reduceMotion ? undefined : "partner-network-instructions"}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onPointerLeave={(event) => { if (!drag.current?.moved) endDrag(event); }}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }
        }}
        onFocusCapture={(event) => {
          if (event.target.matches(":focus-visible")) setKeyboardNavigation(true);
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardNavigation(false);
        }}
      >
        {columns.map((column, index) => (
          <div className="partner-network-column" key={index}>
            <div className="partner-network-track" ref={(element) => { tracks.current[index] = element; }}>
              {[0, 1].map((copy) => (
                <div className="partner-network-group" key={copy} aria-hidden={copy === 1 ? true : undefined} data-copy={copy === 0 ? "original" : "duplicate"}>
                  {column.map((partner) => (
                    <article className="partner-network-card" data-copy={copy === 0 ? "original" : "duplicate"} key={partner.name}>
                      <div className="partner-network-logo"><PartnerLogo partner={partner} /></div>
                      <h3>{partner.name}</h3>
                      {partner.href ? (
                        <a href={partner.href} target="_blank" rel="noreferrer" tabIndex={copy === 1 ? -1 : undefined} aria-label={`Visita il sito di ${partner.name}`}>Visita il sito</a>
                      ) : <span className="partner-network-note">Network del Triveneto</span>}
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
