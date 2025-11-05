"use client";

import { HeartIcon } from "lucide-react";
import { Button } from "../ui/button";
import { GetStoryResponseType } from "@/app/api/story/route";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavoriteStoryAction } from "@/actions/story";

interface FavoriteButtonProps {
  story: GetStoryResponseType;
}

export const FavoriteButton = ({ story }: FavoriteButtonProps) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: toggleFavoriteStoryAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["stories"] });
      await queryClient.invalidateQueries({
        queryKey: ["story-detail", story?.id],
      });
    },
  });

  if (!story) return null;

  return (
    <Button
      size={"icon"}
      variant="ghost"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        mutate(story.id);
      }}
      disabled={isPending}
      className="shrink-0"
    >
      <HeartIcon
        className={cn(
          story.isFavorite ? "text-red-500 fill-red-500" : "text-black"
        )}
      />
    </Button>
  );
};
