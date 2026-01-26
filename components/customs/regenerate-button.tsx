"use client";

import { RepeatIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface RegenerateButtonProps {
  id: string;
}

export const RegenerateButton = ({ id }: RegenerateButtonProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const story = await fetch("/api/update", {
        method: "POST",
        body: JSON.stringify({ id }),
      }).then((res) => res.json());

      return story;
    },
    onSuccess: async () => {
      toast.success("Story updated", {
        id: "story",
      });
      await queryClient.invalidateQueries({ queryKey: ["story-detail"] });
      await queryClient.invalidateQueries({ queryKey: ["navigation"] });
    },
    onError: () => {
      toast.error("Something went wrong", {
        id: "story",
      });
    },
  });

  return (
    <Button size={"icon"} onClick={() => mutate()} disabled={isPending}>
      <RepeatIcon />
    </Button>
  );
};
