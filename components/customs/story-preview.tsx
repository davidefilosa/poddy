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

interface StoryPreviewProps {
  story: GetStoriesResponseType[number];
}

export const StoryPreview = ({ story }: StoryPreviewProps) => {
  const router = useRouter();
  return (
    <Card
      className="w-full cursor-pointer h-fit relative group"
      onClick={() => router.push(`/story/${story.id}`)}
    >
      <div className="absolute top-0 left-0 h-full w-full z-50 flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity">
        <PlayCircleIcon className="size-50" />
      </div>
      <CardHeader>
        <CardTitle>{story.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {story.transcript}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AspectRatio className="relative w-full" ratio={16 / 9}>
          <Image
            src={story.image_url}
            alt={story.title}
            fill
            className="object-cover rounded-md"
          />
        </AspectRatio>
      </CardContent>
    </Card>
  );
};
