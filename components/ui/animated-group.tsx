"use client";

import React, { type AriaRole, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type PresetType =
  | "fade"
  | "slide"
  | "scale"
  | "blur"
  | "blur-slide"
  | "zoom"
  | "flip"
  | "bounce"
  | "rotate"
  | "swing";

type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  role?: AriaRole;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  preset?: PresetType;
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.12,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const springTransition = {
  type: "spring" as const,
  stiffness: 105,
  damping: 18,
  mass: 0.9,
};

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  fade: {
    container: defaultContainerVariants,
    item: defaultItemVariants,
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 28 },
      visible: { opacity: 1, y: 0, transition: springTransition },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: springTransition },
    },
  },
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(8px)" },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      },
    },
  },
  "blur-slide": {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: 46, scale: 0.96 },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        scale: 1,
        transition: springTransition,
      },
    },
  },
  zoom: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0.6 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 280, damping: 22 },
      },
    },
  },
  flip: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, rotateX: -78 },
      visible: {
        opacity: 1,
        rotateX: 0,
        transition: { type: "spring", stiffness: 260, damping: 22 },
      },
    },
  },
  bounce: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: -44 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 360, damping: 12 },
      },
    },
  },
  rotate: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, rotate: -12 },
      visible: {
        opacity: 1,
        rotate: 0,
        transition: { type: "spring", stiffness: 190, damping: 18 },
      },
    },
  },
  swing: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, rotate: -7 },
      visible: {
        opacity: 1,
        rotate: 0,
        transition: { type: "spring", stiffness: 260, damping: 12 },
      },
    },
  },
};

function AnimatedGroup({
  children,
  className,
  itemClassName,
  role,
  variants,
  preset,
}: AnimatedGroupProps) {
  const reduceMotion = useReducedMotion();
  const selectedVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };
  const containerVariants = variants?.container || selectedVariants.container;
  const itemVariants = variants?.item || selectedVariants.item;

  return (
    <motion.div
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={containerVariants}
      className={cn(className)}
      role={role}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          className={cn("animated-group-item", itemClassName)}
          key={index}
          variants={itemVariants}
          role="presentation"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export { AnimatedGroup };
