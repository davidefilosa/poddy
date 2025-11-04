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
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";

export const OpenButton = () => {
  const { setOpen } = useModalStore();
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size={"icon-lg"}
            onClick={() => setOpen(true)}
            className="rounded-full shadow-lg"
          >
            <PlusCircleIcon />
          </Button>
        </div>
      ) : (
        <Card
          className="w-full cursor-pointer h-full relative group"
          onClick={() => setOpen(true)}
        >
          <CardHeader>
            <CardTitle>Create Story</CardTitle>
            <CardDescription className="line-clamp-2">
              Click to create a new story based on your chosen topic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
              <PlusCircleIcon className="size-50" />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
