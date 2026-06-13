"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

export function StickyStack({ cards }: { cards: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>(".stack-card");
      
      cardEls.forEach((card, i) => {
        // Last card doesn't need to shrink or pin its successor
        if (i === cardEls.length - 1) {
          return;
        }

        // Pin the current card
        ScrollTrigger.create({
          trigger: card,
          start: "top top+=100", // pin when it's near the top (offset for nav)
          endTrigger: cardEls[cardEls.length - 1],
          end: "top top+=100",
          pin: true,
          pinSpacing: false,
        });

        // Shrink the current card, blur it, and rotate it back in 3D
        gsap.to(card, {
          scale: 0.85,
          opacity: 0.2,
          rotationX: -10,
          y: -20,
          filter: "blur(12px)",
          ease: "none",
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: "top bottom",
            end: "top top+=100",
            scrub: true,
          },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={ref} className="relative w-full" style={{ perspective: "1500px" }}>
      {cards.map((card, i) => (
        <div
          key={i}
          className="stack-card sticky top-[100px] flex items-center justify-center mb-24 md:mb-32 last:mb-0 transform-gpu"
          style={{ transformOrigin: "top center", willChange: "transform, filter, opacity" }}
        >
          {card}
        </div>
      ))}
    </div>
  );
}
