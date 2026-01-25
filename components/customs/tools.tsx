"use client";

import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStoryAction } from "@/actions/story";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useModalStore } from "@/stores/use-modal-store";

interface DeleteButtonProps {
  id: string;
}

export const Tools = ({ id }: DeleteButtonProps) => {
  const [open, setOpen] = useState(false);
  const { setOpen: setOpenModal } = useModalStore();
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
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              story.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex items-center gap-2 justify-end w-full p-2  border rounded-lg max-w-5xl mx-auto">
        <div className="flex gap-2">
          <Button
            size={"icon"}
            disabled={isPending}
            onClick={() => setOpenModal(true)}
          >
            <PlusCircleIcon />
          </Button>
          <Button
            variant="destructive"
            size={"icon"}
            disabled={isPending}
            onClick={() => setOpen(true)}
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>
    </>
  );
};
