"use client";

import FastMarquee from "react-fast-marquee";
import { useEffect, useRef } from "react";
import type {
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";

const MarqueeEngine = (
  typeof FastMarquee === "object" &&
  FastMarquee !== null &&
  "default" in FastMarquee
    ? (FastMarquee as unknown as { default: typeof FastMarquee }).default
    : FastMarquee
) as typeof FastMarquee;

type MotionSnapshot = {
  animation: Animation;
  duration: number;
  startTime: number;
};

type MarqueeProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  speed?: number;
};

function joinClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

function wrapTime(value: number, duration: number) {
  if (duration <= 0) return Math.max(value, 0);
  const wrapped = value % duration;
  return wrapped < 0 ? wrapped + duration : wrapped;
}

export function Marquee({
  ariaLabel,
  children,
  className,
  speed = 42,
}: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const suppressClickRef = useRef(false);
  const dragRef = useRef({
    active: false,
    moved: false,
    motions: [] as MotionSnapshot[],
    startX: 0,
  });

  const getMotions = () => {
    const tracks = rootRef.current?.querySelectorAll<HTMLElement>(
      ".rfm-marquee",
    );
    if (!tracks) return [];

    return Array.from(tracks).flatMap((track) =>
      track.getAnimations().map((animation) => {
        const timing = animation.effect?.getTiming();
        const duration =
          typeof timing?.duration === "number" ? timing.duration : 0;
        const currentTime = Number(animation.currentTime ?? 0);

        return {
          animation,
          duration,
          startTime: Number.isFinite(currentTime) ? currentTime : 0,
        };
      }),
    );
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const markDuplicateTrack = () => {
      const tracks = root.querySelectorAll<HTMLElement>(".rfm-marquee");

      tracks.forEach((track, index) => {
        if (index === 0) return;

        track.setAttribute("aria-hidden", "true");
        track
          .querySelectorAll<HTMLElement>(
            "a, button, input, select, textarea, [tabindex]",
          )
          .forEach((element) => element.setAttribute("tabindex", "-1"));
      });
    };

    const observer = new MutationObserver(markDuplicateTrack);
    observer.observe(root, { childList: true, subtree: true });
    markDuplicateTrack();

    return () => observer.disconnect();
  }, [children]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const motions = getMotions();
    motions.forEach(({ animation }) => animation.pause());

    dragRef.current = {
      active: true,
      moved: false,
      motions,
      startX: event.clientX,
    };
    rootRef.current?.classList.add("is-dragging");
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 4) drag.moved = true;

    const timeDelta = (-distance / speed) * 1000;
    drag.motions.forEach(({ animation, duration, startTime }) => {
      animation.currentTime = wrapTime(startTime + timeDelta, duration);
    });
    event.preventDefault();
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;

    suppressClickRef.current = dragRef.current.moved;
    dragRef.current.motions.forEach(({ animation }) => animation.play());
    dragRef.current.active = false;
    dragRef.current.motions = [];
    rootRef.current?.classList.remove("is-dragging");

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const timeDelta = (direction * 180 * 1000) / speed;

    getMotions().forEach(({ animation, duration, startTime }) => {
      animation.pause();
      animation.currentTime = wrapTime(startTime + timeDelta, duration);
      animation.play();
    });
  };

  return (
    <div
      ref={rootRef}
      className={joinClassNames("marquee-shell", className)}
      aria-label={ariaLabel}
      role="region"
      tabIndex={0}
      onClickCapture={handleClickCapture}
      onDragStart={(event) => event.preventDefault()}
      onKeyDown={handleKeyDown}
      onPointerCancel={finishDrag}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
    >
      <MarqueeEngine
        autoFill
        className="marquee-engine"
        gradient={false}
        pauseOnClick={false}
        pauseOnHover={false}
        play
        speed={speed}
      >
        {children}
      </MarqueeEngine>
    </div>
  );
}

export function MarqueeContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={joinClassNames("marquee-content", className)}
      {...props}
    />
  );
}

export function MarqueeItem({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={joinClassNames("marquee-item", className)} {...props} />
  );
}
