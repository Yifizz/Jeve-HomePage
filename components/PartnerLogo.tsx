import type { Partner } from "../lib/partners";

export function PartnerLogo({ partner }: { partner: Partner }) {
  if (!partner.src) {
    return <span className="partner-mark-wordmark">{partner.name}</span>;
  }

  const className = [
    "partner-mark",
    partner.logoClass?.includes("partner-logo-black") ? "partner-mark-black" : "",
    partner.name === "5JES" ? "partner-mark-5jes" : "",
  ].filter(Boolean).join(" ");

  return (
    <img
      className={className}
      src={partner.src}
      alt={partner.name}
      draggable={false}
    />
  );
}
