"use client";

import { ChevronDownIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
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
import { RegenerateButton } from "./regenerate-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DeleteButtonProps {
  id: string;
}

export const Tools = ({ id }: DeleteButtonProps) => {
  const [open, setOpen] = useState(false);
  const { setOpen: setOpenModal } = useModalStore();
  const [isVisible, setIsVisible] = useState(false);
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

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
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
      <div
        className={cn(
          "flex items-center gap-2 justify-between w-full p-2 rounded-lg max-w-5xl mx-auto",
          isVisible ? "bg-secondary/50  transition-all duration-300" : "",
        )}
      >
        <Button size={"icon"} variant={"outline"} onClick={toggleVisibility}>
          <ChevronDownIcon
            className={cn(
              "-rotate-90 transition-all duration-300 delay-300",
              isVisible && "rotate-0",
            )}
          />
        </Button>
        <div
          className={cn(
            "flex gap-6 transition-opacity duration-300",
            isVisible ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger>
                <RegenerateButton id={id} />
              </TooltipTrigger>
              <TooltipContent>
                <p>Regenerate Story</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="destructive"
                  size={"icon"}
                  disabled={isPending}
                  onClick={() => setOpen(true)}
                >
                  <Trash2Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Story</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size={"icon"}
                disabled={isPending}
                onClick={() => setOpenModal(true)}
              >
                <PlusCircleIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create New Story</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
};
