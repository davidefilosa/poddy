"use client";

import { useModalStore } from "@/stores/use-modal-store";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { PlusCircleIcon } from "lucide-react";

export const OpenButton = () => {
  const { setOpen } = useModalStore();

  return (
    <Card
      className="w-full cursor-pointer h-fit relative group"
      onClick={() => setOpen(true)}
    >
      <div className="absolute top-0 left-0 h-full w-full z-50 flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity">
        <PlusCircleIcon className="size-50" />
      </div>
      <CardHeader>
        <CardTitle>Create Story</CardTitle>
        <CardDescription className="line-clamp-4">
          Click to create a new story based on your chosen topic.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AspectRatio className="relative w-full" ratio={16 / 9}>
          <Image
            src="/story.jpg"
            alt="Create Story"
            fill
            className="object-cover rounded-md"
          />
        </AspectRatio>
      </CardContent>
    </Card>
  );
};
