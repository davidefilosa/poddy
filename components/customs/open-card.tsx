"use client";

import { useModalStore } from "@/stores/use-modal-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { Button } from "../ui/button";
import { PlusCircleIcon } from "lucide-react";

export const OpenCard = () => {
  const { setOpen } = useModalStore();
  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile && (
        <Card
          className="w-full cursor-pointer h-full relative group hover:scale-102 transition-transform duration-1000"
          onClick={() => setOpen(true)}
        >
          <CardHeader>
            <div className="flex items-center justify-between w-full overflow-hidden gap-2">
              <CardTitle>Create Story</CardTitle>
              <Button size={"icon"} variant="ghost">
                <PlusCircleIcon />
              </Button>
            </div>
            <CardDescription className="line-clamp-2">
              Click to create a new story based on your chosen topic. Our AI
              will generate a unique narrative just for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AspectRatio className="relative w-full" ratio={16 / 9}>
              <Image
                src={"/placeholder.jpg"}
                alt={"Story Image"}
                fill
                className="object-cover rounded-md"
              />
            </AspectRatio>
          </CardContent>
        </Card>
      )}
    </>
  );
};
