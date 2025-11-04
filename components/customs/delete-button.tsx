"use client";

import { Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStoryAction } from "@/actions/story";
import { toast } from "sonner";

interface DeleteButtonProps {
  id: string;
}

export const DeleteButton = ({ id }: DeleteButtonProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteStoryAction,
    onSuccess: async () => {
      router.push("/");
      toast.success("Story deleted successfully", { id: "delete-story" });
      await queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "delete-story" });
    },
  });

  const onDelete = (id: string) => {
    toast.loading("Deleting story...", { id: "delete-story" });
    mutate(id);
  };

  return (
    <Button
      variant="destructive"
      size={"icon"}
      onClick={() => onDelete(id)}
      disabled={isPending}
    >
      <Trash2Icon />
    </Button>
  );
};
