"use client";

import { ArrowUpCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";

export const ScrollButton = () => {
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 750);
  });

  return (
    <motion.div
      className={cn(
        "fixed bottom-6 z-50 origin-center",
        isMobile ? "left-6" : "right-6"
      )}
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={
        visible
          ? { scale: 1, opacity: 1, y: 0 }
          : { scale: 0, opacity: 0, y: 20 }
      }
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Button
        size={"icon-lg"}
        className="rounded-full shadow-lg"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <ArrowUpCircleIcon />
      </Button>
    </motion.div>
  );
};
