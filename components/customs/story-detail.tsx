"use client";

import { GetStoryResponseType } from "@/app/api/story/route";
import { useQuery } from "@tanstack/react-query";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { motion, transform } from "motion/react";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface StoryDetailProps {
  id: string;
}

export const StoryDetail = ({ id }: StoryDetailProps) => {
  const router = useRouter();
  const { data: story, isPending } = useQuery<GetStoryResponseType>({
    queryKey: ["story-detail", id],
    queryFn: async () => {
      const response = await fetch("/api/story", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      return response.json();
    },
    refetchInterval: 10000,
  });

  const keysToCheck = ["title", "audio_url", "image_url", "transcript"];

  const isCompletePercentage = Math.round(
    (Object.entries(story || {}).filter(([key, value]) => {
      // Only consider the specified keys
      if (!keysToCheck.includes(key)) return false;

      // Count if the value is not empty, null, or undefined
      return value !== "" && value !== null && value !== undefined;
    }).length /
      keysToCheck.length) *
      100
  );

  const scaleX = transform(isCompletePercentage, [0, 100], [0.2, 1]);

  if (isPending || !story) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <Loader2Icon className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full p-2 md:p-8 flex flex-col gap-8 h-screen">
      <motion.div
        className="fixed top-0 left-0 w-full h-1 bg-black z-50 origin-left"
        style={{ scaleX }}
        transition={{
          type: "spring",
          stiffness: 120, // controls the “tightness” of the spring
          damping: 20, // controls how much it bounces
          mass: 0.5, // affects the feel of the motion
        }}
      />
      <div className="flex items-center gap-4 justify-between px-2">
        <Button size={"icon-lg"} variant="ghost" onClick={() => router.back()}>
          <ArrowLeftIcon />
        </Button>
        {story.title ? (
          <h1 className="text-base md:text-3xl font-bold">{story.title}</h1>
        ) : (
          <div className="text-base md:text-3xl font-bold animate-pulse ">
            Generating title
          </div>
        )}
      </div>
      <div className="flex flex-col gap-8 w-full">
        {story.image_url ? (
          <AspectRatio
            ratio={16 / 9}
            className="w-full rounded-lg overflow-hidden"
          >
            <Image
              src={story.image_url}
              alt="Story Image"
              fill
              className="object-cover"
            />
          </AspectRatio>
        ) : (
          <AspectRatio
            ratio={16 / 9}
            className="w-full rounded-lg overflow-hidden"
          >
            <Image
              src={"/placeholder.jpg"}
              alt="Story Image"
              fill
              className="object-cover opacity-50"
            />
          </AspectRatio>
        )}
      </div>
      <div className="flex flex-col gap-8 w-full">
        {story.audio_url ? (
          <AudioPlayer
            src={story.audio_url || ""}
            className="w-full rounded-lg bg-background!"
          />
        ) : (
          <div className="flex flex-col gap-2">
            <AudioPlayer
              src={story.audio_url || ""}
              className="w-full rounded-lg bg-background!"
            />
            <div className="text-xs text-muted-foreground px-2 animate-pulse">
              Audio is being generated
            </div>
          </div>
        )}
        {story.transcript ? (
          <ScrollArea className="h-screen p-4 border rounded-lg">
            <div className="whitespace-pre-wrap text-base md:text-lg">
              {story.transcript}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center gap-2 border rounded-lg h-82 justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2Icon className="w-5 h-5 animate-spin" />
              <div className="text-xs text-muted-foreground">
                Content is being generated
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
