"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (lenis) {
      lenis.stop();
      console.log("Stop Lenis on route change");
    }

    const handleScrollToTop = () => {
      if (lenis) {
        lenis.start();
        window.scrollTo(0, 0);
        console.log("Scroll to top on route change");
      }
    };

    handleScrollToTop();
  }, [pathname, lenis]);
  return (
    <ReactLenis
      className="h-full"
      root
      options={{ lerp: 1.3, duration: 2.2, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  );
};
