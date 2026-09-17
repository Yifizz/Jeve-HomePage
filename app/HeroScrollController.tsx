"use client";

import { useEffect } from "react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

type TransitionMetrics = {
  sceneTop: number;
  sceneHeight: number;
  heroHeight: number;
  mobile: boolean;
};

export function HeroScrollController() {
  useEffect(() => {
    const scene = document.querySelector<HTMLElement>(".hero-transition-scene");
    const hero = scene?.querySelector<HTMLElement>(".hero");
    const copy = hero?.querySelector<HTMLElement>(".hero-copy");
    const services = document.querySelector<HTMLElement>(".services-section");
    const servicesContent = services?.querySelector<HTMLElement>(
      ".services-scroll-content",
    );

    if (!scene || !hero || !copy || !services || !servicesContent) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let metrics: TransitionMetrics;
    let animationFrame = 0;
    let resizeFrame = 0;
    let renderedProgress = -1;
    let currentProgress = 0;
    let lastFrameTime = 0;
    let initialized = false;
    let lastViewportWidth = window.innerWidth;

    const measure = () => {
      metrics = {
        sceneTop: scene.offsetTop,
        sceneHeight: scene.offsetHeight,
        heroHeight: hero.offsetHeight,
        mobile: window.matchMedia("(max-width: 760px)").matches,
      };
      renderedProgress = -1;
    };

    const resetStyles = () => {
      copy.style.removeProperty("transform");
      copy.style.removeProperty("opacity");
      copy.style.removeProperty("filter");

      for (const property of [
        "--hero-transition-bg-y",
        "--hero-transition-bg-scale",
        "--hero-transition-bg-opacity",
        "--hero-edge-opacity",
        "--hero-depth-opacity",
        "--hero-depth-y",
        "--hero-depth-scale",
        "--hero-depth-blur",
        "--hero-grid-opacity",
        "--hero-grid-y",
        "--hero-grid-scale",
        "--hero-grid-blur",
      ]) {
        hero.style.removeProperty(property);
      }

      servicesContent.style.removeProperty("transform");
      servicesContent.style.removeProperty("opacity");
      servicesContent.style.removeProperty("filter");

      for (const property of [
        "--services-transition-blur-opacity",
        "--services-transition-blur-y",
        "--services-transition-blur-scale",
        "--services-transition-surface-opacity",
      ]) {
        services.style.removeProperty(property);
      }
    };

    const getScrollProgress = () => {
      const transitionDistance = Math.max(
        metrics.heroHeight,
        metrics.sceneHeight - metrics.heroHeight,
      );

      return clamp(
        (window.scrollY - metrics.sceneTop) / transitionDistance,
      );
    };

    const renderProgress = (progress: number) => {
      if (Math.abs(progress - renderedProgress) < 0.00005) return;
      renderedProgress = progress;

      const mobile = metrics.mobile;
      const copyY = -progress * (mobile ? 104 : 190);
      const copyZ = -progress * (mobile ? 250 : 650);
      const copyRotateX = progress * (mobile ? 1.5 : 4.2);
      const copyOpacity = clamp(1 - Math.pow(progress, 1.15));
      const copyBlur = Math.pow(progress, 1.65) * 6.5;

      copy.style.transform = `translate3d(0, ${copyY.toFixed(2)}px, ${copyZ.toFixed(2)}px) rotateX(${copyRotateX.toFixed(3)}deg)`;
      copy.style.opacity = copyOpacity.toFixed(4);
      copy.style.filter = mobile ? "none" : `blur(${copyBlur.toFixed(2)}px)`;

      hero.style.setProperty(
        "--hero-transition-bg-y",
        `${(-progress * metrics.heroHeight * 0.055).toFixed(2)}px`,
      );
      hero.style.setProperty(
        "--hero-transition-bg-scale",
        (1.28 - progress * 0.28).toFixed(4),
      );
      hero.style.setProperty(
        "--hero-transition-bg-opacity",
        (0.54 * (1 - progress * 0.78)).toFixed(4),
      );
      hero.style.setProperty(
        "--hero-edge-opacity",
        (1 - progress * 0.82).toFixed(4),
      );

      const depthWave =
        Math.pow(Math.max(0, Math.sin(progress * Math.PI)), 1.35) * 0.94;
      hero.style.setProperty("--hero-depth-opacity", depthWave.toFixed(4));
      hero.style.setProperty(
        "--hero-depth-y",
        `${((1 - progress) * 90 - progress * 36).toFixed(2)}px`,
      );
      hero.style.setProperty(
        "--hero-depth-scale",
        (1.22 - progress * 0.16).toFixed(4),
      );
      hero.style.setProperty(
        "--hero-depth-blur",
        mobile ? "20px" : `${(28 - progress * 14).toFixed(2)}px`,
      );

      const servicesProgress = clamp((progress - 0.34) / 0.66);
      const gridOpacity =
        Math.sin(servicesProgress * Math.PI) * (mobile ? 0.3 : 0.52);
      hero.style.setProperty(
        "--hero-grid-opacity",
        Math.max(0, gridOpacity).toFixed(4),
      );
      hero.style.setProperty(
        "--hero-grid-y",
        `${((1 - servicesProgress) * 110).toFixed(2)}px`,
      );
      hero.style.setProperty(
        "--hero-grid-scale",
        (1.12 - servicesProgress * 0.12).toFixed(4),
      );
      hero.style.setProperty(
        "--hero-grid-blur",
        mobile ? "0px" : `${((1 - servicesProgress) * 12).toFixed(2)}px`,
      );

      const servicesY = (1 - servicesProgress) * (mobile ? 72 : 140);
      const servicesZ = (1 - servicesProgress) * (mobile ? -130 : -320);
      const servicesRotateX =
        (1 - servicesProgress) * (mobile ? 1 : 2.6);
      const servicesOpacity = 0.08 + servicesProgress * 0.92;
      const servicesBlur = Math.pow(1 - servicesProgress, 1.5) * 14;

      servicesContent.style.transform = `translate3d(0, ${servicesY.toFixed(2)}px, ${servicesZ.toFixed(2)}px) rotateX(${servicesRotateX.toFixed(3)}deg)`;
      servicesContent.style.opacity = servicesOpacity.toFixed(4);
      servicesContent.style.filter = mobile
        ? "none"
        : `blur(${servicesBlur.toFixed(2)}px)`;

      const bridgeOpacity =
        0.16 + Math.sin(servicesProgress * Math.PI) * 0.72;
      services.style.setProperty(
        "--services-transition-blur-opacity",
        Math.max(0.16, bridgeOpacity).toFixed(4),
      );
      services.style.setProperty(
        "--services-transition-blur-y",
        `${((1 - servicesProgress) * -64).toFixed(2)}px`,
      );
      services.style.setProperty(
        "--services-transition-blur-scale",
        (1.18 - servicesProgress * 0.18).toFixed(4),
      );
      services.style.setProperty(
        "--services-transition-surface-opacity",
        (0.18 + servicesProgress * 0.82).toFixed(4),
      );
    };

    const applyProgress = (timestamp: number) => {
      animationFrame = 0;
      if (reducedMotion.matches) return;

      const targetProgress = getScrollProgress();

      if (!initialized) {
        currentProgress = targetProgress;
        initialized = true;
      } else {
        const elapsed =
          lastFrameTime > 0 && timestamp - lastFrameTime < 120
            ? timestamp - lastFrameTime
            : 16.7;
        const smoothing = 1 - Math.exp(-elapsed / (metrics.mobile ? 46 : 72));
        currentProgress += (targetProgress - currentProgress) * smoothing;

        if (Math.abs(targetProgress - currentProgress) < 0.00008) {
          currentProgress = targetProgress;
        }
      }

      lastFrameTime = timestamp;
      renderProgress(currentProgress);

      if (currentProgress !== targetProgress) {
        animationFrame = window.requestAnimationFrame(applyProgress);
      }
    };

    const scheduleProgress = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(applyProgress);
      }
    };

    const scheduleMeasure = () => {
      if (resizeFrame) return;
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        const nextWidth = window.innerWidth;

        // Mobile browser chrome can change only the viewport height while the
        // user scrolls. The scene uses svh, so remeasuring that change would
        // make progress jump even though the physical scroll did not.
        if (metrics.mobile && nextWidth === lastViewportWidth) return;

        lastViewportWidth = nextWidth;
        measure();
        scheduleProgress();
      });
    };

    const updateMotionPreference = () => {
      if (reducedMotion.matches) {
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
        initialized = false;
        lastFrameTime = 0;
        resetStyles();
        return;
      }

      initialized = false;
      lastFrameTime = 0;
      measure();
      scheduleProgress();
    };

    measure();
    updateMotionPreference();

    const resizeObserver = new ResizeObserver(scheduleMeasure);
    resizeObserver.observe(scene);
    resizeObserver.observe(hero);
    resizeObserver.observe(services);

    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    reducedMotion.addEventListener("change", updateMotionPreference);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleMeasure);
      reducedMotion.removeEventListener("change", updateMotionPreference);
      resetStyles();
    };
  }, []);

  return null;
}
