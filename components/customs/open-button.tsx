"use client";

import { useModalStore } from "@/stores/use-modal-store";
import React, { useState } from "react";

import { PlusCircleIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import { useMotionValueEvent, useScroll, motion } from "motion/react";
import { useLayoutStore } from "@/stores/use-layout-store";

export const OpenButton = () => {
  const { setOpen } = useModalStore();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 450);
  });
  const { layout } = useLayoutStore();

  const isMobile = useIsMobile();

  return (
    <>
      {isMobile || layout === "list" ? (
        <div className="z-50">
          <Button
            size={"icon-lg"}
            onClick={() => setOpen(true)}
            className="rounded-full shadow-lg"
          >
            <PlusCircleIcon className="size-6" />
          </Button>
        </div>
      ) : (
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
            onClick={() => setOpen(true)}
            className="rounded-full shadow-lg"
          >
            <PlusCircleIcon className="size-6" />
          </Button>
        </motion.div>
      )}
    </>
  );
};
