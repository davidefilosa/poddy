"use client";

import { GetStoryResponseType } from "@/app/api/story/route";
import { useQuery } from "@tanstack/react-query";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { ArrowLeftIcon, Loader2Icon, PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import "react-h5-audio-player/lib/styles.css";
import { useState } from "react";
import StoryDrawer from "./story-drower";

interface StoryDetailProps {
  id: string;
}

export const StoryDetail = ({ id }: StoryDetailProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: story, isPending } = useQuery<GetStoryResponseType>({
    queryKey: ["story-detail", id],
    queryFn: async () => {
      const response = await fetch("/api/story", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      return response.json();
    },
  });

  if (isPending || !story) {
    return (
      <div className="w-full flex items-center justify-center">
        <Loader2Icon className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full p-2 md:p-8 flex flex-col gap-8 h-screen">
      <div className="flex items-center gap-4 justify-between">
        <Button size={"icon-lg"} variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon />
        </Button>
        <h1 className="text-base md:text-3xl font-bold">{story.title}</h1>
        <Button size={"icon-lg"} onClick={() => setOpen(true)}>
          <PlayIcon />
        </Button>
      </div>
      <div className="flex flex-col gap-8 w-full">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={story.image_url}
            alt={story.title}
            fill
            className="object-cover rounded-md"
          />
        </AspectRatio>
        <ScrollArea className="w-full">
          <p>{story.transcript}</p>
        </ScrollArea>
      </div>
      <StoryDrawer
        open={open}
        onOpenChange={setOpen}
        audioUrl={story.audio_url}
      />
    </div>
  );
};
