"use client";

import { IconCloud } from "./ui/interactive-icon-cloud";

const bridgeIconSlugs = [
  "notion",
  "figma",
  "github",
  "instagram",
  "canva",
  "google",
  "wordpress",
  "gmail",
  "googlecalendar",
  "googledrive",
  "googledocs",
  "googlesheets",
  "javascript",
  "typescript",
  "html5",
  "css3",
];

const localBridgeIcons = [
  { src: "/brand-icons/linkedin.svg", title: "LinkedIn" },
  { src: "/brand-icons/power-bi.svg", title: "Power BI" },
];

export function AboutBridgeVisual() {
  return (
    <div
      className="about-visual about-bridge"
      role="img"
      aria-label="JEVE collega il talento universitario alle esigenze delle imprese"
    >
      <div className="bridge-cloud" aria-hidden="true">
        <IconCloud iconSlugs={bridgeIconSlugs} localIcons={localBridgeIcons} />
      </div>

      <div className="bridge-orbit bridge-orbit-one" aria-hidden="true" />
      <div className="bridge-orbit bridge-orbit-two" aria-hidden="true" />

      <div className="bridge-core">
        <span className="bridge-core-ring" aria-hidden="true" />
        <img src="/jeve-red-transparent.png" alt="JEVE" />
      </div>
    </div>
  );
}
