"use client";

import { GetStoryResponseType } from "@/app/api/story/route";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { motion, transform } from "motion/react";
import Markdown from "react-markdown";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useEffect, useState } from "react";
import { DeleteButton } from "./delete-button";
import { FavoriteButton } from "./favorite-button";
import { StoryDetailImage } from "./story-detail-image";

interface StoryDetailProps {
  id: string;
}

export const StoryDetail = ({ id }: StoryDetailProps) => {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: story, isPending } = useQuery<GetStoryResponseType>({
    queryKey: ["story-detail", id],
    queryFn: async () => {
      const response = await fetch("/api/story", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      return response.json();
    },
    // Use the fetched data to decide the refetch interval to avoid local synchronous setState in effects
    refetchInterval: (data) => (data.state.data?.ready ? false : 3000),
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isPending || !story) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <Loader2Icon className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full p-2 md:p-8 flex flex-col gap-8 h-screen relative">
      <motion.div
        className="fixed top-0 left-0 w-full h-1.5 bg-primary z-50 origin-left"
        style={{ scaleX }}
        transition={{ duration: 1 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX }}
      />
      <div className="flex items-center gap-2 justify-between px-2 sticky top-0 bg-background py-4 z-25">
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
        <div className="flex items-center gap-2">
          <FavoriteButton story={story} />
        </div>
      </div>
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 md:gap-16">
        <StoryDetailImage story={story} isPlaying={isPlaying} />
        <div className="flex flex-col gap-8 w-full">
          {story.audio_url ? (
            <AudioPlayer
              src={story.audio_url || ""}
              className="w-full rounded-lg bg-background!"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <AudioPlayer
                src={story.audio_url || ""}
                className="w-full rounded-lg bg-background! opacity-50"
              />
              <div className="text-xs text-muted-foreground px-2 animate-pulse">
                Audio is being generated
              </div>
            </div>
          )}
          {story.transcript ? (
            <ScrollArea className="h-screen md:h-auto p-4 border rounded-lg">
              <div className="whitespace-pre-wrap text-base md:text-lg">
                <Markdown>{story.transcript}</Markdown>
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
      <div className="flex items-center gap-2 justify-end w-full p-2 border rounded-md max-w-5xl mx-auto">
        <DeleteButton id={story.id} />
      </div>
    </div>
  );
};
