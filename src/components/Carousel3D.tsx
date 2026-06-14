"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Carousel3DProps {
  items: React.ReactNode[];
  autoPlayInterval?: number;
}

export function Carousel3D({ items, autoPlayInterval = 6000 }: Carousel3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [items.length, autoPlayInterval]);

  const goToItem = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 800 : -800,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 30 : -30,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 800 : -800,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 30 : -30,
    })
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Container for the cards */}
      <div className="relative w-full max-w-5xl min-h-[650px] md:min-h-[450px] flex justify-center items-center perspective-1000">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.5 },
              rotateY: { type: "spring", stiffness: 200, damping: 25 },
              scale: { type: "spring", stiffness: 200, damping: 25 }
            }}
            className="absolute w-full h-full flex justify-center items-center"
          >
            {items[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-4 mt-8 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToItem(idx)}
            className={`h-3 rounded-full transition-all duration-500 ease-out ${
              idx === currentIndex 
                ? "bg-brand-500 w-10 shadow-[0_0_15px_rgba(var(--brand-500),0.6)]" 
                : "bg-zinc-300 dark:bg-zinc-700 w-3 hover:bg-zinc-400 dark:hover:bg-zinc-600 hover:scale-125"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
