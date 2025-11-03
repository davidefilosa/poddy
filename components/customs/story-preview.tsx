"use client";

import { GetStoriesResponseType } from "@/app/api/stories/route";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useRouter } from "next/navigation";
import { PlayCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryPreviewProps {
  story: GetStoriesResponseType["stories"][number];
}

export const StoryPreview = ({ story }: StoryPreviewProps) => {
  const router = useRouter();
  return (
    <Card
      className={cn(
        "w-full cursor-pointer h-full relative group",
        !story.ready && "animate-pulse"
      )}
      onClick={() => {
        router.push(`/story/${story.id}`);
      }}
    >
      {story.ready && (
        <div className="absolute top-0 left-0 h-full w-full z-50 flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity">
          <PlayCircleIcon className="size-50" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="truncate">{story.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {story.transcript ||
            "The story and audio are all being generated. You’ll be able to explore the full experience as soon as it’s ready"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AspectRatio className="relative w-full" ratio={16 / 9}>
          <Image
            src={story.image_url || "/placeholder.jpg"}
            alt={story.title || "Story Image"}
            fill
            className="object-cover rounded-md"
          />
        </AspectRatio>
      </CardContent>
    </Card>
  );
};
