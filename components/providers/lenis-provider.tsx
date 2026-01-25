"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const lenis = useLenis();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (lenis) {
      lenis.stop();
    }

    const handleScrollToTop = () => {
      if (lenis) {
        lenis.start();
        window.scrollTo(0, 0);
      }
    };

    handleScrollToTop();
  }, [pathname, searchParams, lenis]);
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
