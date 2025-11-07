"use client";

import { GetStoriesResponseType } from "@/app/api/stories/route";
import React from "react";

import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./favorite-button";
import { motion } from "motion/react";
import Markdown from "react-markdown";
import { Separator } from "../ui/separator";

interface StoryPreviewProps {
  story: GetStoriesResponseType["stories"][number];
}

export const StoryListPreview = ({ story }: StoryPreviewProps) => {
  const router = useRouter();
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="w-full border-b pb-8 border-primary "
      viewport={{ once: true }}
    >
      <div
        className={cn(
          "w-full cursor-pointer h-full relative group flex flex-col gap-4 px-2 md:px-8",
          !story.ready && "animate-pulse"
        )}
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/story/${story.id}`);
        }}
      >
        <div>
          <div className="flex items-center justify-between w-full overflow-hidden gap-2 py-4 ">
            <div className="truncate font-bold text-lg">{story.title}</div>
            <FavoriteButton story={story} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <Markdown>
              {story.transcript?.split("\n")[0] ||
                "The story and audio are all being generated. You’ll be able to explore the full experience as soon as it’s ready"}
            </Markdown>
          </div>
          <div className="w-full md:w-1/3">
            <AspectRatio className="relative w-full" ratio={16 / 9}>
              <Image
                src={story.image_url || "/placeholder.jpg"}
                alt={story.title || "Story Image"}
                fill
                className="object-cover rounded-md"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
