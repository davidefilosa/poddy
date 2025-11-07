"use client";

import { ArrowUpCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";

export const ScrollButton = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 750);
  });

  return (
    <motion.div
      className="origin-center"
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
        variant={"secondary"}
        className="rounded-full shadow-lg"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <ArrowUpCircleIcon className="size-6" />
      </Button>
    </motion.div>
  );
};
