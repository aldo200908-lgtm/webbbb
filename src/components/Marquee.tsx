"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;
    
    // Animate text infinitely to the left
    const width = textRef.current.scrollWidth / 2;
    
    gsap.to(textRef.current, {
      x: -width,
      duration: 20,
      ease: "none",
      repeat: -1,
    });
  }, []);

  const content = "• ACCIÓN CIUDADANA • PROTEGE EL LAGO • GANA RECOMPENSAS • IMPACTO REAL ";

  return (
    <div 
      ref={containerRef} 
      className="w-full bg-brand-500 text-brand-50 py-4 overflow-hidden border-y border-brand-400/30 shadow-inner relative z-20"
    >
      <div 
        ref={textRef} 
        className="whitespace-nowrap flex font-bold tracking-widest text-sm md:text-base opacity-90"
        style={{ width: 'fit-content' }}
      >
        <div className="flex px-4">{content}</div>
        <div className="flex px-4">{content}</div>
        <div className="flex px-4">{content}</div>
        <div className="flex px-4">{content}</div>
      </div>
    </div>
  );
}
