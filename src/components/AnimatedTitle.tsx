"use client";

import { motion } from "motion/react";

export function AnimatedTitle() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: "100%", 
      rotateX: -40,
      filter: "blur(10px)" 
    },
    visible: {
      opacity: 1,
      y: "0%",
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 18,
        mass: 1.2
      },
    },
  };

  const line1 = "El lago te necesita.".split(" ");
  const line2 = "Actúa hoy.".split(" ");

  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tighter leading-[1.05] text-balance text-foreground drop-shadow-2xl flex flex-col items-center gap-2 md:gap-4 perspective-1000"
    >
      <span className="flex flex-wrap justify-center gap-[0.3em] pb-2">
        {line1.map((word, index) => (
          <span key={index} className="overflow-hidden inline-block pb-2 -mb-2">
            <motion.span variants={wordVariants} className="inline-block transform-origin-bottom">
              {word}
            </motion.span>
          </span>
        ))}
      </span>
      <span className="flex flex-wrap justify-center gap-[0.3em] text-transparent bg-clip-text bg-gradient-to-br from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-500 pb-2">
        {line2.map((word, index) => (
          <span key={index} className="overflow-hidden inline-block pb-2 -mb-2">
            <motion.span variants={wordVariants} className="inline-block transform-origin-bottom">
              {word}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.h1>
  );
}
