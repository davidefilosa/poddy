"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent } from "../ui/drawer";
import { Dialog, DialogContent } from "../ui/dialog";

export const ResponsiveModal = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>{children}</DrawerContent>
      </Drawer>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
