"use client";

import { useEffect, useMemo, useState } from "react";

export function HeroWordRotator() {
  const [activeWord, setActiveWord] = useState(0);
  const words = useMemo(
    () => ["valore.", "relazioni.", "crescita.", "futuro."],
    [],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setActiveWord((current) => (current + 1) % words.length);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [activeWord, words]);

  return (
    <span className="hero-word-line" aria-live="polite">
      {words.map((word, index) => {
        const state =
          activeWord === index
            ? "is-active"
            : activeWord > index
              ? "is-before"
              : "is-after";

        return (
          <em
            className={`hero-word ${state}`}
            aria-hidden={activeWord !== index}
            key={word}
          >
            {word}
          </em>
        );
      })}
    </span>
  );
}
