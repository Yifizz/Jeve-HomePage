"use client";

import { useEffect, useRef, useState } from "react";

export function MobileMenu({ homePrefix = "" }: { homePrefix?: string }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (
        isOpen &&
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.documentElement.classList.toggle("menu-open", isOpen);

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
      document.documentElement.classList.remove("menu-open");
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className={`mobile-menu${isOpen ? " is-open" : ""}`} ref={menuRef}>
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Chiudi il menu" : "Apri il menu"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav
        id="mobile-navigation"
        aria-label="Navigazione mobile"
        aria-hidden={!isOpen}
      >
        <a href={`${homePrefix}#servizi`} onClick={closeMenu} tabIndex={isOpen ? 0 : -1}>
          Servizi
        </a>
        <a href={`${homePrefix}#chi-siamo`} onClick={closeMenu} tabIndex={isOpen ? 0 : -1}>
          Chi siamo
        </a>
        <a
          href="https://jeve.it/entra-in-jeve/"
          target="_blank"
          rel="noreferrer"
          onClick={closeMenu}
          tabIndex={isOpen ? 0 : -1}
        >
          Entra in JEVE
        </a>
      </nav>
    </div>
  );
}
