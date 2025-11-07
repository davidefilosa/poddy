"use client";

import { useLayoutStore } from "@/stores/use-layout-store";
import { Button } from "../ui/button";
import { GridIcon, ListIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const LayoutButton = () => {
  const { layout, setLayout } = useLayoutStore();
  const isMobile = useIsMobile();
  return (
    <>
      {!isMobile && (
        <Button
          variant={"secondary"}
          size={"icon-lg"}
          onClick={() => setLayout(layout === "grid" ? "list" : "grid")}
        >
          {layout === "grid" ? <ListIcon /> : <GridIcon />}
        </Button>
      )}
    </>
  );
};
