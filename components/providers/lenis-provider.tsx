"use client";

import { ReactLenis } from "lenis/react";
import { useRef } from "react";
export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const lenisRef = useRef(null);
  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1,
        duration: 2.5,
        smoothWheel: true,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
};
