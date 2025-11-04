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
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./favorite-button";
import { motion } from "motion/react";

interface StoryPreviewProps {
  story: GetStoriesResponseType["stories"][number];
}

export const StoryPreview = ({ story }: StoryPreviewProps) => {
  const router = useRouter();
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className={cn(
          "w-full cursor-pointer h-full relative group",
          !story.ready && "animate-pulse"
        )}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/story/${story.id}`);
        }}
      >
        <CardHeader>
          <div className="flex items-center justify-between w-full overflow-hidden gap-2">
            <CardTitle className="truncate">{story.title}</CardTitle>
            <FavoriteButton story={story} />
          </div>
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
    </motion.div>
  );
};
