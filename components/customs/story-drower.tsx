"use client";

import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface StoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audioUrl: string | undefined;
}

const StoryDrawer = ({ open, onOpenChange, audioUrl }: StoryDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-4 p-8">
          <AudioPlayer
            src={audioUrl}
            autoPlay
            className="w-full rounded-lg bg-background!"
          />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default StoryDrawer;
