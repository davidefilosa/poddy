import React, { useState } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { motion } from "motion/react";
import Image from "next/image";
import { GetStoryResponseType } from "@/app/api/story/route";
import { Button } from "../ui/button";
import { Repeat2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { regenerateImageAction } from "@/actions/story";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StoryDetailImageProps {
  story: GetStoryResponseType;
  isPlaying: boolean;
}

export const StoryDetailImage = ({
  story,
  isPlaying,
}: StoryDetailImageProps) => {
  const [regenerating, setRegenerating] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: regenerateImageAction,
    onSuccess: async () => {
      setRegenerating(false);
      toast.success("Image regenerated", { id: "regenerate-image" });
      await queryClient.invalidateQueries({
        queryKey: ["story-detail", story?.id],
      });
    },
    onError: () => {
      setRegenerating(false);
      toast.error("Something went wrong", { id: "regenerate-image" });
    },
  });

  const onRegenerate = (id?: string) => {
    if (!id) return;
    setRegenerating(true);
    mutate(id);
    toast.loading("Regenerating image...", { id: "regenerate-image" });
  };

  return (
    <div className="flex flex-col gap-8 w-full relative">
      <div className="absolute bottom-4 right-4 z-10 ">
        <Button onClick={() => onRegenerate(story?.id)} disabled={isPending}>
          <Repeat2Icon />
        </Button>
      </div>
      {story?.image_url ? (
        <AspectRatio
          ratio={16 / 9}
          className="w-full rounded-lg overflow-hidden"
        >
          <motion.img
            src={story.image_url}
            alt="Story Image"
            className={cn(
              "object-cover w-full h-full",
              regenerating && "animate-pulse"
            )}
            animate={{ scale: isPlaying ? 1.5 : 1 }}
            initial={{ scale: 1, opacity: 0 }}
            whileInView={{ opacity: 1, transition: { duration: 1 } }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
              repeatType: "reverse",
            }}
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
  );
};
