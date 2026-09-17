"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  Cloud,
  fetchSimpleIcons,
  type ICloud,
  renderSimpleIcon,
  type SimpleIcon,
} from "react-icon-cloud";

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      paddingTop: 0,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
  },
};

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
  const bgHex = theme === "light" ? "#f3f2ef" : "#080510";
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff";
  const minContrastRatio = theme === "dark" ? 2 : 1.2;

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (event: { preventDefault: () => void }) => event.preventDefault(),
    },
  });
};

export type DynamicCloudProps = {
  iconSlugs: string[];
  localIcons?: Array<{
    src: string;
    title: string;
  }>;
};

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>;

export function IconCloud({ iconSlugs, localIcons = [] }: DynamicCloudProps) {
  const [data, setData] = useState<IconData | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let active = true;

    fetchSimpleIcons({ slugs: iconSlugs }).then((icons) => {
      if (active) setData(icons);
    });

    return () => {
      active = false;
    };
  }, [iconSlugs]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  const renderedIcons = useMemo(() => {
    if (!data) return null;

    return Object.values(data.simpleIcons).map((icon) =>
      renderCustomIcon(icon, resolvedTheme || "light"),
    );
  }, [data, resolvedTheme]);

  const renderedLocalIcons = useMemo(
    () =>
      localIcons.map((icon) => (
        <a
          key={icon.src}
          title={icon.title}
          onClick={(event) => event.preventDefault()}
        >
          <img
            src={icon.src}
            alt={icon.title}
            width={42}
            height={42}
            style={{ objectFit: "contain" }}
          />
        </a>
      )),
    [localIcons],
  );

  const responsiveCloudProps = useMemo<Omit<ICloud, "children">>(
    () => ({
      ...cloudProps,
      options: {
        ...cloudProps.options,
        maxSpeed: reducedMotion ? 0 : cloudProps.options?.maxSpeed,
        minSpeed: reducedMotion ? 0 : cloudProps.options?.minSpeed,
        dragControl: reducedMotion ? false : undefined,
      },
    }),
    [reducedMotion],
  );

  if (!renderedIcons) return <div className="icon-cloud-placeholder" />;

  return (
    // @ts-ignore The library's ReactFragment type predates React 19.
    <Cloud id="jeve-bridge-cloud" {...responsiveCloudProps}>
      <>
        {renderedIcons}
        {renderedLocalIcons}
      </>
    </Cloud>
  );
}
