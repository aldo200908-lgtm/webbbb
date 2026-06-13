"use client";

import { motion } from "motion/react";

export function AnimatedTitle() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
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
      className="text-5xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[1.05] text-balance text-foreground drop-shadow-2xl flex flex-col items-center gap-2"
    >
      <span className="flex flex-wrap justify-center gap-[0.3em]">
        {line1.map((word, index) => (
          <motion.span key={index} variants={wordVariants} className="inline-block">
            {word}
          </motion.span>
        ))}
      </span>
      <span className="flex flex-wrap justify-center gap-[0.3em] text-brand-500 dark:text-brand-400 drop-shadow-md">
        {line2.map((word, index) => (
          <motion.span key={index} variants={wordVariants} className="inline-block">
            {word}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  );
}
