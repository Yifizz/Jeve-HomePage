"use client";

import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
} from "../components/ui/marquee";
import type { Partner } from "../lib/partners";

export type { Partner } from "../lib/partners";

function PartnerCard({ partner }: { partner: Partner }) {
  const className = `partner-card${!partner.src ? " partner-card-wordmark" : ""}`;
  const content = partner.src ? (
    <span className="partner-logo-box">
      <img
        src={partner.src}
        alt={partner.name}
        className={partner.logoClass}
        draggable={false}
        loading="lazy"
      />
    </span>
  ) : (
    <span className="partner-wordmark">{partner.name}</span>
  );

  if (!partner.href) {
    return (
      <div
        className={className}
        aria-label={partner.name}
        role="img"
      >
        {content}
      </div>
    );
  }

  return (
    <a
      className={className}
      href={partner.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Visita il sito di ${partner.name}`}
      draggable={false}
    >
      {content}
    </a>
  );
}

export function PartnersMarquee({ partners }: { partners: Partner[] }) {
  return (
    <Marquee
      ariaLabel="Partner di JEVE. Scorrimento automatico attivo; trascina orizzontalmente o usa le frecce."
      className="partners-marquee"
      speed={42}
    >
      <MarqueeContent className="partners-group">
        {partners.map((partner) => (
          <MarqueeItem className="partner-marquee-item" key={partner.name}>
            <PartnerCard partner={partner} />
          </MarqueeItem>
        ))}
      </MarqueeContent>
    </Marquee>
  );
}
