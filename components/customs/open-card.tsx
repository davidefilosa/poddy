"use client";

import { useModalStore } from "@/stores/use-modal-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PlusCircleIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
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
            <CardTitle>Create Story</CardTitle>
            <CardDescription className="line-clamp-2">
              Click to create a new story based on your chosen topic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-10 border p-8 rounded-md  flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity duration-1000">
              <PlusCircleIcon className="size-40" />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
